const {app, BrowserWindow, globalShortcut, Menu, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const Promise = require("bluebird");

const rp = require('request-promise');
const {getCurrentChampionBySummonerId, getSummonerIdBySummonerName, getChampionNameByChampionId} = require('./leagueUtils.js');
const {setSummonerName, getSummonerId, setSummonerId, clearConfig, isSummonerSet, setApiKey, getApiKey, isKeySet} = require("./configUtils.js");
const {createMainMenu, getPromptWindow, loadPromptHtml} = require("./options.js");


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {// TODO: make a taskbar, rather than disabling window myself and stuff?

  const menu = Menu.buildFromTemplate(createMainMenu());
  Menu.setApplicationMenu(menu);

  // Create the browser window.
  win = new BrowserWindow({
    alwaysOnTop: true,
    show: false,
    autoHideMenuBar: false,
    darkTheme: true
  });

  const ret = globalShortcut.register('Ctrl+Alt+P', onShortcutActivated); //TODO: make shortcut conf'able
  

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

process.on("unhandledRejection", function(reason, promise) {
    //don't log, don't error. I know what I'm doing... probably
});

function onShortcutActivated() {
  if(isSummonerSet() && isKeySet()) {//TODO: catch if key not set, separate load page
    getCurrentChampionBySummonerId(getSummonerId())
      .catch(function(error) {
        error = { error: error, caught : true};
        console.log("Summoner not in game");
        win.loadURL(path.join(__dirname, 'index.html')); // TODO: page for summoner not in game
        win.show();
        throw error;
      })
      .then(getChampionNameByChampionId)
      .catch(function(error) {
        if(!error.caught) { //TODO: there's gotta be a better way...
          error = { error: error, caught : true};
          console.log("champid not valid?");
          win.loadURL(path.join(__dirname, 'index.html')); // TODO: wat do here..
          win.show();
        }
        throw error; 
      }) 
      .then(function(championKey) { // TODO: move to fn?
        win.loadURL("http://www.champion.gg/champion/" + championKey);
        win.show();
      })
      .catch(function(error) {
        console.log(error);
      });
  } else {
    win.loadURL(path.join(__dirname, 'index.html')); // TODO: fix this page's text
    win.show();
  }
}

app.on('ready', createWindow);

ipcMain.on('editSummonerName', function(event, summonerName) {
  setSummonerName(summonerName);
  getSummonerIdBySummonerName(summonerName).then(setSummonerId);
});

ipcMain.on('editApiKey', function(event, apiKey) {
  setApiKey(apiKey);
});

