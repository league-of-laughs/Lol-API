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
    socket.on('host-newGame', function (room) {
        gamesMap[room] = new gameDriver_1["default"]();
        socket.join(room);
        console.log('creating new game for room: ' + room);
    });
    socket.on('client-addPlayer', function (_a) {
        var room = _a.room, name = _a.name;
        try {
            console.log(room);
            var game_1 = getGame(room);
            game_1.addPlayer(name);
            socket.join(room);
            socket.broadcast.to(room).emit('host-displayAddedPlayer', name);
            console.log("adding " + name + " to game room: " + room);
            socket.emit('client-attempt_join', true);
        }
        catch (e) {
            console.log(e);
            socket.emit('client-attempt_join', false);
        }
    });
    socket.on('host-startGame', function (room) {
        console.log(gamesMap);
        try {
            console.log('starting game');
            var game_2 = getGame(room);
            console.log("starting game with " + game_2.getNumPlayers() + " players");
            socket.broadcast.to(room).emit('client-start');
        }
        catch (e) {
            console.log(e);
        }
    });
    socket.on('client-uploadMeme', function (_a) {
        var room = _a.room, data = _a.data;
        var game = getGame(room);
        console.log('player uploading meme');
        console.log(data);
        console.log(room);
        var name = data.name, top = data.top, bottom = data.bottom;
        game.updatePlayerMeme(name, top, bottom);
        socket.broadcast.to(room).emit('host-playerUploadedMeme', name);
        if (game.isDoneUploading()) {
            console.log('done uploading');
            io.sockets.to(room).emit('all-doneUploading', game.players);
        }
    });
    socket.on('host-setPlayerNumbers', function (room, data) {
        console.log('assigning 2 players');
        console.log(data);
        var name1 = data.name1, name2 = data.name2;
        var game = getGame(room);
        game.setPlayerNumbers(name1, name2);
        socket.broadcast.emit('client-startVoting');
    });
    socket.on('client-voteMeme', function (room, data) {
        var game = getGame(room);
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
            socket.broadcast.emit('host-addWinner', winner);
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
    socket.on('host-gameOver', function (winnerName) {
        console.log(winnerName);
        socket.broadcast.emit('gameWinner', winnerName);
    });
});
console.log('server running');
//# sourceMappingURL=server.js.map