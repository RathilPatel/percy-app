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
  console.log(arg[0]+"-------"+arg[1]);
  
  process.env.PERCY_TOKEN = arg[0]
  process.env.PERCY_BRANCH = arg[1]

  percy_start = spawn("npx",['percy','start'])  
  percy_start.stdout.on('data',(data) => { 
    event.sender.send('asynchronous-reply', `${data}`) // reply to print OUTPUT
    console.log(`data: ${data}`);
  });
  percy_start.stderr.on('data',(err) => {
    event.sender.send('asynchronous-reply', `${err}`) // reply to print OUTPUT
    console.log(`error: ${err}`);
  }); 
  event.returnValue = percy_start.pid;
})

ipcMain.on('snapshot', (event, arg) => {
 console.log(arg) // prints "ping"

 PercyScript.run(async(page, percySnapshot) => { 
     for (let index = 0; index < arg.length; index++) {
             let link = arg[index];
             await page.goto(link);
             let title = await page.title();
             console.log(title);
             let new_title = title + "_" + Math.floor((Math.random() * 100) + 1)  
             console.log(link);
             await percySnapshot(title);
     }

      // Stopping Percy CLI 
      percy_stop = spawn("kill",[percy_start.pid])
      event.sender.send('asynchronous-reply', `${percy_stop.pid}`) // reply to print OUTPUT
      console.log("Process Id for KILL: "+percy_stop.pid);
      event.returnValue = percy_stop.pid;

 });

})

