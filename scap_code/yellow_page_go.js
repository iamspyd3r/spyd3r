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
var scrapYPGO = async (userId, source, block, sector, city, link,stateId,countryId) => {

    await getResult(userId, source, block, sector, city, link,stateId,countryId);

}

let getResult = async (userId, source, block, sector, city, link,stateId,countryId) => {

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        var flag = true;
        var pageUrl = link;

        rec=0;
        newRec=0;
        duplicateRec = 0;

        await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");

        await page.goto(link);

        await page.waitForSelector(".wrapperc");
        

        await page.screenshot({ path: 'test.png' });


        var aData = await page.evaluate(() => {
            var ddata = document.querySelector('body').innerHTML;
            return ddata;
        });

        await getDataYPGoNet(aData,userId, source, block, sector, city, link,stateId,countryId);

        while (flag) {
            await page.evaluate(() => {
                $(".button")[1].click();
            });

            await page.waitForSelector(".wrapperc");
            await page.waitForSelector(".button");

            await page.screenshot({ path: 'test.png' });

            var aData = await page.evaluate(() => {
                var ddata = document.querySelector('body').innerHTML;
                return ddata;
            });

            await getDataYPGoNet(aData,userId, source, block, sector, city, link,stateId,countryId);
            
            var islast = await page.evaluate(() => {
                //return $(".button")[1].classList.contains("disabled");
                return location.href;
            });
            console.log(islast);
            if(islast == pageUrl){
                flag = false;
                io.emit('rcv_status', { "finish": true });
                console.log("end");
            }else{
                pageUrl = islast;
            }

        }

        await browser.close();

    } catch (error) {
        console.log(error);
    }
}

let getDataYPGoNet = async (html, userId, source, block, sector, city, link,stateId,countryId) => {
    data = [];
    const $ = cheerio.load(html);
    $(".wrapperc div").each(function () {
        var name = $(this).find("h2 a").text();
        var number = $(this).find(".show-tel").text();
        var profession = "";
        if ((name != null && name != undefined && name != "") && (number != null && number != undefined && number != "")) {
            
            var re = {};

            var numArr = [];
            if (number.indexOf(',') > 0) {
                numArr = number.split(',');
            } else {
                numArr.push(number);
            }
            var i = 0;
            while (i < numArr.length) {
                re.name = name.replace("'", "''");
                re.number = numArr[i].trim().replace(/[^0-9]/g, "");
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
    });
}




module.exports = scrapYPGO;