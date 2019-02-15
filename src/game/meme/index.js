"use strict";
exports.__esModule = true;
var Meme = (function () {
    function Meme(url) {
        this.url = url;
        this.topText = null;
        this.bottomText = null;
        this.votes = 0;
    }
    Meme.prototype.updateBottomText = function (text) {
        this.bottomText = text;
    };
    Meme.prototype.updateTopText = function (text) {
        this.topText = text;
    };
    Meme.prototype.addVote = function () {
        this.votes++;
    };
    Meme.prototype.resetVote = function () {
        this.votes = 0;
    };
    return Meme;
}());
exports["default"] = Meme;
//# sourceMappingURL=index.js.map