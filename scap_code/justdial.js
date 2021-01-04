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
var scrapJustdial = async (userId, source, block, sector, city, link,stateId,countryId) => {

    await getResult(userId, source, block, sector, city, link,stateId,countryId);

}

let getResult = async (userId, source, block, sector, city, link,stateId,countryId) => {

    try {
        var flag = true;
        var pageNumber = 1;

        rec=0;
        newRec=0;
        duplicateRec = 0;

        while (flag) {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");

            await page.goto(link+"/page-" + pageNumber); //https://www.justdial.com/Ahmedabad/Dhaba-Restaurants/nct-10158813/page-

            await page.waitFor(3000);

            await page.waitForSelector('.rslwrp');

            await page.evaluate(() => {
                window.scrollTo(0, 10000);
            });

            await page.waitFor(1000);

            var aData = await page.evaluate(() => {
                var ddata = document.querySelector('body').innerHTML;
                return ddata;
            });

            await getDataJustDial(aData, userId, source, block, sector, city, link,stateId,countryId);

            var lastClassName = await page.evaluate(() => {
                return document.querySelector("#srchpagination a:last-child").className;
            });
            console.log(lastClassName);
            if (lastClassName == "dis") {
                flag = false;
                
                io.emit('rcv_status', { "finish": true });
            }


            await browser.close();
            console.log("page Number " + pageNumber);
            pageNumber = pageNumber + 1;
        }
    } catch (error) {
        console.log(error);
        flag = false;
                
        io.emit('rcv_status', { "finish": true });
    }
}


let getDataJustDial = async (html, userId, source, block, sector, city, link,stateId,countryId) => {
    data = [];
    const $ = cheerio.load(html);

    $("ul.rsl li.cntanr").each(function (k) {
        var name = $(this).find("span.lng_cont_name").text();
        var proObj = $(this).find(".addrinftxt").text().trim().split(',');
        var profession = "";
        if (proObj.length > 0) {
            profession = proObj[0];
        }

        //console.log(name);
        $(this).find("p.contact-info").each(function (w) {
            var num = "";
            $(this).find("span").each(function (i) {
                //console.log($(this).text());
                if ($(this).hasClass("icon-acb")) {
                    num = num + "0";
                } else if ($(this).hasClass("icon-yz")) {
                    num = num + "1";
                } else if ($(this).hasClass("icon-wx")) {
                    num = num + "2";
                } else if ($(this).hasClass("icon-vu")) {
                    num = num + "3";
                } else if ($(this).hasClass("icon-ts")) {
                    num = num + "4";
                } else if ($(this).hasClass("icon-rq")) {
                    num = num + "5";
                } else if ($(this).hasClass("icon-po")) {
                    num = num + "6";
                } else if ($(this).hasClass("icon-nm")) {
                    num = num + "7";
                } else if ($(this).hasClass("icon-lk")) {
                    num = num + "8";
                } else if ($(this).hasClass("icon-ji")) {
                    num = num + "9";
                } else if ($(this).hasClass("icon-dc")) {
                    num = num + "+";
                } else if ($(this).hasClass("icon-fe")) {
                    num = num + "(";
                } else if ($(this).hasClass("icon-hg")) {
                    num = num + ")";
                } else if ($(this).hasClass("icon-ba")) {
                    num = num + "-";
                }

            })
            var number = num;
            rec++;
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

    });

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

    console.log(data);

}




module.exports = scrapJustdial;