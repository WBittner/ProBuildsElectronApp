/*function onOptionsSubmit() {
  var value = document.getElementById('summonerName').value;
  console.log(value);
}

function initOptions(window) {
    document.getElementById("submit").addEventListener('click', function() {
        console.log("clicky clicky");
    })
    console.log("options page loaded");

}

exports.initOptions = initOptions;*/

const {ipcRenderer} = require('electron');

function myPrompt(title, val) {
    return ipcRenderer.sendSync('prompt', {title,val});
}

exports.myPrompt = myPrompt;

(function(){
    console.log("in options.js");
})();