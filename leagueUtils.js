const rp = require("request-promise");
const url = require("url");
const Promise = require("bluebird");

const {getApiKey} = require("./configUtils.js");

const summonerInfoNAURL = "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/";
const currentGameNAURL = "https://na.api.pvp.net/observer-mode/rest/consumer/getSpectatorGameInfo/NA1/";
const staticDataChampionInfoByIdNAURL = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/";
const apiKey = "6664f4db-4da8-4d3b-a858-20dc58175f06";
//TODO: extract the api key and json true parts into their own function. no need to repeat all that stuff..

exports.getChampionNameByChampionId = function(championId) {
    return rp({
        uri: url.resolve(staticDataChampionInfoByIdNAURL, championId.toString()),
        qs : {
            api_key: getApiKey()            
        },
        json: true
    }).then(function(data) {
        return data.key;
    });
}

exports.getCurrentChampionBySummonerId = function(summonerId) {
    return rp({
        uri: url.resolve(currentGameNAURL, summonerId.toString()),
        qs: {
            api_key: getApiKey()
        },
        json: true    
    })
    .catch(function(error) {
       if(error.statusCode == 404) {
           return Promise.reject("Not in game, boss");
       } else if(error.statusCode == 403) {
           return Promise.reject("Key missing/incorrect");
       }
    })
    .then(function(data) {
        var championId;
        
        for(var i = 0; i < data["participants"].length; i++) {
            if(data.participants[i].summonerId === summonerId) {
                return data.participants[i].championId;
            } 
        }

        return Promise.reject("Summoner not found..what you do, league?");
    });
}

exports.getSummonerIdBySummonerName = function(summonerName) {
    return rp({
        uri: url.resolve(summonerInfoNAURL, summonerName),
        qs: {
            api_key:  getApiKey()
        },
        json: true
    }).then(function(data) {
        return data[removeWhiteSpaceAndLowercase(summonerName)].id;
    });
}

function removeWhiteSpaceAndLowercase(str) {
    return str.toLowerCase().split(' ').join('');
}