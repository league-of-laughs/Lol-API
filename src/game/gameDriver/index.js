"use strict";
exports.__esModule = true;
var player_1 = require("../player");
var meme_1 = require("../meme");
var GameDriver = (function () {
    function GameDriver() {
        this.players = [];
        this.memeOneVotes = 0;
        this.memeTwoVotes = 0;
        this.playerVotingOne = null;
        this.playerVotingTwo = null;
        this.displayMeme = null;
        this.playersUploaded = 0;
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
        this.players.map(function (player) {
            if (player.name == name) {
                player.setCurrentMeme(new meme_1["default"](top, bottom));
            }
        });
        this.increasePlayersUploaded();
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
        this.playersUploaded = 0;
    };
    GameDriver.prototype.increasePlayersUploaded = function () {
        this.playersUploaded++;
    };
    GameDriver.prototype.isDoneUploading = function () {
        console.log("number of players" + this.players.length);
        console.log("players uploaded" + this.playersUploaded);
        if (this.players.length == this.playersUploaded) {
            return true;
        }
        return false;
    };
    GameDriver.prototype.setPlayerNumbers = function (name1, name2) {
        this.setPlayerVotingOne(name1);
        this.setPlayerVotingTwo(name2);
    };
    GameDriver.prototype.getNumPlayers = function () {
        return this.players.length;
    };
    return GameDriver;
}());
exports["default"] = GameDriver;
//# sourceMappingURL=index.js.map