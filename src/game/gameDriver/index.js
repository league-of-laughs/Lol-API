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
        this.playersVoted = 0;
        this.playersKnockedout = 0;
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
    GameDriver.prototype.setPlayers = function () {
        var inGame = [];
        this.players.map(function (player) {
            if (!player.knockedOut) {
                inGame.push(player);
            }
        });
        if (inGame.length == 1) {
            return;
        }
        this.shuffle(inGame);
        this.setPlayerVotingOne(inGame.pop());
        this.setPlayerVotingTwo(inGame.pop());
    };
    GameDriver.prototype.setPlayerVotingOne = function (player) {
        this.playerVotingOne = player;
    };
    GameDriver.prototype.setPlayerVotingTwo = function (player) {
        this.playerVotingTwo = player;
    };
    GameDriver.prototype.setRoundWinner = function (player) {
        this.roundWinner = player;
    };
    GameDriver.prototype.resetRound = function () {
        this.memeOneVotes = 0;
        this.memeTwoVotes = 0;
        this.playerVotingOne = null;
        this.playerVotingTwo = null;
        this.playersUploaded = 0;
        this.playersVoted = 0;
        this.roundWinner = null;
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
    GameDriver.prototype.vote = function (choice) {
        choice === 1 ? this.voteMemeOne() : this.voteMemeTwo();
        this.playersVoted++;
        if (this.isDoneVoting()) {
            this.handleWinner();
        }
    };
    GameDriver.prototype.isDoneVoting = function () {
        return this.playersVoted === this.players.length;
    };
    GameDriver.prototype.getNumPlayers = function () {
        return this.players.length;
    };
    GameDriver.prototype.handleWinner = function () {
        if (this.memeOneVotes > this.memeTwoVotes) {
            this.playerVotingTwo.setKnockedOut();
            this.setRoundWinner(this.playerVotingTwo);
        }
        else {
            this.playerVotingOne.setKnockedOut();
            this.setRoundWinner(this.playerVotingOne);
        }
        this.playersKnockedout++;
    };
    GameDriver.prototype.isWinner = function () {
        return this.playersKnockedout === this.players.length - 1;
    };
    GameDriver.prototype.shuffle = function (a) {
        var _a;
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            _a = [a[j], a[i]], a[i] = _a[0], a[j] = _a[1];
        }
    };
    return GameDriver;
}());
exports["default"] = GameDriver;
//# sourceMappingURL=index.js.map