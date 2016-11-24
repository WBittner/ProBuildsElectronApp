const {BrowserWindow} = require('electron');
const path = require('path');

const {clearConfig} = require('./configUtils.js');

const OPTION_PROMPT_HTML_NAME = 'optionPrompt.html';

function getPromptWindow(parent, title, event, suggestionText) {
  var prompt = new BrowserWindow({
    parent: parent,
    width: 250,
    height: 125,
    resizable: false,
    moveable: true,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    title: title,
    minimizable: false
  });

  prompt.event = event;
  prompt.suggestionText = suggestionText;

  return prompt;
}

function loadPromptHtml(window) {
  window.loadURL(path.join(__dirname, OPTION_PROMPT_HTML_NAME));
}

exports.createMainMenu = function() {
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

//TODO:rename
function onEditSummonerNameOption(menuItem, browserWindow, event) {
  loadPromptHtml(getPromptWindow(browserWindow, "EditSummonerName", "editSummonerName", "faker"));
}

//TODO:rename
function onEditApiKeyOption(menuItem, browserWindow, event) {
  loadPromptHtml(getPromptWindow(browserWindow, "Edit Api Key", "editApiKey"));
}