const app = require('express')()
const http = require('http').createServer(app)
const axios = require('axios');
const cheerio = require('cheerio');
const connection = require('./DB/connection');
const puppeteer = require('puppeteer');
const sql = require('mssql');
let bodyParser = require('body-parser');
const { html } = require('cheerio');
const io = require('socket.io');
const { clients, tempSocketClients } = require('./socket_data/user_ids');

const scapAskLa = require('./scap_code/ask_la');
const scrapGoogle = require('./scap_code/google_scrap');
const scrapJustdial = require('./scap_code/justdial');
const scrapGrotal = require('./scap_code/grotal');
const scrapHYP = require('./scap_code/hindustan_yellow_page');
const scrapYPGO = require('./scap_code/yellow_page_go');
const scrapPinda = require('./scap_code/pinda');
const scrapAddressPage = require('./scap_code/address_page');
const scrapAskSuba = require('./scap_code/ask_suba');
const scrapDialMeNow = require('./scap_code/dial_me_now');
const scrapMahaDir = require('./scap_code/maharashtra_directory');
const scrapAttaMarket = require('./scap_code/atta_market_online');
const scrapJustLanded = require('./scap_code/just_landed');

app.use(bodyParser.urlencoded({
    extended: true,
    //limit:'50mb'   
}));
app.use(bodyParser.json());



connection()


app.use('/lead', require('./api/lead'));



//http.listen(process.env.PORT || 8080);

const server = http.listen(process.env.PORT || 8080);

const socketIo = io(server, {
    cors: {
        origin: '*',
      },
    upgradeTimeout: 30000 // default value is 10000ms, try changing it to 20k or more
});

global.io = socketIo;

socketIo.on('connection', async (userSocket) => {

    var conId = await userSocket.id;
    console.log('socket connect '+conId);
    var userId = userSocket.handshake.query.userId; 
    console.log(userId);

    clients[userId] = conId;
    tempSocketClients[conId] = userId;

    userSocket.on('scrap_asklaila', async (data1)=>{
        await scapAskLa(data1.userId,data1.Source,data1.Block,data1.Sector,data1.City,data1.Link,data1.StateId,data1.CountryId);
    })

    userSocket.on('scrap_google', async (data1)=>{
        await scrapGoogle(data1.userId,data1.Source,data1.Block,data1.Sector,data1.City,data1.Link,data1.StateId,data1.CountryId);
    })

    userSocket.on('scrap_justdial', async (data1)=>{
        await scrapJustdial(data1.userId,data1.Source,data1.Block,data1.Sector,data1.City,data1.Link,data1.StateId,data1.CountryId);
    })

    userSocket.on('scrap_grotal', async (data1)=>{
        await scrapGrotal(data1.userId,data1.Source,data1.Block,data1.Sector,data1.City,data1.Link,data1.StateId,data1.CountryId);
    })

    userSocket.on('scrap_HYP', async (data1)=>{
        await scrapHYP(data1.userId,data1.Source,data1.Block,data1.Sector,data1.City,data1.Link,data1.StateId,data1.CountryId);
    })

    userSocket.on('scrap_YPGO', async (data1)=>{
        await scrapYPGO(data1.userId,data1.Source,data1.Block,data1.Sector,data1.City,data1.Link,data1.StateId,data1.CountryId);
    })

    userSocket.on('scrap_Pinda', async (data1)=>{
        await scrapPinda(data1.userId,data1.Source,data1.Block,data1.Sector,data1.City,data1.Link,data1.StateId,data1.CountryId);
    })

    userSocket.on('scrap_AddressPage', async (data1)=>{
        await scrapAddressPage(data1.userId,data1.Source,data1.Block,data1.Sector,data1.City,data1.Link,data1.StateId,data1.CountryId);
    })

    userSocket.on('scrap_AskSuba', async (data1)=>{
        await scrapAskSuba(data1.userId,data1.Source,data1.Block,data1.Sector,data1.City,data1.Link,data1.StateId,data1.CountryId);
    })

    userSocket.on('scrap_DialMeNow', async (data1)=>{
        await scrapDialMeNow(data1.userId,data1.Source,data1.Block,data1.Sector,data1.City,data1.Link,data1.StateId,data1.CountryId);
    })

    userSocket.on('scrap_MahaDir', async (data1)=>{
        await scrapMahaDir(data1.userId,data1.Source,data1.Block,data1.Sector,data1.City,data1.Link,data1.StateId,data1.CountryId);
    })

    userSocket.on('scrap_AttaMarket', async (data1)=>{
        await scrapAttaMarket(data1.userId,data1.Source,data1.Block,data1.Sector,data1.City,data1.Link,data1.StateId,data1.CountryId);
    })

    userSocket.on('scrap_JustLanded', async (data1)=>{
        await scrapJustLanded(data1.userId,data1.Source,data1.Block,data1.Sector,data1.City,data1.Link,data1.StateId,data1.CountryId);
    })

    userSocket.on('disconnect', async (data) => {
        console.log('socket disconnect');
        var tempClientId = tempSocketClients[userSocket.id];
        delete clients[tempClientId];
        delete tempSocketClients[userSocket.id];
    });
})

// (async () => {
//     try {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();
//         var flag = true;
//         var initLen = 0;
//         var y = 10;

//         await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");

//         await page.goto('https://directory.justlanded.com/en/India/Business_Business-Accountants/1');

//         await page.waitForSelector("ul.item_list li a");
//         //await page.screenshot({ path: 'test.png', fullPage: true });

//         var itemLength = await page.evaluate(() => {
//             return $("ul.item_list li a.item_link").length;
//         });
//         console.log(itemLength);

//         var i = 0;
//         while (i < itemLength) {
//             await page.evaluate((i) => {
//                 $("ul.item_list li a.item_link")[i].click();
//             }, i);
//             await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

//             //await page.screenshot({ path: i + 'A.png', fullPage: true });

//             var aData = await page.evaluate(() => {
//                 var ddata = document.querySelector('body').innerHTML;
//                 return ddata;
//             });

//             await getDataJustLanded(aData);

//             await page.evaluate((i) => {
//                 window.history.back();
//             }, i);
//             await page.waitForSelector("ul.item_list li a");
//             i++;
//         }


//         var isLast = await page.evaluate(() => {
//             return $("a.next_page").text();
//         });
//         console.log(isLast);
//         while (isLast) {

//             await page.evaluate(() => {
//                 location.href = $("a.next_page").attr('href');
//             });

//             await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
//             await page.waitForSelector("ul.item_list li a");
//             //await page.screenshot({ path: 't.png', fullPage: true });

//             var itemLength2 = await page.evaluate(() => {
//                 return $("ul.item_list li a.item_link").length;
//             });
//             console.log(itemLength2);

//             var j = 0;
//             while (j < itemLength2) {
//                 await page.evaluate((j) => {
//                     $("ul.item_list li a.item_link")[j].click();
//                 }, j);
//                 await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

//                 //await page.screenshot({ path: j + 'B.png', fullPage: true });
//                 var nData = await page.evaluate(() => {
//                     var nddata = document.querySelector('body').innerHTML;
//                     return nddata;
//                 });

//                 await getDataJustLanded(nData);

//                 await page.evaluate(() => {
//                     window.history.back();
//                 });
//                 await page.waitForSelector("ul.item_list li a");
//                 j++;
//             }

//             isLast = await page.evaluate(() => {
//                 return $("a.next_page").text();
//             });
//             console.log(true);
//         }

//         if (!isLast) {
//             console.log("end");
//         }

//         await browser.close();

//     } catch (error) {
//         console.log(error);
//     }
// })();


// let getDataJustLanded = async (html) => {

//     const $ = cheerio.load(html);
//     var professionObj = $(".breadcrumb a")[2];
//     var name=$(".title-wrapper").text().replace("'","''");
//     var number=$(".text-link span").text().trim().replace(/[^0-9]/g, "");
//     var profession=$(".breadcrumb li:nth-child(3)").text();
//     if ((name != null && name != "") && (number != null && number != "")){

//     }
//     console.log(data);
// }



// (async () => {
//     try {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();
//         var index = 0;
//         var flag = true;
//         var pageNumber = 1;

//         await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");
//         var alink = 'https://www.deldure.com/s/0/resorts';
//         await page.setDefaultNavigationTimeout(0);
//         await page.goto(alink);
//         await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
//         await page.waitForSelector("#searchResults a");

//         var divLen = await page.evaluate(() => {
//             return document.querySelectorAll("#searchResults a").length;
//         });
//         console.log(divLen);

//         var i = 0;

//         while (i < divLen) {

//             await page.evaluate((i) => {
//                 document.querySelectorAll("#searchResults a")[i].click();
//             }, i);
//             await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
//             await page.waitForSelector("div#listingDetails");
//             await page.screenshot({ path: i + '.png', fullPage: true });
//             await page.evaluate((alink) => {
//                 location.href = alink;
//             },alink);
//             await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
//             await page.waitForSelector("#searchResults a");
//             i++;
//         }

//         await browser.close();

//     } catch (error) {
//         console.log(error);
//     }
// })();



// let getDataDelDure = async (html) => {
//     data = [];
//     const $ = cheerio.load(html);
//     $("#searchResults div").each(function (e) {
//         var name = $(this).find("div:nth-child(1)").text();

//         if ((name != null && name != undefined && name != "")) {
//             var obj = {
//                 name: name
//             };
//             data.push(obj);
//         }
//     })
//     console.log(data);
//     return "";
// }