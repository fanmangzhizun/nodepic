/**
 * Created by faithpercious on 2017/7/11.
 */
const http = require('http');
const fs =require('fs');
const  cheerio=require('cheerio');
const request=require('request');

 let url='http://www.mmjpg.com/mm/964';
 let count=0;
 let imgDirname='';
 let limit=10000;
function onerror(er) {
    if (er){
        console.log(er);
    }
}
 function start(url) {
     http.get(url,(res)=>{
         let html='';
         res.setEncoding('utf-8');
         res.on('data',(data)=>{
             html+=data;
         })
         res.on('end',(err)=>{
             if(err){
                 console.log(err);
             }
             else {
                 const $ = cheerio.load(html);
                 let imgSrc = $('#content img').attr('src');
                 let imgName = $('#content img').attr('alt');
                 let dirName = /\s/g.test(imgName) ? imgName.split('')[0] : imgName;
                 if (imgDirname !== dirName) {
                     fs.mkdir('./img/' + dirName + '/', (err) => {
                         if (err) {
                             console.log(err);
                         }
                     });
                     imgDirname = dirName;
                 }
                 request(imgSrc).on('error', onerror).pipe(fs.createWriteStream('./img/' + imgDirname + '/' + imgName + '.jpg')).on('error', onerror);
                 count++;
                 console.log('已拿到图片' + count + '张')
                 let nextLink = 'http://www.mmjpg.com' + $('.next').attr('href');
                 if (nextLink && (count <= limit)) {
                     start(nextLink);
                 }
             }
     })
 })

 }
 start(url);