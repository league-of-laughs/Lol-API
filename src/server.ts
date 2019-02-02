const express = require('express');
const bodyparser = require('body-parser');

import GameDriver from './game/gameDriver';

const app = express();

app.use(bodyparser.json());
let server = app.listen(3000);

app.get('/test',(req,res) => {
    res.send('success');
})

const io = require('socket.io')(server)

let game:GameDriver;

io.on('connection',(socket) => {
    console.log('new user connected');

    socket.on('test',() => {
        game = new GameDriver();

        game.setNewDisplayMeme();

        game.addPlayer("mike");

        game.updatePlayerMeme("mike","lol","pls");

        game.playerVotingOne = "mike";

        game.voteMemeOne();
        socket.broadcast.emit('testing',game.players);
        console.log('sent data');
    })

    socket.on('web-newGame',() => {
        game = new GameDriver();
        console.log('creating new game');
    })

    socket.on('mobile-addPlayer',(name: String) => {
        game.addPlayer(name);
        socket.broadcast.emit('web-displayAddedPlayer',name);
    })

    socket.on('web-startGame', () => {
        game.setNewDisplayMeme();
        socket.broadcast.emit('start',game.displayMeme);
    })

    socket.on('mobile-uploadMeme',(data) => {
        let incomplete = true; 

        let {name,topText,bottomText} = data;

        game.updatePlayerMeme(name,topText,bottomText);

        socket.broadcast.emit('uploaded',name);

        game.players.map(player => {
            if(player.name == name)
                player.voted = true;
            
            if(player.voted == false)
                incomplete = false;
        })

        if(!incomplete)
            socket.emit('doneUploading',game.players);
    })

    socket.on('web-setPlayerNumbers',(data) => {
        let{name1,number1,name2,number2} = data;
        game.players.map(player =>{
            if(player.name == name1)
                number1 == 1 ? game.playerVotingOne = player.name :
                game.playerVotingTwo = player.name
        })
        game.players.map(player =>{
            if(player.name == name2)
                number2 == 1 ? game.playerVotingOne = player.name :
                game.playerVotingTwo = player.name
        })
    })

    socket.on('mobile-voteMeme',(data) => {
        let incomplete = true;

        let{name,number} = data;

        if(number == 1)
            game.voteMemeOne
        else
            game.voteMemeTwo

        game.players.map(player => {
            if(player.name == name)
                player.voted = true;
            if(player.voted == false)
                incomplete = false;
        })

        if(!incomplete){
            let winner;
            if(game.memeOne.votes > game.memeTwo.votes){
                winner = 1;
                game.players.map(player => {
                    if(player.name == game.playerVotingTwo)
                        player.knockedOut = true;
                })
            }
            else{
                winner = 2;
                game.players.map(player => {
                    if(player.name == game.playerVotingOne)
                        player.knockedOut = true;
                })
            }
            
            socket.broadcast.emit('voting-done',winner);
        }
        
    })

    socket.on('API', ()=> {
        console.log('ios hit')
    })

    

})

console.log('server running');

// app.listen(3000);
