const Config = require('electron-config');
const rp = require('request-promise');

const config = new Config();
const SUMMONER_NAME = "summonerName";
const SUMMONER_ID = "summonerID";
const API_KEY = "apiKey";

exports.SUMMONER_ID = SUMMONER_ID;

exports.setApiKey = function(apiKey) {
    return config.set(API_KEY, apiKey);
}

exports.getApiKey = function() {
    return config.get(API_KEY);
}

exports.getSummonerId = function() {
    return config.get(SUMMONER_ID);
}

exports.setSummonerName = function(summonerName) {
    config.set(SUMMONER_NAME, summonerName);
}

exports.setSummonerId = function(summonerId) {
    config.set(SUMMONER_ID, summonerId);
}

exports.isSummonerSet = function() {
    return config.has(SUMMONER_ID);
}

exports.isKeySet = function() {
    return config.has(API_KEY);
}

exports.getConfigPath = function() {
    return config.path;
}

exports.clearConfig = function() {
    config.clear();
}