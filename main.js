const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron')
const { spawn } = require('child_process')
const PercyScript = require('@percy/script');
let percy_start, percy_stop


function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			nodeIntegrationInSubFrames: true,
			nodeIntegrationInWorker: true,
		}
  })
  win.maximize();
  win.loadFile('index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.on('start-percy', (event, arg) => {
  console.log(arg) // prints "ping"
  process.env.PERCY_TOKEN = '9057676433c5bef5b03a7af7021e59edda91573a344ac0e63eeb87099d5ee81d'
  percy_start = spawn("npx",['percy','start'])
  // BrowserWindow.webContents.executeJavaScript('console.log("whoooooooh!")');
  //  BrowserWindow.loadURL('file://' + __dirname + 'js/script.js');
  //  BrowserWindow.webContents.send('ping', 'whoooooooh!');
    percy_start.stdout.on('data',(data) => { 
        // logs = document.getElementById('console_output').innerHTML;
        // document.getElementById('console_output').innerHTML = logs+"<br>"+data;
        // console.log(`data: ${data}`);
        // updateScroll();  
        console.log(`data: ${data}`);
    });
    percy_start.stderr.on('data',(err) => {
        // logs = document.getElementById('console_output').innerHTML;
        // document.getElementById('console_output').innerHTML = logs+"<br>"+data;
        // console.log(`error: ${err}`);
        // updateScroll();
        console.log(`error: ${err}`);
    }); 



  // event.returnValue = percy_start.pid;
})

ipcMain.on('snapshot', (event, arg) => {
  console.log(arg) // prints "ping"


 PercyScript.run(async(page, percySnapshot) => { 

     for (let index = 0; index < arg.length; index++) {
             
             let link = arg[index];  
      await page.goto(link);
             let title = await page.title();
             console.log(title);
            //  let new_title = title + Math.floor((Math.random() * 100) + 1)  
             console.log(link);
             await percySnapshot(title);

     }
      percy_stop = spawn("kill",[percy_start.pid])
      console.log("Process Id for KILL: "+percy_stop.pid);
      event.returnValue = percy_stop.pid;

 });

//  event.returnValue = percy_stop.pid;
})


ipcMain.on('stop-percy', (event, arg) => {
  console.log(arg) // prints "ping"
  
  



  // event.returnValue = percy_start.pid;
})

