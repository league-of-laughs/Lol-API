"use strict";
exports.__esModule = true;
var express = require('express');
var bodyparser = require('body-parser');
var port = process.env.PORT || 3000;
var host = '0.0.0.0';
var gameDriver_1 = require("./game/gameDriver");
var app = express();
app.use(bodyparser.json());
var server = app.listen(port);
var io = require('socket.io')(server);
var gamesMap = {};
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
            var game = getGame(room);
            game.addPlayer(name);
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
            var game = getGame(room);
            console.log("starting game with " + game.getNumPlayers() + " players");
            socket.broadcast.to(room).emit('client-start');
        }
        catch (e) {
            console.log(e);
        }
    });
    socket.on('host-caption_timeout', function (room) {
        console.log('timeout');
        var game = getGame(room);
        io.sockets.to(room).emit('all-doneUploading', game.players);
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
    socket.on('host-setPlayerNumbers', function (room) {
        console.log('assigning 2 players');
        var game = getGame(room);
        game.setPlayers();
        io.sockets.to(room).emit('client-startVoting', game);
    });
    socket.on('client-voteMeme', function (_a) {
        var room = _a.room, choice = _a.choice;
        var game = getGame(room);
        game.vote(choice);
        if (game.isDoneVoting()) {
            var winner = game.roundWinner;
            if (game.isWinner()) {
                io.sockets.to(room).emit('game-over', winner);
            }
            else {
                io.sockets.to(room).emit('voting-done', winner);
                game.resetRound();
            }
        }
    });
    socket.on('host-vote_timeout', function (room) {
        var game = getGame(room);
        game.handleWinner();
        var winner = game.roundWinner;
        if (game.isWinner()) {
            io.sockets.to(room).emit('game-over', winner);
        }
        else {
            io.sockets.to(room).emit('voting-done', winner);
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