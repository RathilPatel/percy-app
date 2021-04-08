
const { spawn } = require('child_process')
const urls = []; //store all discovered urls
dotenv.config();


var generateScreenshot = document.getElementById('CaptureScreenshot');

generateScreenshot.addEventListener('click', (event) => {

    website_url = document.getElementById('url'); //capture webpage url here
    percy_token = document.getElementById('token');
    // branch = document.getElementById('CaptureScreenshot');
    // process.env.URL=website_url;
    res.redirect('/');

    process.env.PERCY_TOKEN = '9057676433c5bef5b03a7af7021e59edda91573a344ac0e63eeb87099d5ee81d'
    // process.env.PERCY_TOKEN = percy_token
    process.env.PERCY_BRANCH = 'main'


    console.log("Percy TOKEN:  "+process.env.PERCY_TOKEN)      
    percy_start = spawn("npx",['percy','start'])
    percy_start.stdout.on('data',(data) => { 
        logs = document.getElementById('console_output').innerHTML;
        document.getElementById('console_output').innerHTML = logs+"<br>"+data;
        console.log(`data: ${data}`);
        updateScroll();  
        console.log(`data: ${data}`);
    });
    percy_start.stderr.on('data',(err) => {
        logs = document.getElementById('console_output').innerHTML;
        document.getElementById('console_output').innerHTML = logs+"<br>"+data;
        console.log(`error: ${err}`);
        updateScroll();
        console.log(`error: ${err}`);
    }); 
    console.log("Process Id for Percy Start : "+percy_start.pid);  
    try {
        getSitemaps(website_url)  
    } catch (error) {

        console.log("Error Log: "+error)
    }




});


async function getSitemaps(url){
    console.log("Entered getSitemaps function "+url);
    // 'http://dev.accounts.com/sitemap.xml'
    await sitemaps.parseSitemapsPromise(url, url=>{
       urls.push(url);
       logs = document.getElementById('console_output').innerHTML;
       document.getElementById('console_output').innerHTML = logs+"<br>"+data;
       updateScroll();
       console.log('adding ', url)
       }, function(err, sitemaps) {
       console.log('total urls', urls.length)
       console.error("Error: "+err);
       });
 
     console.log('this is called last');
     snapshot(); 
 
 
 }

 function snapshot(){
    PercyScript.run(async(page, percySnapshot) => { 

        console.log('Entered snapshot function');   
        
 
         for (let index = 0; index < urls.length; index++) {
             
             let link = urls[index];        
             await page.goto(link);
             let title = await page.title();
             console.log(title);
             console.log(urls[index]);
             await percySnapshot(title, { widths: [1200] });
         }
 
         percy_stop = spawn("kill",[percy_start.pid])
         console.log("Process Id for KILL: "+percy_stop.pid);
     });
    
 }






 function updateScroll(){
    var element = document.getElementById("local_div");
    element.scrollTop = element.scrollHeight;
}



// document.getElementById("yml").innerHTML= "";