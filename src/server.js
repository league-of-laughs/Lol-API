"use strict";
exports.__esModule = true;
var express = require('express');
var bodyparser = require('body-parser');
var port = process.env.PORT || 3000;
var host = '0.0.0.0';
var gameDriver_1 = require("./game/gameDriver");
var app = express();
app.use(bodyparser.json());
app.get('/', function (req, res) {
    console.log('hit');
    res.sendFile('/pages/landing/index.html', { root: __dirname });
});
var server = app.listen(port);
var io = require('socket.io')(server);
var gamesMap = {};
var game;
var getGame = function (room) {
    return gamesMap[room];
};
io.on('connection', function (socket) {
    console.log('new user connected');
    socket.on('web-newGame', function (room) {
        gamesMap[room] = new gameDriver_1["default"]();
        socket.join(room);
        console.log('creating new game for room: ' + room);
    });
    socket.on('mobile-addPlayer', function (_a) {
        var room = _a.room, name = _a.name;
        try {
            var game_1 = getGame(room);
            game_1.addPlayer(name);
            socket.join(room);
            socket.broadcast.to(room).emit('web-displayAddedPlayer', name);
            console.log("adding " + name + " to game room: " + room);
            console.log(game_1);
            socket.emit('mobile-attempt_join', true);
        }
        catch (e) {
            socket.emit('mobile-attempt_join', false);
        }
    });
    socket.on('web-startGame', function (room) {
        console.log(gamesMap);
        try {
            console.log('starting game');
            var game_2 = getGame(room);
            console.log("starting game with " + game_2.getNumPlayers() + " players");
            socket.broadcast.to(room).emit('mobile-start', room);
        }
        catch (e) {
            console.log(e);
        }
    });
    socket.on('mobile-uploadMeme', function (data) {
        console.log('player uploading meme');
        data = JSON.parse(data);
        console.log(data);
        game.increasePlayersUploaded();
        var name = data.name, topText = data.topText, bottomText = data.bottomText;
        game.updatePlayerMeme(name, topText, bottomText);
        socket.broadcast.emit('web-playerUploadedMeme', name);
        for (var _i = 0, _a = game.players; _i < _a.length; _i++) {
            var player = _a[_i];
            if (player.name == name)
                player.setUploaded();
        }
        var incomplete = true;
        for (var _b = 0, _c = game.players; _b < _c.length; _b++) {
            var player = _c[_b];
            if (player.uploaded == false)
                incomplete = false;
        }
        console.log("number of players" + game.numPlayers);
        console.log("players uploaded" + game.playersUploaded);
        if (game.playersUploaded == game.numPlayers) {
            console.log('done uploading');
            socket.broadcast.emit('web-doneUploading', game.players);
        }
    });
    socket.on('web-setPlayerNumbers', function (data) {
        console.log('assigning 2 players');
        console.log(data);
        var name1 = data.name1, name2 = data.name2;
        for (var _i = 0, _a = game.players; _i < _a.length; _i++) {
            var player = _a[_i];
            if (player.name == name1)
                game.setPlayerVotingOne(player.name);
        }
        for (var _b = 0, _c = game.players; _b < _c.length; _b++) {
            var player = _c[_b];
            if (player.name == name2)
                game.setPlayerVotingTwo(player.name);
        }
        socket.broadcast.emit('mobile-startVoting');
    });
    socket.on('mobile-voteMeme', function (data) {
        data = JSON.parse(data);
        console.log(data);
        console.log('voting');
        var incomplete = true;
        var name = data.name, number = data.number;
        console.log(name);
        console.log(number);
        if (number == 1) {
            game.voteMemeOne();
        }
        else {
            game.voteMemeTwo();
        }
        game.players.map(function (player) {
            if (player.name == name)
                player.voted = true;
            if (player.voted == false) {
                incomplete = false;
                console.log('not done yet');
            }
        });
        if (incomplete) {
            console.log('there is a winner');
            var winner = void 0;
            var winningMeme = void 0;
            if (game.memeOneVotes > game.memeTwoVotes) {
                console.log(game.playerVotingOne);
                console.log("loser: " + game.playerVotingTwo);
                winner = game.playerVotingOne;
                for (var _i = 0, _a = game.players; _i < _a.length; _i++) {
                    var player = _a[_i];
                    if (player.name == winner)
                        winningMeme = player.currentMeme;
                    if (player.name == game.playerVotingTwo)
                        player.setKnockedOut();
                }
            }
            else {
                console.log(game.playerVotingTwo);
                winner = game.playerVotingTwo;
                for (var _b = 0, _c = game.players; _b < _c.length; _b++) {
                    var player = _c[_b];
                    if (player.name == winner)
                        winningMeme = player.currentMeme;
                    if (player.name == game.playerVotingOne)
                        player.setKnockedOut();
                }
            }
            socket.broadcast.emit('web-addWinner', winner);
            var winnerData = {
                meme: winningMeme,
                data: game.players
            };
            console.log(game.players);
            console.log('winner is: ');
            console.log(winner);
            socket.broadcast.emit('voting-done', winnerData);
            game.resetRound();
        }
    });
    socket.on('web-gameOver', function (winnerName) {
        console.log(winnerName);
        socket.broadcast.emit('gameWinner', winnerName);
    });
});
console.log('server running');
//# sourceMappingURL=server.js.map