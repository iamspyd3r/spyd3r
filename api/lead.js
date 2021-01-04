const express = require('express');
const router = express.Router();
const sql = require('mssql');
const axios = require('axios');
const cheerio = require('cheerio');
var asyncLoop = require('node-async-loop');


var c = 0;
var start = 0;
var flag = true;

router.post('/', async (req, res) => {
    var data = req.body;


    await getResult(start, flag);

    res.send("start");

})

let getResult = async (start, flag) => {
    var endPoint = start > 0 ? start : "";
    console.log("endpoint: " + endPoint);
    await axios.get('https://www.asklaila.com/search/Ahmedabad/-/restaurant/' + endPoint)
        .then(response => {
            //console.log(response);
            getDataAsklaila(response.data);
        })
        .catch(err => {
            console.log("end");
            flag = false;
            console.log(err);
        })

}

let getDataAsklaila = async (html) => {

    const $ = cheerio.load(html);
    var city = $(".dropdown-toggle.mar0 span").text();
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
                    re.name = name;
                    re.number = numArr[i].trim();
                    re.number = re.number.substr(re.number.length - 10, re.number.length);
                    re.city = city;
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

                console.log(item.number+" "+recordset["recordsets"][0].length);
                if (recordset["recordsets"][0].length == 0) {
                    request.query("insert into LeadMaster(MobileNo) values('" + item.number + "') ", function (err, recordset) {
                        if (err) console.log(err)
                        next();
                    });
                }else{
                    next();
                }
                
            });

            
            
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
            await getResult(start, flag);
        } else {
            obj = [];
            c = 0;
            start = 0;
            flag = true;
        }
    } else {
        flag = false;
    }

}



module.exports = router;