"use strict";
exports.__esModule = true;
var player_1 = require("../player");
var meme_1 = require("../meme");
var axios = require('axios');
var Memes = [
    "https://sports-images.vice.com/images/2017/01/25/when-nick-young-the-basketball-player-met-nick-young-the-meme-body-image-1485378510.jpg",
    "https://sports-images.vice.com/images/2017/01/25/when-nick-young-the-basketball-player-met-nick-young-the-meme-body-image-1485378510.jpg",
    "https://sports-images.vice.com/images/2017/01/25/when-nick-young-the-basketball-player-met-nick-young-the-meme-body-image-1485378510.jpg"
];
var GameDriver = /** @class */ (function () {
    function GameDriver() {
        this.players = [];
        this.memeOne = null;
        this.memeTwo = null;
    }
    GameDriver.prototype.addPlayer = function (playerName) {
        var player = new player_1["default"](playerName);
        this.players.push(player);
    };
    GameDriver.prototype.voteMemeOne = function () {
        this.memeOne.addVote;
    };
    GameDriver.prototype.voteMemeTwo = function () {
        this.memeTwo.addVote;
    };
    GameDriver.prototype.setNewDisplayMeme = function () {
        this.displayMeme = Memes[Math.floor(Math.random() * Memes.length)];
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
    return GameDriver;
}());
exports["default"] = GameDriver;
