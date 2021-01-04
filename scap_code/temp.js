//===============================================google start====================================================
// (async () => {
//     try {
//         var isNext = true;
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();

//         await page.goto('https://www.google.com');
//         await page.waitForSelector('input[name=q]');
//         await page.click('[name=q]');
//         await page.keyboard.type("restaurants near me");
//         await page.screenshot({ path: '1.png' });

//         await page.keyboard.press('Enter');

//         await page.waitForSelector('h3.LC20lb', { timeout: 10000 });

//         await page.evaluate(() => {
//             console.log("click");
//             document.querySelectorAll('a.Q2MMlc')[0].click();

//         });
//         //await page.goto('https://www.google.com/search?sa=X&sz=0&q=restaurants+near+me&npsic=0&rflfq=1&rldoc=1&rlha=0&rllag=23688933,72542235,228&tbm=lcl&ved=2ahUKEwirlqTvzcXsAhVhzDgGHf8hCT0QjGp6BAgNEFk&biw=1680&bih=907#rlfi=hd:;si:;mv:[[23.70621,72.54946679999999],[23.686892099999998,72.53399809999999]];tbs:lrf:!1m4!1u3!2m2!3m1!1e1!1m4!1u5!2m2!5m1!1sgcid_3fast_1food_1restaurant!1m4!1u5!2m2!5m1!1sgcid_3north_1indian_1restaurant!1m4!1u2!2m2!2m1!1e1!2m1!1e2!2m1!1e5!2m1!1e3!3sIAEqAklO,lf:1,lf_ui:9');
//         await page.waitForSelector('div#search a.C8TUKc');
//         //await page.waitFor(2000);
//         await page.screenshot({ path: '3.png' });
//         //await page.waitFor(2000);
//         var nodeArr = await page.evaluate(async () => {

//             return document.querySelectorAll('div#search a.C8TUKc').length;

//         });
//         console.log(nodeArr);
//         for (var i = 0; i < nodeArr; i++) {
//             await page.evaluate(async (i) => {
//                 document.querySelectorAll('div#search a.C8TUKc').item(i).click();
//             }, i);

//             await page.waitFor(2000);
//             //await page.screenshot({ path: i + 'A.png' });
//             await page.waitForSelector(".h2yBfgNjGpc__inline-item-view");
//             //await page.screenshot({ path: i+'4.png' });
//             var aData = await page.evaluate(() => {
//                 var ddata = document.querySelector('.h2yBfgNjGpc__inline-item-view').innerHTML;
//                 return ddata;
//             });
//             //console.log(aData);


//             await getDataGoogle(aData);
//         }

//         //console.log(data);
//         while (isNext) {
//             console.log("next click");
//             await page.evaluate(async () => {
//                 document.querySelector(".std td:last-child a").click();
//             });

//             await page.waitForSelector('div#search a.C8TUKc');
//             //await page.waitFor(2000);
//             await page.screenshot({ path: '3.png' });
//             //await page.waitFor(2000);
//             var nodeArr1 = await page.evaluate(async () => {

//                 return document.querySelectorAll('div#search a.C8TUKc').length;

//             });
//             console.log(nodeArr1);
//             for (var j = 0; j < nodeArr1; j++) {
//                 var nodeDetail = await page.evaluate(async (j) => {
//                     var nd = document.querySelectorAll('div#search a.C8TUKc').item(j);
//                     return nd;
//                 }, j);
//                 if(nodeDetail){
//                     await page.evaluate(async (j) => {
//                         document.querySelectorAll('div#search a.C8TUKc').item(j).click();
//                     }, j);
                    
//                     await page.waitFor(2000);
//                     //await page.screenshot({ path: i + 'A.png' });
//                     await page.waitForSelector(".h2yBfgNjGpc__inline-item-view");
//                     //await page.screenshot({ path: i+'4.png' });
//                     var aData = await page.evaluate(() => {
//                         var ddata = document.querySelector('.h2yBfgNjGpc__inline-item-view').innerHTML;
//                         return ddata;
//                     });
//                     //console.log(aData);
    
    
//                     await getDataGoogle(aData);
//                 }else{
//                     isNext = false;
//                 }
//             }


//             var isNextBtn = await page.evaluate(async () => {
//                 var nextStatus = document.querySelector(".std td:last-child a");
//                 return nextStatus;
//             });
//             if (!isNextBtn) {
//                 isNext = false;
//             }
//         }





//         await browser.close();
//     } catch (error) {
//         console.log(error);
//     }
// })();


// data = [];
// var itemIndex = 0;
// let getDataGoogle = async (html) => {
//     itemIndex++;
//     const $ = cheerio.load(html);
//     var name = $(".mod h2 span").text();
//     var number = $("span.LrzXr.zdqRlf.kno-fv span").text();
//     if ((name != null && name != "" && name != undefined) && (number != null && number != "" && number != undefined)) {
//         var obj = {
//             "name": name,
//             "number": number
//         }
//         data.push(obj);
//         console.log(itemIndex+" "+$(".mod h2 span").text());
//     }

// }

//===============================================google end====================================================


//===============================================justdial start====================================================
// (async () => {
//     try {
//         var flag = true;
//         var pageNumber = 1;
//         while (flag) {
//             const browser = await puppeteer.launch();
//             const page = await browser.newPage();

//             await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");

//             await page.goto('https://www.justdial.com/Ahmedabad/Dhaba-Restaurants/nct-10158813/page-' + pageNumber);

//             await page.waitFor(3000);

//             await page.waitForSelector('.rslwrp');

//             await page.evaluate(() => {
//                 window.scrollTo(0, 10000);
//             });

//             await page.waitFor(1000);

//             var aData = await page.evaluate(() => {
//                 var ddata = document.querySelector('body').innerHTML;
//                 return ddata;
//             });

//             await getDataJustDial(aData);

//             var lastClassName = await page.evaluate(() => {
//                 return document.querySelector("#srchpagination a:last-child").className;
//             });
//             console.log(lastClassName);
//             if (lastClassName == "dis") {
//                 flag = false;
//             }


//             await browser.close();
//             console.log("page Number " + pageNumber);
//             pageNumber = pageNumber + 1;
//         }
//     } catch (error) {
//         console.log(error);
//     }
// })();



// let getDataJustDial = async (html) => {
//     data = [];
//     const $ = cheerio.load(html);

//     $("ul.rsl li.cntanr").each(function (k) {
//         var name = $(this).find("span.lng_cont_name").text();
//         var proObj = $(this).find(".addrinftxt").text().trim().split(',');
//         var profession = "";
//         if(proObj.length>0){
//             profession = proObj[0];
//         }

//         //console.log(name);
//         $(this).find("p.contact-info").each(function (w) {
//             var num = "";
//             $(this).find("span").each(function (i) {
//                 //console.log($(this).text());
//                 if ($(this).hasClass("icon-acb")) {
//                     num = num + "0";
//                 } else if ($(this).hasClass("icon-yz")) {
//                     num = num + "1";
//                 } else if ($(this).hasClass("icon-wx")) {
//                     num = num + "2";
//                 } else if ($(this).hasClass("icon-vu")) {
//                     num = num + "3";
//                 } else if ($(this).hasClass("icon-ts")) {
//                     num = num + "4";
//                 } else if ($(this).hasClass("icon-rq")) {
//                     num = num + "5";
//                 } else if ($(this).hasClass("icon-po")) {
//                     num = num + "6";
//                 } else if ($(this).hasClass("icon-nm")) {
//                     num = num + "7";
//                 } else if ($(this).hasClass("icon-lk")) {
//                     num = num + "8";
//                 } else if ($(this).hasClass("icon-ji")) {
//                     num = num + "9";
//                 } else if ($(this).hasClass("icon-dc")) {
//                     num = num + "+";
//                 } else if ($(this).hasClass("icon-fe")) {
//                     num = num + "(";
//                 } else if ($(this).hasClass("icon-hg")) {
//                     num = num + ")";
//                 } else if ($(this).hasClass("icon-ba")) {
//                     num = num + "-";
//                 }

//             })
//             var number = num;
//             if ((name != null && name != undefined && name != "") && (number != null && number != undefined && number != "")) {
//                 var obj = {
//                     name: name,
//                     number: number,
//                     profession:profession
//                 };
//                 data.push(obj);
//             }
//         })
//     });
//     console.log(data);

// }
//===============================================justdial end====================================================


//===============================================asklaila start==================================================
// var obj = [];
// var c = 0;
// var start = 0;
// var flag = true;



// let getResult = async (start, flag) => {
//     var endPoint = start > 0 ? start : "";
//     console.log("endpoint: " + endPoint);
//     await axios.get('https://www.asklaila.com/search/Ahmedabad/-/restaurant/' + endPoint)
//         .then(response => {
//             //console.log(response);
//             getDataAsklaila(response.data);
//         })
//         .catch(err => {
//             console.log("end");
//             flag = false;
//             console.log(err);
//         })



// }

// getResult(start, flag);



// let getDataAsklaila = async (html) => {
//     console.log("enter");
//     const $ = cheerio.load(html);
//     var city = $(".dropdown-toggle.mar0 span").text();
//     if ($(".resultContent .col-md-6.col-lg-6.cardWrap").length > 0) {
//         $(".resultContent .col-md-6.col-lg-6.cardWrap").each(function (i) {
//             var re = {};
//             var name = $(this).find(".resultTitle").text().replace(/\n/g, '');
//             var profession = $(this).find(".resultSubTitle").text().replace(/\n/g, '');
//             var number = $(this).find(".phonedisplay").text().replace(/\n/g, '').replace(/\t/g, '');
//             var remarks = $(this).find("div.cardElement").last().text().trim();
//             if ((name != null && name != "") && (number != null && number != "")) {
//                 var numArr = [];
//                 if (number.indexOf(',') > 0) {
//                     numArr = number.split(',');
//                 } else {
//                     numArr.push(number);
//                 }

//                 for (var i = 0; i < numArr.length; i++) {
//                     re.name = name;
//                     re.number = numArr[i].trim();
//                     re.number = re.number.substr(re.number.length-10,re.number.length);
//                     re.city = city;
//                     re.profession = profession;
//                     re.remarks = remarks;
//                     obj.push(re);
//                 }

//                 c++;
//             }

//             // $(".resultContent .col-md-6.col-lg-6.cardWrap").each(function(i){ var re = {}; var name = $(this).find(".resultTitle").text(); if(name!=null&&name!=""){re.name=$(this).find(".resultTitle").text(); obj.push(re);} })
//         })

//         console.log(obj);
//         console.log("cout " + c);
//         if (flag) {

//             start = start + 20;
//             await getResult(start, flag);
//         }
//     } else {
//         flag = false;
//     }

// }

//===============================================asklaila end==================================================



//===============================================grotal start==================================================
// (async () => {
//     try {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();
//         var index = 0;

//         await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");

//         await page.goto('https://www.grotal.com/Chandigarh/Travel-Agents-C1/');

//         await page.waitForSelector("#div_main_content");

//         var totalIndex = await page.evaluate(() => {
//             var x = $("ul.pagination li a").length;
//             return x;
//         });

//         var aData = await page.evaluate(() => {
//             var ddata = document.querySelector('body').innerHTML;
//             return ddata;
//         });

//         await getDataGrotal(aData);


//         while (index < totalIndex-1) {
//             console.log("index "+index+" total "+totalIndex);
//             var curIndex = await page.evaluate(() => {
//                 var x = $("ul.pagination li a.active").index();
//                 return x;
//             });
//             index = curIndex+1;
//             await page.evaluate((index) => {
//                 $("ul.pagination li a")[index].click();
//             },index);
//             await page.waitForSelector("#div_main_content");

//             var sData = await page.evaluate(() => { 
//                 var ddata = document.querySelector('body').innerHTML;
//                 return ddata;
//             });

//             await getDataGrotal(sData);

//             if(index==totalIndex-1){
//                 console.log("end");
//             }

//         }


//         await browser.close();

//     } catch (error) {
//         console.log(error);
//     }
// })();



// let getDataGrotal = html => {
//     data = [];
//     const $ = cheerio.load(html);
//     $("#div_main_content .result-row").each(function(i){
//         var name = $(this).find("div.glListingHeader div").text();
//         var number = $(this).find("div.ph-no").text();
//         if((name!=null&&name!=undefined&&name!="")&&(number!=null&&number!=undefined&&number!="")){
//             var obj = {
//                 name:name,
//                 number:number
//             };
//             data.push(obj);
//         }
//     })
//     console.log(data);
// }
//===============================================grotal end====================================================



//===============================================hindustan yellow pages start==================================================
// (async () => {
//     try {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();
//         var index = 0;

//         await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");

//         await page.goto('https://www.hindustanyellowpages.in/Ahmedabad/Construction-Equipment');

//         await page.waitForSelector("#company_list_grid");

//         var nextBtn = await page.evaluate(() => {
//             var x = $("a#lbNext").length;
//             return x;
//         });

//         var totalIndex = await page.evaluate(() => {
//             var x = $(".pagination a").length;
//             return x;
//         });

//         var aData = await page.evaluate(() => {
//             var ddata = document.querySelector('body').innerHTML;
//             return ddata;
//         });

//         await getDataHYP(aData);
//         console.log("nextBtn "+nextBtn);
//         if(nextBtn==1){
//             await page.evaluate(() => {
//                 __doPostBack('lbNext','');
//             });
//         }else{
//             while (index < totalIndex-1) {
//                 console.log("index "+index+" total "+totalIndex);
//                 var curIndex = await page.evaluate(() => {
//                     var x = $("ul.pagination li.active").index();
//                     return x;
//                 });
//                 index = curIndex+1;
//                 await page.evaluate((index) => {
//                     $("ul.pagination li a")[index].click();
//                 },index);
//                 console.log("Hello");
//                 await page.waitForNavigation({waitUntil:"load",timeout:0});
//                 await page.waitForSelector("#company_list_grid");

//                 var aData = await page.evaluate(() => {
//                     var ddata = document.querySelector('body').innerHTML;
//                     return ddata;
//                 });

//                 await getDataHYP(aData);
//                 if(index==totalIndex-1){
//                     console.log("end");
//                 }
//             }

//         }

//         await browser.close();

//     } catch (error) {
//         console.log(error);
//     }
// })();



// let getDataHYP = html => {
//     data = [];
//     const $ = cheerio.load(html);
//     $("#company_list_grid table table").each(function(e){
//         var name = $(this).find("#c_name a").text();
//         var number = $(this).find("#repCompanyDetail_trMobileNo_"+e+" a").text();
//         var profession = $(this).find("#repCompanyDetail_lbSearchKeyword_"+e+"").text();
//         if((name!=null&&name!=undefined&&name!="")&&(number!=null&&number!=undefined&&number!="")){
//             var obj = {
//                 name:name,
//                 number:number,
//                 profession:profession
//             };
//             data.push(obj);
//         }
//     })
//     console.log(data);
// }
//===============================================hindustan yellow pages end====================================================


//===============================================deldure start==================================================
// (async () => {
//     try {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();
//         var index = 0;
//         var flag = true;
//         var pageNumber = 1;

//         await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");

//         await page.goto('https://www.deldure.com/s/0/resorts');

//         await page.waitForSelector("#searchResults div");




//         var aData = await page.evaluate(() => {
//             var ddata = document.querySelector('body').innerHTML;
//             return ddata;
//         });

//         await getDataDelDure(aData);

//         while (flag) {



//         }

//         await page.waitForSelector("#pagination a");

//         var btnLength = await page.evaluate(() => {
//             var x = document.querySelectorAll("#pagination a").length;
//             return x;
//         });

//         console.log(btnLength);
//         await page.screenshot({path:'test.png'});

//         await page.click("#pagination a:last-child");
//         await page.waitForNavigation({waitUntil:"load",timeout:0});
//         await page.waitForSelector("#searchResults div");

//         var aaData = await page.evaluate(() => {
//             var ddata = document.querySelector('body').innerHTML;
//             return ddata;
//         });

//         await getDataDelDure(aaData);
//         pageNumber = pageNumber + 1;


//         await browser.close();

//     } catch (error) {
//         console.log(error);
//     }
// })();



// let getDataDelDure = async (html) => {
//     data = [];
//     const $ = cheerio.load(html);
//     $("#searchResults div").each(function(e){
//         var name = $(this).find("div:nth-child(1)").text();

//         if((name!=null&&name!=undefined&&name!="")){
//             var obj = {
//                 name:name
//             };
//             data.push(obj);
//         }
//     })
//     console.log(data);
//     return "";
// }
//===============================================deldure end====================================================


//===============================================YPGoNet start==================================================
// (async () => {
//     try {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();
//         var flag = true;
//         var pageUrl = "http://in.ypgo.net/area-Maharashtra";

//         await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");

//         await page.goto('http://in.ypgo.net/area-Maharashtra');

//         await page.waitForSelector(".wrapperc");
        

//         await page.screenshot({ path: 'test.png' });


//         var aData = await page.evaluate(() => {
//             var ddata = document.querySelector('body').innerHTML;
//             return ddata;
//         });

//         await getDataYPGoNet(aData);

//         while (flag) {
//             await page.evaluate(() => {
//                 $(".button")[1].click();
//             });

//             await page.waitForSelector(".wrapperc");
//             await page.waitForSelector(".button");

//             await page.screenshot({ path: 'test.png' });

//             var aData = await page.evaluate(() => {
//                 var ddata = document.querySelector('body').innerHTML;
//                 return ddata;
//             });

//             await getDataYPGoNet(aData);
            
//             var islast = await page.evaluate(() => {
//                 //return $(".button")[1].classList.contains("disabled");
//                 return location.href;
//             });
//             console.log(islast);
//             if(islast == pageUrl){
//                 flag = false;
//                 console.log("end");
//             }else{
//                 pageUrl = islast;
//             }

//         }

//         await browser.close();

//     } catch (error) {
//         console.log(error);
//     }
// })();



// let getDataYPGoNet = async (html) => {
//     data = [];
//     const $ = cheerio.load(html);
//     $(".wrapperc div").each(function () {
//         var name = $(this).find("h2 a").text();
//         var number = $(this).find(".show-tel").text();
//         if ((name != null && name != undefined && name != "") && (number != null && number != undefined && number != "")) {
//             var obj = {
//                 name: name,
//                 number: number.replace("Tel:", "")
//             };
//             data.push(obj);
//         }
//     })
//     console.log(data);
// }

//===============================================YPGoNet end==================================================

//===============================================MahaDir start==================================================
// (async () => {
//     try {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();
//         var flag = true;

//         await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");

//         await page.goto('https://maharashtradirectory.com/product/fabrication.html');
        
//         await page.waitForSelector(".row #result1");

//         await page.screenshot({ path: 'test.png' });


//         var aData = await page.evaluate(() => {
//             var ddata = document.querySelector('body').innerHTML;
//             return ddata;
//         });

//         await getDataMahaDir(aData);



//         await browser.close();

//     } catch (error) {
//         console.log(error);
//     }
// })();



// let getDataMahaDir = async (html) => {
//     data = [];
//     const $ = cheerio.load(html);
//     $(".row #result1").each(function () {
//         var name = $(this).find("a div.mid-result-heading-fnt").text().trim();
//         var numObj = $(this).find("div.mid-result-body-fnt")[1];
//         var profession = $(this).find("div.mid-result-body-fnt")[2];
//         profession = $(profession).text();//find("a").attr("title");
//         var number = $(numObj).text().trim(); 
//         if ((name != null && name != undefined && name != "") && (number != null && number != undefined && number != "")) {
//             var obj = {
//                 name: name,
//                 number: number.replace("Tel No.", ""),
//                 profession:profession
//             };
//             data.push(obj);
//         }
//     })
//     console.log(data);
// }

//===============================================MahaDir end==================================================


//===============================================AttaMarketOnline start==================================================
// (async () => {
//     try {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();
//         var flag = true;

//         await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");
//         await page.setDefaultNavigationTimeout(0);
//         await page.goto('http://www.attamarketonline.com/category/auto-accessories.html');

//         await page.waitForSelector("table:nth-child(1)");

//         await page.screenshot({ path: 'test.png' });


//         var aData = await page.evaluate(() => {
//             var ddata = document.querySelector('body').innerHTML;
//             return ddata;
//         });

//         await getDataAttaMarketOnline(aData);



//         await browser.close();

//     } catch (error) {
//         console.log(error);
//     }
// })();



// let getDataAttaMarketOnline = async (html) => {
//     data = [];
//     const $ = cheerio.load(html);
//     $("table h1 a").each(function (e) {
//         var name = $(this).text().trim();
//         var numObj = $("table td.phone").find("div")[e];

//         var number = $(numObj).text().trim();
//         var tempNum = number.trim().replace(/[^0-9]/g, "");
//         console.log(tempNum);
//         if ((name != null && name != undefined && name != "") && (number != null && number != undefined && number != "" && tempNum.length>=10)) {
//             var obj = {
//                 name: name,
//                 number: number
//             };
//             data.push(obj);
//         }
//     })
//     console.log(data);
// }

//===============================================AttaMarketOnline end==================================================


//===============================================Pinda start==================================================
// (async () => {
//     try {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();
//         var flag = true;

//         await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");

//         await page.goto('https://pinda.in/cities/ahmedabad-gujarat?page=2');

//         await page.waitForSelector("#post");

//         //await page.screenshot({ path: 'test.png',fullPage:true  });


//         var aData = await page.evaluate(() => {
//             var ddata = document.querySelector('body').innerHTML;
//             return ddata;
//         });

//         await getDataPinda(aData);

//         while(flag){
//             var tempData = await page.evaluate(() => {
//                 var ddata = document.querySelectorAll('.page-link')[1].click();
//                 return ddata;
//             });

//             await page.waitForSelector("#post");
//             //await page.screenshot({ path: 'test1.png',fullPage:true });
//             var aData = await page.evaluate(() => {
//                 var ddata = document.querySelector('body').innerHTML;
//                 return ddata;
//             });
//             await getDataPinda(aData);
//         }

//         await browser.close();

//     } catch (error) {
//         console.log(error);
//     }
// })();



// let getDataPinda = async (html) => {
//     data = [];
//     const $ = cheerio.load(html);
//     $("ol li").each(function (e) {
//         var name = $(this).find("b a").text();
//         var numObj = $("ol li")[e];
//         var strArr = $(numObj).text().split('\n');
//         //console.log(strArr[3].replace(/[^\d-()]/g, ' ').trim());

//         var number = strArr[3].replace(/[^\d-()]/g, ' ').trim();
//         if ((name != null && name != undefined && name != "") && (number != null && number != undefined && number != "")) {
//             var obj = {
//                 name: name,
//                 number: number
//             };
//             data.push(obj);
//         }
//     })
//     console.log(data);
// }

//===============================================Pinda end==================================================


//===============================================AddressPage start==================================================
// (async () => {
//     try {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();
//         var flag = true;

//         await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");

//         await page.goto('https://addresspage.com/in/search/4548/2/1');

//         await page.waitForSelector(".content .cards-row");

//         await page.screenshot({ path: 'test.png',fullPage:true  });


//         var aData = await page.evaluate(() => {
//             var ddata = document.querySelector('body').innerHTML;
//             return ddata;
//         });

//         await getDataAddressPage(aData);

//         while(flag){


//             await page.evaluate(() => {
//                 var lastNav = $(".pager ul li:last-child a")[0];
//                 $(lastNav)[0].click();
//             });

//             await page.waitForSelector(".content .cards-row");
//             await page.waitForSelector(".pager ul li.active");
//             await page.screenshot({ path: 'test1.png',fullPage:true });

//             var aData = await page.evaluate(() => {
//                 var ddata = document.querySelector('body').innerHTML;
//                 return ddata;
//             });
//             await getDataAddressPage(aData);

//             var hasLast = await page.evaluate(() => {
//                 var lastNav = $(".pager ul li:last-child a")[0];
//                 return $(lastNav).hasClass("page-nav");
//             });
//             if(!hasLast){
//                 console.log("end");
//                 flag = hasLast;
//             }
//         }

//         await browser.close();

//     } catch (error) {
//         console.log(error);
//     }
// })();



// let getDataAddressPage = async (html) => {
//     data = [];
//     const $ = cheerio.load(html);
//     $(".content .card-row-body").each(function (e) {
//         var name = $(this).find("h2 a").text();
//         var numObj = $(".card-row-properties dl")[e];
//         var numObj2 = $(numObj).find("dt")[0];
//         //console.log($(numObj2).text());

//         var number = $(numObj2).text();
//         var profession = $(this).find("div.alert.alert-warning").text();
//         if ((name != null && name != undefined && name != "") && (number != null && number != undefined && number != "")) {
//             var obj = {
//                 name: name,
//                 number: number
//             };
//             data.push(obj);
//         }
//     })
//     console.log(data);
// }

//===============================================AddressPage end==================================================


//===============================================AskSuba start==================================================
// (async () => {
//     try {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();
//         var flag = true;

//         await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");

//         await page.goto('https://asksuba.com/lists/building-consultants-contractors-in-rajaji-nagar-bangalore');

//         await page.waitForSelector("table");

//         await page.screenshot({ path: 'test.png',fullPage:true  });


//         var aData = await page.evaluate(() => {
//             var ddata = document.querySelector('body').innerHTML;
//             return ddata;
//         });

//         await getDataAskSuba(aData);

//         while(flag){


//             await page.evaluate(() => {
//                 document.querySelector(".pagination li a[rel='Next']").click();
//             });

//             await page.waitForSelector("table");
//             //await page.waitForSelector(".pagination li a[rel='Next']");
//             //await page.screenshot({ path: 'test1.png',fullPage:true });

//             var aData = await page.evaluate(() => {
//                 var ddata = document.querySelector('body').innerHTML;
//                 return ddata;
//             });
//             await getDataAskSuba(aData);

//             var hasLast = await page.evaluate(() => {
//                 var lastNav = "";
//                 var nextObj = document.querySelector(".pagination li a[rel='Next']");
//                 if(nextObj!=null){
//                     lastNav = document.querySelector(".pagination li a[rel='Next']").innerText;
//                 }
//                 return lastNav;
//             });

//             if(!hasLast){
//                 console.log("end");
//                 flag = false;
//             }
            
//         }

//         await browser.close();

//     } catch (error) {
//         console.log(error);
//     }
// })();



// let getDataAskSuba = async (html) => {
//     data = [];
//     const $ = cheerio.load(html);
//     $("table tr").each(function (e) {
//         var name = $(this).find('td').eq(0).text();
//         var number = $(this).find('td').eq(1).text();
//         var profession = $("#header ul li:nth-child(3)").text();
//         if ((name != null && name != undefined && name != "") && (number != null && number != undefined && number != "")) {
//             var obj = {
//                 name: name,
//                 number: number,
//                 profession:profession
//             };
//             data.push(obj);
//         }
//     })
//     console.log(data);
// }

//===============================================AskSuba end==================================================

//===============================================DialMeNow start==================================================
// (async () => {
//     try {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();
//         var flag = true;
//         var initLen = 0;
//         var y = 10;

//         await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");

//         await page.goto('https://www.dialmenow.in/Jaipur/Restaurants/contact-details/');

//         await page.waitForSelector("#results");

//         initLen = await page.evaluate(() => {
//             var len = $("div#results > div").length;
//             return len;
//         });
//         initLen = initLen -1;
//         console.log(initLen);

//         var aData = await page.evaluate((y) => {
//             $("div#results > div").wrap("<div class='myOneHead"+y+"' />").wrapAll("<div class='myOneBody"+y+"' />").removeClass("forshadaw");
//             var ddata = document.querySelector('.myOneHead'+y).innerHTML;
//             return ddata;
//         },y);

//         await getDataDialMeNow(aData,y);


//         while(flag){

//             await page.evaluate((y) => {
//                 window.scrollTo(0, y);
//             },y);
//             y = y+10;

//             await page.waitForSelector("div#results > div.forshadaw");

//             var aData = await page.evaluate((y,initLen) => {
//                 $("div#results > div:gt("+initLen+")").wrap("<div class='myOneHead"+y+"' />").wrapAll("<div class='myOneBody"+y+"' />").removeClass("forshadaw");
//                 var ddata = document.querySelector('.myOneHead'+y).innerHTML;
//                 return ddata;
//             },y,initLen);

//             if(!checkDuplicate(aData,y)){
//                 await getDataDialMeNow(aData,y);
//                 initLen = initLen + 11;
//             }else{
//                 console.log("end");
//                 flag = false;
//             }

//             // await getDataDialMeNow(aData,y);
//             // initLen = initLen + 11;

//         }


//         await browser.close();

//     } catch (error) {
//         console.log(error);
//     }
// })();
// data = [];
// let checkDuplicate = async (html,len) => {
//     const $ = cheerio.load(html);
//     var name = $(".myOneBody"+len+" > div:last-child").find('h1 a').text();
//     var number = $(".myOneBody"+len+" > div:last-child").find('.phonenumbers').text();
//     var lastObj = data[data.length-1];

//     if(name==lastObj.name && number==lastObj.number){
//         return false;
//     }else{
//         return true;
//     }
// }

// let getDataDialMeNow = async (html,len) => {

//     const $ = cheerio.load(html);
//     $(".myOneBody"+len+" > div").each(function (e) {
//         var name = $(this).find('h1 a').text();
//         var number = $(this).find('.phonenumbers').text();

//         if ((name != null && name != undefined && name != "") && (number != null && number != undefined && number != "")) {
//             var obj = {
//                 name: name,
//                 number: number
//             };
//             data.push(obj);
//         }
//     })
//     console.log(data);
// }

//===============================================AskSuba end==================================================


//===============================================JustLanded start==================================================
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
//         await page.screenshot({path:'test.png',fullPage:true});

//         var temptext = await page.evaluate(() => {
//             var atextObj = $("ul.item_list li")[0];
//             var atext = $(atextObj).find("a").text();
//             $(atextObj).find("h2 a").click();
//             return atext;
//         });
//         console.log(temptext);

//         //await page.waitForNavigation({waitUntil:'load',timeout:0});
//         //await page.waitForSelector(".item-detail-description");
//         await page.screenshot({path:'test1.png',fullPage:true});

//         var aData = await page.evaluate(() => {
//             var ddata = document.querySelector('body').innerHTML;
//             return ddata;
//         });

//         await getDataJustLanded(aData);


//         // while(flag){


//         //     await page.waitForSelector("ul.item_list");

//         //     var aData = await page.evaluate(() => {
//         //         var ddata = document.querySelector('body').innerHTML;
//         //         return ddata;
//         //     });


//         //     await getDataJustLanded(aData);

//         // }


//         await browser.close();

//     } catch (error) {
//         console.log(error);
//     }
// })();


// let getDataJustLanded = async (html) => {
//     data = [];
//     const $ = cheerio.load(html);
//     $("ul.item_list li").each(function (e) {
//         var name = $(this).find('h2 a').text();
//         console.log(name);
//         // var number = $(this).find('.phonenumbers').text();

//         // if ((name != null && name != undefined && name != "") && (number != null && number != undefined && number != "")) {
//         //     var obj = {
//         //         name: name,
//         //         number: number
//         //     };
//         //     data.push(obj);
//         // }
//     })
//     console.log(data);
// }

//===============================================JustLanded end==================================================

//===============================================IndianCatalog start==================================================
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
//         await page.screenshot({path:'test.png',fullPage:true});

//         var temptext = await page.evaluate(() => {
//             var atextObj = $("ul.item_list li")[0];
//             var atext = $(atextObj).find("a").text();
//             $(atextObj).find("h2 a").click();
//             return atext;
//         });
//         console.log(temptext);

//         //await page.waitForNavigation({waitUntil:'load',timeout:0});
//         //await page.waitForSelector(".item-detail-description");
//         await page.screenshot({path:'test1.png',fullPage:true});

//         var aData = await page.evaluate(() => {
//             var ddata = document.querySelector('body').innerHTML;
//             return ddata;
//         });

//         await getDataIndianCatalog(aData);


//         // while(flag){


//         //     await page.waitForSelector("ul.item_list");

//         //     var aData = await page.evaluate(() => {
//         //         var ddata = document.querySelector('body').innerHTML;
//         //         return ddata;
//         //     });


//         //     await getDataIndianCatalog(aData);

//         // }


//         await browser.close();

//     } catch (error) {
//         console.log(error);
//     }
// })();


// let getDataIndianCatalog = async (html) => {
//     data = [];
//     const $ = cheerio.load(html);
//     $("ul.item_list li").each(function (e) {
//         var name = $(this).find('h2 a').text();
//         console.log(name);
//         // var number = $(this).find('.phonenumbers').text();

//         // if ((name != null && name != undefined && name != "") && (number != null && number != undefined && number != "")) {
//         //     var obj = {
//         //         name: name,
//         //         number: number
//         //     };
//         //     data.push(obj);
//         // }
//     })
//     console.log(data);
// }

//===============================================IndianCatalog end==================================================