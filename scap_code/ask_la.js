const express = require('express');
const sql = require('mssql');
const axios = require('axios');
const cheerio = require('cheerio');
var asyncLoop = require('node-async-loop');
var moment = require('moment');

var c = 0;
var newRec = 0;
var duplicateRec=0;
var start = 0;
var flag = true;

var scapAskLa = async (userId, source, block, sector, city, link,stateId,countryId) => {

    await getResult(start, flag, userId, source, block, sector, city, link,stateId,countryId);

}

let getResult = async (start, flag, userId, source, block, sector, city, link,stateId,countryId) => {
    var endPoint = start > 0 ? start : "";
    console.log("endpoint: " + endPoint);

    await axios.get(link + endPoint)   //'https://www.asklaila.com/search/Ahmedabad/-/restaurant/'
        .then(response => {
            //console.log(response);
            getDataAsklaila(response.data, userId, source, block, sector, city, link,stateId,countryId);
        })
        .catch(err => {
            console.log("end");
            flag = false;
            console.log(err);
        })

}

let getDataAsklaila = async (html, userId, source, block, sector, city, link,stateId,countryId) => {

    const $ = cheerio.load(html);
    var reCity = $(".dropdown-toggle.mar0 span").text();
    if ($(".resultContent .col-md-6.col-lg-6.cardWrap").length > 0) {
        var obj = [];
        $(".resultContent .col-md-6.col-lg-6.cardWrap").map(async (i, el) => {
            var re = {};
            var name = $(el).find(".resultTitle").text().replace(/\n/g, '');
            var profession = $(el).find(".resultSubTitle").text().replace(/\n/g, '');
            var number = $(el).find(".phonedisplay").text().replace(/\n/g, '').replace(/\t/g, '');
            var remarks = $(el).find("div.cardElement").last().text().trim();
            if ((name != null && name != "") && (number != null && number != "")) {
                var numArr = [];
                if (number.indexOf(',') > 0) {
                    numArr = number.split(',');
                } else {
                    numArr.push(number);
                }
                var i = 0;
                while (i < numArr.length) {
                    re.name = name.replace("'","''");
                    re.number = numArr[i].trim().replace(/[^0-9]/g, "");
                    //re.number = re.number.substr(re.number.length - 10, re.number.length);
                    re.city = reCity;
                    re.profession = profession;
                    re.remarks = remarks;
                    obj.push(re);
                    
                    c++;

                    i++;
                }



            }

            // $(".resultContent .col-md-6.col-lg-6.cardWrap").each(function(i){ var re = {}; var name = $(this).find(".resultTitle").text(); if(name!=null&&name!=""){re.name=$(this).find(".resultTitle").text(); obj.push(re);} })
        })
        console.log(obj);

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
                    request.query("insert into LeadMaster(EntryDate,UserId,BlockId,SectorId,SourceId,Name,MobileNo,Profession,CityId,CountryId,StateId,ApproxIncome) values('"+entryDate+"'," + userId + ","+block+"," + sector + "," + source + ",'" + item.name + "','" + item.number + "','" + item.profession + "'," + city + "," + countryId + "," + stateId + ",'0') ", function (err, recordset) {
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

            io.emit('rcv_count', {"totalScrape":c,"newScrape":newRec,"duplicateScrape":duplicateRec});

        }, function (err) {
            if (err) {
                console.error('Error: ' + err.message);
                return;
            }

            console.log('Finished!');
        });

        console.log("cout " + c);



        if (flag) {

            start = start + 20;
            await getResult(start, flag, userId, source, block, sector, city, link,stateId,countryId);
        } else {
            obj = [];
            c = 0;
            newRec=0;
            duplicateRec=0;
            start = 0;
            flag = true;
            io.emit('rcv_status', { "finish": true });
        }
    } else {
        obj = [];
        c = 0;
        newRec=0;
        duplicateRec=0;
        start = 0;
        flag = true;
        flag = false;
        io.emit('rcv_status', { "finish": true });
    }

}



module.exports = scapAskLa;