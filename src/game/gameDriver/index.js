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
        var _this = this;
        this.players.map(function (player) {
            if (player.name == name) {
                player.setCurrentMeme(new meme_1["default"](_this.displayMeme));
                player.currentMeme.updateBottomText(bottom);
                player.currentMeme.updateTopText(top);
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
    };
    GameDriver.prototype.increasePlayersUploaded = function () {
        this.playersUploaded++;
    };
    GameDriver.prototype.isDoneUploading = function () {
        for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
            var player = _a[_i];
            if (player.name == name)
                player.setUploaded();
        }
        var incomplete = true;
        for (var _b = 0, _c = this.players; _b < _c.length; _b++) {
            var player = _c[_b];
            if (player.uploaded == false)
                incomplete = false;
        }
        console.log("number of players" + this.players.length);
        console.log("players uploaded" + this.playersUploaded);
        if (this.playersUploaded == this.numPlayers) {
            return true;
        }
        return false;
    };
    GameDriver.prototype.setPlayerNumbers = function (name1, name2) {
        for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
            var player = _a[_i];
            if (player.name == name1) {
                this.setPlayerVotingOne(player.name);
            }
        }
        for (var _b = 0, _c = this.players; _b < _c.length; _b++) {
            var player = _c[_b];
            if (player.name == name2) {
                this.setPlayerVotingTwo(player.name);
            }
        }
    };
    GameDriver.prototype.getNumPlayers = function () {
        return this.players.length;
    };
    return GameDriver;
}());
exports["default"] = GameDriver;
//# sourceMappingURL=index.js.map