"use strict";
exports.__esModule = true;
var express = require('express');
var bodyparser = require('body-parser');
var gameDriver_1 = require("./game/gameDriver");
var app = express();
app.use(bodyparser.json());
var server = app.listen(3000);
app.get('/test', function (req, res) {
    res.send('success');
});
var io = require('socket.io')(server);
var game;
io.on('connection', function (socket) {
    console.log('new user connected');
    socket.on('test', function () {
        game = new gameDriver_1["default"]();
        game.setNewDisplayMeme();
        game.addPlayer("mike");
        game.updatePlayerMeme("mike", "lol", "pls");
        socket.broadcast.emit('testing', game.players);
        console.log('sent data');
    });
    socket.on('web-newGame', function () {
        game = new gameDriver_1["default"]();
        console.log('creating new game');
    });
    socket.on('mobile-addPlayer', function (name) {
        game.addPlayer(name);
        socket.broadcast.emit('web-displayAddedPlayer', name);
    });
    socket.on('web-startGame', function () {
        game.setNewDisplayMeme();
        socket.broadcast.emit('start', game.displayMeme);
    });
    socket.on('mobile-uploadMeme', function (data) {
        var incomplete = true;
        var name = data.name, topText = data.topText, bottomText = data.bottomText;
        game.updatePlayerMeme(name, topText, bottomText);
        socket.broadcast.emit('uploaded', name);
        game.players.map(function (player) {
            if (player.name == name)
                player.voted = true;
            if (player.voted == false)
                incomplete = false;
        });
        if (!incomplete)
            socket.emit('doneUploading', game.players);
    });
    socket.on('web-setPlayerNumbers', function (data) {
        var name1 = data.name1, number1 = data.number1, name2 = data.name2, number2 = data.number2;
        game.players.map(function (player) {
            if (player.name == name1)
                number1 == 1 ? game.playerVotingOne = player.name :
                    game.playerVotingTwo = player.name;
        });
        game.players.map(function (player) {
            if (player.name == name2)
                number2 == 1 ? game.playerVotingOne = player.name :
                    game.playerVotingTwo = player.name;
        });
    });
    socket.on('mobile-voteMeme', function (data) {
        var incomplete = true;
        var name = data.name, number = data.number;
        if (number == 1)
            game.voteMemeOne;
        else
            game.voteMemeTwo;
        game.players.map(function (player) {
            if (player.name == name)
                player.voted = true;
            if (player.voted == false)
                incomplete = false;
        });
        if (!incomplete) {
            var winner = void 0;
            if (game.memeOne.votes > game.memeTwo.votes) {
                winner = 1;
                game.players.map(function (player) {
                    if (player.name == game.playerVotingTwo)
                        player.knockedOut = true;
                });
            }
            else {
                winner = 2;
                game.players.map(function (player) {
                    if (player.name == game.playerVotingOne)
                        player.knockedOut = true;
                });
            }
            socket.broadcast.emit('voting-done', winner);
        }
    });
    socket.on('API', function () {
        console.log('ios hit');
    });
});
console.log('server running');
// app.listen(3000);
