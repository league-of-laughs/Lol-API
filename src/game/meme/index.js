"use strict";
exports.__esModule = true;
var Meme = (function () {
    function Meme(url) {
        this.topText = null;
        this.bottomText = null;
    }
    Meme.prototype.updateBottomText = function (text) {
        this.bottomText = text;
    };
    Meme.prototype.updateTopText = function (text) {
        this.topText = text;
    };
    return Meme;
}());
exports["default"] = Meme;
//# sourceMappingURL=index.js.map