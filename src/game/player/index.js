"use strict";
exports.__esModule = true;
var meme_1 = require("../meme");
var Player = (function () {
    function Player(name) {
        this.name = name;
        this.knockedOut = false;
        this.currentMeme = new meme_1["default"]('', ''),
            this.voted = false;
        this.uploaded = false;
    }
    Player.prototype.setCurrentMeme = function (meme) {
        this.currentMeme = meme;
    };
    Player.prototype.getName = function () {
        return this.name;
    };
    Player.prototype.setUploaded = function () {
        this.uploaded = true;
    };
    Player.prototype.setKnockedOut = function () {
        this.knockedOut = true;
    };
    return Player;
}());
exports["default"] = Player;
//# sourceMappingURL=index.js.map