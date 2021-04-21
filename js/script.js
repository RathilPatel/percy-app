console.log("First Console");
const { ipcRenderer } = require('electron')
const PercyScript = require('@percy/script');
const dotenv = require('dotenv');
console.log("NOt reaching second Console");
const fs = require('fs');
var sitemaps = require('sitemap-stream-parser');
const { spawn } = require('child_process')
let urls = []; //store all discovered urls
let env_var = [];
var logs
dotenv.config();
const path = require('path');

var generateScreenshot = document.getElementById('CaptureScreenshot');

generateScreenshot.addEventListener('click', (event) => {

    cleanup()

    // Get Input Values
    var website_url = document.getElementById('url').value; //capture webpage url here
    var percy_token = document.getElementById('token').value;
    var percy_branch = document.getElementById('percy_branch').value;
    var percyYaml = document.getElementById('yml').value;

    //Creating YAML file for Global SDK settings
    try {
        if (percyYaml != "") {
            fs.writeFileSync('.percy.yml', percyYaml, 'utf-8'); 
            console.log("Found Yaml settings!");
        } else {
            fs.writeFileSync('.percy.yml',"", 'utf-8'); 
            console.log("No Yaml File found!")
        }
    }
    catch(e) {
         alert('Failed to save the file !');
         console.log("Error YAML saving: "+e); 
    }

    env_var.push(percy_token);
    env_var.push(percy_branch);

    // Starting Percy CLI with renderer
    ipcRenderer.sendSync('start-percy', env_var)    
    try {
        getSitemaps(website_url)  
    } catch (error) {

        console.log("Error Log: "+error)
    }

});


async function getSitemaps(url){
    urls = [];
    logs = document.getElementById('console_output').innerHTML + "<br>Fetching Sitemaps URLs:";
    document.getElementById('console_output').innerHTML = logs;
    await sitemaps.parseSitemapsPromise(url, url=>{
            urls.push(url);
            logs = document.getElementById('console_output').innerHTML;
            document.getElementById('console_output').innerHTML = logs+"<br>"+url;
            updateScroll();
            console.log('adding ', url)
       }, function(err, sitemaps) {
            console.log('total urls', urls.length)
            console.error("Error here: "+err);
       });
    snapshot(); 
    
}

function snapshot(){
    console.log(ipcRenderer.sendSync('snapshot', urls))  // Sending URLs for Snapshot
}

ipcRenderer.on('asynchronous-reply', (event, arg) => {
    console.log(arg)
    logs = document.getElementById('console_output').innerHTML;
    document.getElementById('console_output').innerHTML = logs+"<br>"+arg;
    updateScroll();
})

function cleanup() {
    document.getElementById('console_output').innerHTML = " ";
    env_var = []
}

 function updateScroll(){
    var element = document.getElementById("console_output");
    element.scrollTop = element.scrollHeight;
}