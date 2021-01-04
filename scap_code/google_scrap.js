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
var scrapGoogle = async (userId, source, block, sector, city, link,stateId,countryId) => {

    await getResult(userId, source, block, sector, city, link,stateId,countryId);

}

let getResult = async (userId, source, block, sector, city, link,stateId,countryId) => {
    console.log("start");
    try {
        var isNext = true;
        rec=0;
        newRec=0;
        duplicateRec = 0;

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto('https://www.google.com');
        await page.waitForSelector('input[name=q]');
        await page.click('[name=q]');
        // await page.keyboard.type("restaurants near me");
        await page.keyboard.type(link);
        //await page.screenshot({ path: '1.png' });

        await page.keyboard.press('Enter');

        await page.waitForSelector('h3.LC20lb', { timeout: 10000 });

        await page.evaluate(() => {
            console.log("click");
            document.querySelectorAll('a.Q2MMlc')[0].click();

        });

        await page.waitForSelector('div#search a.C8TUKc');

        //await page.screenshot({ path: '3.png' });

        var nodeArr = await page.evaluate(async () => {

            return document.querySelectorAll('div#search a.C8TUKc').length;

        });
        console.log(nodeArr);
        for (var i = 0; i < nodeArr; i++) {
            await page.evaluate(async (i) => {
                document.querySelectorAll('div#search a.C8TUKc').item(i).click();
            }, i);

            await page.waitFor(2000);

            await page.waitForSelector(".h2yBfgNjGpc__inline-item-view");

            var aData = await page.evaluate(() => {
                var ddata = document.querySelector('.h2yBfgNjGpc__inline-item-view').innerHTML;
                return ddata;
            });
            //console.log(aData);


            await getDataGoogle(aData, userId, source, block, sector, city, link,stateId,countryId);
        }

        //console.log(data);
        while (isNext) {

            await page.evaluate(async () => {
                document.querySelector(".std td:last-child a").click();
            });

            await page.waitForSelector('div#search a.C8TUKc');

            await page.screenshot({ path: '3.png' });

            var nodeArr1 = await page.evaluate(async () => {

                return document.querySelectorAll('div#search a.C8TUKc').length;

            });
            console.log(nodeArr1);
            for (var j = 0; j < nodeArr1; j++) {
                var nodeDetail = await page.evaluate(async (j) => {
                    var nd = document.querySelectorAll('div#search a.C8TUKc').item(j);
                    return nd;
                }, j);
                if (nodeDetail) {
                    await page.evaluate(async (j) => {
                        document.querySelectorAll('div#search a.C8TUKc').item(j).click();
                    }, j);

                    await page.waitFor(2000);

                    await page.waitForSelector(".h2yBfgNjGpc__inline-item-view");

                    var aData = await page.evaluate(() => {
                        var ddata = document.querySelector('.h2yBfgNjGpc__inline-item-view').innerHTML;
                        return ddata;
                    });
                    //console.log(aData);


                    await getDataGoogle(aData, userId, source, block, sector, city, link,stateId,countryId);
                } else {
                    isNext = false;
                    rec = 0;
                    newRec = 0;
                    duplicateRec = 0;
                    io.emit('rcv_status', { "finish": true });
                }
            }


            var isNextBtn = await page.evaluate(async () => {
                var nextStatus = document.querySelector(".std td:last-child a");
                return nextStatus;
            });
            if (!isNextBtn) {
                isNext = false;
                io.emit('rcv_status', { "finish": true });
            }
        }





        await browser.close();
    } catch (error) {
        console.log(error);
    }
}


var itemIndex = 0;
let getDataGoogle = async (html, userId, source, block, sector, city, link,stateId,countryId) => {
    itemIndex++;
    const $ = cheerio.load(html);
    var name = $(".mod h2 span").text();
    var number = $("span.LrzXr.zdqRlf.kno-fv span").text();
    var profession = $(".mod span.YhemCb:last-child").text();
    rec++;
    if ((name != null && name != "" && name != undefined) && (number != null && number != "" && number != undefined)) {
        var obj = [];
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
            re.number = numArr[i].replace(/\s/g, '').trim().replace(/[^0-9]/g, "");
            re.profession = profession;
            obj.push(re);

            rec++;

            i++;
        }

        asyncLoop(obj, function (item, next) {

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
            io.emit('rcv_count', { "totalScrape": rec, "newScrape": newRec, "duplicateScrape": duplicateRec });
            console.log(itemIndex + " " + $(".mod h2 span").text());

        }, function (err) {
            if (err) {
                console.error('Error: ' + err.message);
                return;
            }

            console.log('Finished!');
        });



    }

}




module.exports = scrapGoogle;