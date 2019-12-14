"use strict";
exports.__esModule = true;
var Meme = (function () {
    function Meme(top, bottom) {
        this.topText = top;
        this.bottomText = bottom;
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