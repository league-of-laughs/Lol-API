"use strict";
exports.__esModule = true;
var Player = (function () {
    function Player(name) {
        this.name = name;
        this.knockedOut = false;
        this.currentMeme = null,
            this.number = null;
        this.currentVote = null;
        this.voted = false;
        this.uploaded = false;
    }
    Player.prototype.setCurrentMeme = function (meme) {
        this.currentMeme = meme;
    };
    Player.prototype.getName = function () {
        return this.name;
    };
    Player.prototype.setNumber = function (number) {
        this.number = number;
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