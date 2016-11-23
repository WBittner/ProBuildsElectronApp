const rp = require("request-promise");
const {resolve} = require("url");

const {getApiKey} = require("./configUtils.js");

const summonerInfoNAURL = "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/";
const currentGameNAURL = "https://na.api.pvp.net/observer-mode/rest/consumer/getSpectatorGameInfo/NA1/";
const apiKey = "6664f4db-4da8-4d3b-a858-20dc58175f06";

exports.getCurrentChampionBySummonerId = function(summonerId) {
    return rp({
        uri: resolve(currentGameNAURL, summonerId.toString()),
        qs: {
            api_key: getApiKey()
        },
        json: true    
    }).then(function(data) {
        var championId;
        
        for(var i = 0; i < data["participants"].length; i++) {
            if(data.participants[i].summonerId === summonerId) {
                championId = data.participants[i].championId;
                break;
            } 
        }
        if(championId === undefined) {
            throw RangeError("Summoner not found..what you do, league?");
        }
        return championId;
    }).catch(function(error) {
       if(error.statusCode == 404) {
           console.log("Not in game, boss");
       }
    });
}

exports.getSummonerIdBySummonerName = function(summonerName) {
    return rp({
        uri: resolve(summonerInfoNAURL, summonerName),
        qs: {
            api_key:  getApiKey()
        },
        json: true
    }).then(function(data) {
        console.log(summonerName);
        return data[removeWhiteSpaceAndLowercase(summonerName)].id;
    });
}

function removeWhiteSpaceAndLowercase(str) {
    return str.toLowerCase().split(' ').join('');
}