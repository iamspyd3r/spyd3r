const express = require('express');
const sql = require('mssql');
const axios = require('axios');
const cheerio = require('cheerio');
var asyncLoop = require('node-async-loop');
const puppeteer = require('puppeteer');
var moment = require('moment');

var rec = 0;
var newRec = 0;
var duplicateRec = 0;
var scrapMahaDir = async (userId, source, block, sector, city, link,stateId,countryId) => {

    await getResult(userId, source, block, sector, city, link,stateId,countryId);

}

let getResult = async (userId, source, block, sector, city, link,stateId,countryId) => {

    (async () => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            var flag = true;

            await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");

            await page.goto(link); //'https://maharashtradirectory.com/product/abrasive-cutting-wheels.html'

            await page.waitForSelector(".row #result1");

            var aData = await page.evaluate(() => {
                var ddata = document.querySelector('body').innerHTML;
                return ddata;
            });

            await getDataMahaDir(aData, userId, source, block, sector, city, link,stateId,countryId);

            await browser.close();
            
        } catch (error) {
            console.log(error);
        }
    })();
}

let getDataMahaDir = async (html, userId, source, block, sector, city, link,stateId,countryId) => {
    data = [];
    const $ = cheerio.load(html);
    $(".row #result1").each(function () {
        var name = $(this).find("a div.mid-result-heading-fnt").text().trim();
        var numObj = $(this).find("div.mid-result-body-fnt")[1];
        var profession = $(this).find("div.mid-result-body-fnt")[2];
        profession = $(profession).text();//find("a").attr("title");
        var number = $(numObj).text().trim().replace("Tel No.", "");
        if ((name != null && name != undefined && name != "") && (number != null && number != undefined && number != "")) {
            var re = {};

            var cCode = "";
            if (number.indexOf('-') > 0) {
                var codeArr = number.split('-');
                cCode = codeArr[0].trim();
                number = codeArr[1].trim();
            }

            var numArr = [];
            if (number.indexOf('/') > 0) {
                numArr = number.split('/');
            } else {
                numArr.push(number);
            }
            var i = 0;
            while (i < numArr.length) {
                re.name = name.replace("'", "''");
                re.number = cCode + "" + numArr[i].trim().replace(/[^0-9]/g, "");
                re.profession = profession;
                data.push(re);

                rec++;

                i++;
            }

        }
    })
    console.log(data);
    asyncLoop(data, function (item, next) {

        var request = new sql.Request();
        var sqlStr = "select Id from LeadMaster where MobileNo='" + item.number + "' ";
        request.query(sqlStr, async (err, recordset) => {

            if (err) console.log(err)

            console.log(item.number + " " + recordset["recordsets"][0].length);
            if (recordset["recordsets"][0].length == 0) {
                console.log(userId + "," + sector + "," + source + ",'" + item.name + "','" + item.number + "','" + item.profession + "'," + city);
                var date = new Date();
                var entryDate = moment(date).format("YYYY-MM-DD");
                request.query("insert into LeadMaster(EntryDate,UserId,BlockId,SectorId,SourceId,Name,MobileNo,Profession,CityId,CountryId,StateId,ApproxIncome) values('"+entryDate+"'," + userId + "," + block + "," + sector + "," + source + ",'" + item.name + "','" + item.number + "','" + item.profession + "'," + city + "," + countryId + "," + stateId + ",'0') ", function (err, recordset) {
                    if (err) console.log(err)
                    io.emit('rcv_message', { "name": item.name, "number": item.number });
                    newRec++;
                    next();
                });
            } else {
                duplicateRec++;
                next();
            }

        });

        io.emit('rcv_count', { "totalScrape": rec, "newScrape": newRec, "duplicateScrape": duplicateRec });

    }, function (err) {
        if (err) {
            console.error('Error: ' + err.message);
            return;
        }

        console.log('Finished!');
        io.emit('rcv_status', { "finish": true });
            rec = 0;
            newRec = 0;
            duplicateRec = 0;
    });
}



module.exports = scrapMahaDir;