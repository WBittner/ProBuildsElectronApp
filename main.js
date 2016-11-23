const {app, BrowserWindow, globalShortcut, Menu, ipcMain} = require('electron')
const path = require('path')
const url = require('url')

const rp = require('request-promise');
const {getCurrentChampionBySummonerId, getSummonerIdBySummonerName} = require('./leagueUtils.js');
const {setSummonerName, getSummonerId, setSummonerId, clearConfig, isSummonerSet, setApiKey, getApiKey} = require("./configUtils.js");


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {

  const menu = Menu.buildFromTemplate(getMenu());
  Menu.setApplicationMenu(menu);

  // Create the browser window.
  win = new BrowserWindow({
    alwaysOnTop: true,
    show: false,
    autoHideMenuBar: false,
    darkTheme: true
  });

  const ret = globalShortcut.register('Ctrl+Alt+P', function(){ //TODO: make shortcut conf'able
    if(isSummonerSet()) {//TODO: catch if key not set, separate load page
      getCurrentChampionBySummonerId(getSummonerId())
        .then(function(championId) { // TODO: move to fn?
          // TODO: move to champion.gg ;) (additional get call to get champ name - use "key" field)
          win.loadURL("http://www.probuilds.net/champions/details/" + championId);
          win.show();
        })
        .error(console.log); // TODO: page for summoner not in game
    } else {
      win.loadURL(path.join(__dirname, 'index.html')); // TODO: fix this page's text
      win.show();
    }
  });

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

//TODO: move and rename
/**
 * callback for option menu button clicked
 */
function onEditSummonerNameOption(menuItem, browserWindow, event) {
  console.log("in onEditSummonerName");
  var promptWindow = new BrowserWindow({
    parent: browserWindow,
    width: 250,
    height: 125,
    resizable: false,
    moveable: true,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    title: "Edit Summoner Name",
    minimizable: false    
  });

  promptWindow.inputText = "fakerrrr";
  promptWindow.event = "editSummonerName";
  promptWindow.loadURL(path.join(__dirname, 'setOption.html'));
}

//TODO: move and rename
/**
 * callback for option menu button clicked
 */
function onEditApiKeyOption(menuItem, browserWindow, event) {
  console.log("in onEditApiKeyOption");
  var promptWindow = new BrowserWindow({
    parent: browserWindow,
    width: 250,
    height: 125,
    resizable: false,
    moveable: true,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    title: "Edit Api Key",
    minimizable: false
  });

  promptWindow.event = "editApiKey";
  promptWindow.loadURL(path.join(__dirname, 'setOption.html'));
}


//TODO move and rename
/**
 * callback for actually setting summoner name
 */
function editSummonerName(summonerName) {
    setSummonerName(summonerName);
}

function getMenu() {
  return template = [
    {
      label: 'Options',
      submenu: [
        {
          label: 'Edit Summoner Name',
          click: onEditSummonerNameOption
        },
        {
          label: 'Edit Api Key',
          click: onEditApiKeyOption
        },
        {
          label: 'Clear Config',
          click: clearConfig
        }
      ]
    }
  ]
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('editSummonerName', function(event, summonerName) {
  console.log("in editSumICP, name: " + summonerName)
  setSummonerName(summonerName);
  getSummonerIdBySummonerName(summonerName).then(setSummonerId);
});

ipcMain.on('editApiKey', function(event, apiKey) {
  console.log("in editApiKey, key: " + apiKey)
  setApiKey(apiKey);
});

