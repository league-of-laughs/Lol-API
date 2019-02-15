"use strict";
exports.__esModule = true;
var player_1 = require("../player");
var meme_1 = require("../meme");
var axios = require('axios');
var GameDriver = (function () {
    function GameDriver() {
        this.players = [];
        this.memeOneVotes = 0;
        this.memeTwoVotes = 0;
        this.playerVotingOne = null;
        this.playerVotingTwo = null;
        this.displayMeme = null;
        this.playersUploaded = 0;
        this.numPlayers = null;
    }
    GameDriver.prototype.addPlayer = function (playerName) {
        var player = new player_1["default"](playerName);
        this.players.push(player);
    };
    GameDriver.prototype.voteMemeOne = function () {
        this.memeOneVotes++;
    };
    GameDriver.prototype.voteMemeTwo = function () {
        this.memeTwoVotes++;
    };
    GameDriver.prototype.updatePlayerMeme = function (name, top, bottom) {
        var _this = this;
        this.players.map(function (player) {
            if (player.name == name) {
                player.setCurrentMeme(new meme_1["default"](_this.displayMeme));
                player.currentMeme.updateBottomText(bottom);
                player.currentMeme.updateTopText(top);
            }
        });
    };
    GameDriver.prototype.setPlayerVotingOne = function (name) {
        this.playerVotingOne = name;
    };
    GameDriver.prototype.setPlayerVotingTwo = function (name) {
        this.playerVotingTwo = name;
    };
    GameDriver.prototype.resetRound = function () {
        this.memeOneVotes = 0;
        this.memeTwoVotes = 0;
        this.playerVotingOne = null;
        this.playerVotingTwo = null;
        this.players.map(function (player) {
            player.voted = false;
        });
    };
    GameDriver.prototype.increasePlayersUploaded = function () {
        this.playersUploaded++;
    };
    return GameDriver;
}());
exports["default"] = GameDriver;
//# sourceMappingURL=index.js.map