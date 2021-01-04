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
var scrapJustLanded = async (userId, source, block, sector, city, link,stateId,countryId) => {

    await getResult(userId, source, block, sector, city, link,stateId,countryId);

}

let getResult = async (userId, source, block, sector, city, link,stateId,countryId) => {

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        var flag = true;
        var initLen = 0;
        var y = 10;

        await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");

        await page.goto(link); //'https://directory.justlanded.com/en/India/Business_Business-Accountants/1'

        await page.waitForSelector("ul.item_list li a");
        //await page.screenshot({ path: 'test.png', fullPage: true });

        var itemLength = await page.evaluate(() => {
            return $("ul.item_list li a.item_link").length;
        });
        console.log(itemLength);

        var i = 0;
        while (i < itemLength) {
            await page.evaluate((i) => {
                $("ul.item_list li a.item_link")[i].click();
            }, i);
            await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

            //await page.screenshot({ path: i + 'A.png', fullPage: true });

            var aData = await page.evaluate(() => {
                var ddata = document.querySelector('body').innerHTML;
                return ddata;
            });

            await getDataJustLanded(aData,userId, source, block, sector, city, link,stateId,countryId);

            await page.evaluate((i) => {
                window.history.back();
            }, i);
            await page.waitForSelector("ul.item_list li a");
            i++;
        }


        var isLast = await page.evaluate(() => {
            return $("a.next_page").text();
        });
        console.log(isLast);
        while (isLast) {

            await page.evaluate(() => {
                location.href = $("a.next_page").attr('href');
            });

            await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
            await page.waitForSelector("ul.item_list li a");
            //await page.screenshot({ path: 't.png', fullPage: true });

            var itemLength2 = await page.evaluate(() => {
                return $("ul.item_list li a.item_link").length;
            });
            console.log(itemLength2);

            var j = 0;
            while (j < itemLength2) {
                await page.evaluate((j) => {
                    $("ul.item_list li a.item_link")[j].click();
                }, j);
                await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

                //await page.screenshot({ path: j + 'B.png', fullPage: true });
                var nData = await page.evaluate(() => {
                    var nddata = document.querySelector('body').innerHTML;
                    return nddata;
                });

                await getDataJustLanded(nData,userId, source, block, sector, city, link,stateId,countryId);

                await page.evaluate(() => {
                    window.history.back();
                });
                await page.waitForSelector("ul.item_list li a");
                j++;
            }

            isLast = await page.evaluate(() => {
                return $("a.next_page").text();
            });
            console.log(true);
        }

        if (!isLast) {
            console.log("end");
            rec = 0;
            newRec=0;
            duplicateRec=0;
            io.emit('rcv_status', { "finish": true });
        }

        await browser.close();

    } catch (error) {
        console.log(error);
    }
}

let getDataJustLanded = async (html,userId, source, block, sector, city, link,stateId,countryId) => {

    const $ = cheerio.load(html);
    var professionObj = $(".breadcrumb a")[2];
    var name = $(".title-wrapper").text();
    var number = $(".text-link span").text();
    var profession = $(".breadcrumb li:nth-child(3)").text();
    if ((name != null && name != "") && (number != null && number != "")) {
        var item = {};

        var numArr = [];
        if (number.indexOf(',') > 0) {
            numArr = number.split(',');
        } else {
            numArr.push(number);
        }
        var i = 0;
        while (i < numArr.length) {
            item.name = name.replace("'", "''");
            item.number = numArr[i].trim().replace(/[^0-9]/g, "");
            item.profession = profession;

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
                    });
                } else {
                    duplicateRec++;
                }

            });

            

            rec++;

            i++;
            io.emit('rcv_count', { "totalScrape": rec, "newScrape": newRec, "duplicateScrape": duplicateRec });
        }
    }
    console.log(data);
}


module.exports = scrapJustLanded;