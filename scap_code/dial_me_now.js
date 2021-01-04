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
var scrapDialMeNow = async (userId, source, block, sector, city, link,stateId,countryId) => {

    await getResult(userId, source, block, sector, city, link,stateId,countryId);

}

let getResult = async (userId, source, block, sector, city, link,stateId,countryId) => {

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        var flag = true;
        var initLen = 0;
        var y = 10;

        rec=0;
        newRec=0;
        duplicateRec = 0;        

        await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");

        await page.setDefaultNavigationTimeout(0);
        await page.goto(link); //'https://www.dialmenow.in/Jaipur/Restaurants/contact-details/'

        await page.waitForSelector("#results");

        initLen = await page.evaluate(() => {
            var len = $("div#results > div").length;
            return len;
        });
        initLen = initLen -1;
        console.log(initLen);

        var aData = await page.evaluate((y) => {
            $("div#results > div").wrap("<div class='myOneHead"+y+"' />").wrapAll("<div class='myOneBody"+y+"' />").removeClass("forshadaw");
            var ddata = document.querySelector('.myOneHead'+y).innerHTML;
            return ddata;
        },y);

        await getDataDialMeNow(aData,y,userId, source, block, sector, city, link,stateId,countryId);


        while(flag){

            await page.evaluate((y) => {
                window.scrollTo(0, y);
            },y);
            y = y+10;

            await page.waitForSelector("div#results > div.forshadaw");

            var aData = await page.evaluate((y,initLen) => {
                $("div#results > div:gt("+initLen+")").wrap("<div class='myOneHead"+y+"' />").wrapAll("<div class='myOneBody"+y+"' />").removeClass("forshadaw");
                var ddata = document.querySelector('.myOneHead'+y).innerHTML;
                return ddata;
            },y,initLen);

            if(!checkDuplicate(aData,y)){
                await getDataDialMeNow(aData,y,userId, source, block, sector, city, link,stateId,countryId);
                initLen = initLen + 11;
            }else{
                console.log("end");
                flag = false;
                data = [];
                io.emit('rcv_status', { "finish": true });
                
            }

            // await getDataDialMeNow(aData,y);
            // initLen = initLen + 11;

        }


        await browser.close();

    } catch (error) {
        console.log(error);
    }
}

data = [];
let checkDuplicate = async (html,len) => {
    const $ = cheerio.load(html);
    var name = $(".myOneBody"+len+" > div:last-child").find('h1 a').text();
    var number = $(".myOneBody"+len+" > div:last-child").find('.phonenumbers').text();
    var lastObj = data[data.length-1];

    if(name==lastObj.name && number==lastObj.number){
        return false;
    }else{
        return true;
    }
}

let getDataDialMeNow = async (html,len,userId, source, block, sector, city, link,stateId,countryId) => {

    const $ = cheerio.load(html);
    $(".myOneBody"+len+" > div").each(function (e) {
        var name = $(this).find('h1 a').text();
        var number = $(this).find('.phonenumbers').text();
        var professionObj = $("div.mainheading").find("div.top-list h1").text();
        var profession = "";
        if (professionObj.indexOf('in') > 0) {
            var proArr = professionObj.split(',');
            profession = proArr[0];
        }
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



module.exports = scrapDialMeNow;