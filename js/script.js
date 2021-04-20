console.log("First Console");
const { ipcRenderer } = require('electron')
const PercyScript = require('@percy/script');
const dotenv = require('dotenv');
console.log("NOt reaching second Console");
const fs = require('fs');
var sitemaps = require('sitemap-stream-parser');
const { spawn } = require('child_process')
let urls = []; //store all discovered urls
var percy_start,percy_stop,logs , pid
var data
dotenv.config();


var generateScreenshot = document.getElementById('CaptureScreenshot');

generateScreenshot.addEventListener('click', (event) => {

    var website_url = document.getElementById('url'); //capture webpage url here
    website_url = "https://yoast.com/yoast_series-sitemap.xml"  

    var percy_token = document.getElementById('token');
    // branch = document.getElementById('CaptureScreenshot');
    // process.env.URL=website_url;
    process.env.PERCY_TOKEN = '9057676433c5bef5b03a7af7021e59edda91573a344ac0e63eeb87099d5ee81d'
    // process.env.PERCY_TOKEN = percy_token
    process.env.PERCY_BRANCH = 'main'


    console.log("Percy TOKEN:  "+process.env.PERCY_TOKEN)
    ipcRenderer.sendSync('start-percy', '9057676433c5bef5b03a7af7021e59edda91573a344ac0e63eeb87099d5ee81d')    
    try {
        getSitemaps(website_url)  
    } catch (error) {

        console.log("Error Log: "+error)
    }

});


async function getSitemaps(url){
    urls = [];
    console.log("Entered getSitemaps function "+url);
    // 'http://dev.accounts.com/sitemap.xml'
    await sitemaps.parseSitemapsPromise(url, url=>{
       urls.push(url);
    //    logs = document.getElementById('console_output').innerHTML;
    //    document.getElementById('console_output').innerHTML = logs+"<br>"+data;
    //    updateScroll();
       console.log('adding ', url)
       }, function(err, sitemaps) {
       console.log('total urls', urls.length)
       console.error("Error here: "+err);
       });
 
     console.log('this is called last');
     snapshot(); 
 
 
 }

 function snapshot(){
     console.log("printing here!");
        console.log('Entered snapshot function');
        console.log(ipcRenderer.sendSync('snapshot', urls)) // prints "pong"
            
     
            // console.log(ipcRenderer.sendSync('stop-percy', pid)) // prints "pong"
        //  percy_stop = spawn("kill",[percy_start.pid])
        //  console.log("Process Id for KILL: "+percy_stop.pid);
    //  });
    
 }






 function updateScroll(){
    var element = document.getElementById("console_output");
    element.scrollTop = element.scrollHeight;
}


ipcRenderer.on('ping', function(event, message) {
      console.log(message);  // Prints "whoooooooh!"
    });

// document.getElementById("yml").innerHTML= "";