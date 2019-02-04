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

let game = new GameDriver();

io.on('connection',(socket) => {
    console.log('new user connected');

    socket.on('test',() => {
        console.log('testing')
        socket.broadcast.emit('web-playerUploadedMeme',"alex");
    })

    socket.on('web-newGame',() => {
        game = new GameDriver();
        console.log('creating new game');
    })

    socket.on('mobile-addPlayer',(name: String) => {
        console.log(name);
        game.addPlayer(name);
        socket.broadcast.emit('web-displayAddedPlayer',name);
    })

    socket.on('web-startGame', (meme) => {
        console.log('starting game')
        game.numPlayers = game.players.length;
        console.log(game.numPlayers);
        socket.broadcast.emit('mobile-start',meme);
    })

    socket.on('mobile-uploadMeme',(data) => {
        console.log('player uploading meme')
        data = JSON.parse(data);
        console.log(data);
        
        game.increasePlayersUploaded()

        let {name,topText,bottomText} = data;

        game.updatePlayerMeme(name,topText,bottomText);

        socket.broadcast.emit('web-playerUploadedMeme',name);

        for(let player of game.players){
            if(player.name == name)
                player.setUploaded();
        }

        let incomplete = true; 
        for(let player of game.players){
            if(player.uploaded == false)
                incomplete = false;
        }
        console.log("number of players"+game.numPlayers);
        console.log("players uploaded"+game.playersUploaded)

        if(game.playersUploaded == game.numPlayers){
            console.log('done uploading')
            socket.broadcast.emit('web-doneUploading',game.players);
        }
    })

    socket.on('web-setPlayerNumbers',(data) => {
        console.log('assigning 2 players');
        console.log(data)
        let{name1,name2} = data;
        for(let player of game.players) {
            if(player.name == name1)
                game.setPlayerVotingOne(player.name);
        }
        for(let player of game.players){
            if(player.name == name2)
                game.setPlayerVotingTwo(player.name)
        }

        socket.broadcast.emit('mobile-startVoting');
    })

    socket.on('mobile-voteMeme',(data) => {
        
        data = JSON.parse(data);
        console.log(data);
        console.log('voting')
        let incomplete = true;

        let{name,number} = data;
        console.log(name);
        console.log(number);

        if(number == 1){
            game.voteMemeOne();
        }
           
        else{
            game.voteMemeTwo()
        }

        game.players.map(player => {
            if(player.name == name)
                player.voted = true;
            if(player.voted == false)
                incomplete = false;
        })

        if(incomplete){
            console.log('there is a winner')
            let winner;
            let winningMeme;
            if(game.memeOneVotes > game.memeTwoVotes){
                console.log(game.playerVotingOne)
                console.log("loser: "+ game.playerVotingTwo)
                winner = game.playerVotingOne;
                for(let player of game.players){
                    if(player.name == winner)
                        winningMeme = player.currentMeme
                        
                    if(player.name == game.playerVotingTwo)
                        player.setKnockedOut();
                }
            }
            else{
                console.log(game.playerVotingTwo)
                winner = game.playerVotingTwo;
                for(let player of game.players){
                    if(player.name == winner)
                        winningMeme = player.currentMeme
                    if(player.name == game.playerVotingOne)
                        player.setKnockedOut();
                }
            }
            socket.broadcast.emit('web-addWinner',winner)
            let winnerData = {
                meme: winningMeme,
                data: game.players
            }

            console.log(game.players);
            console.log('winner is: ')
            console.log(winner);
            
            
            socket.broadcast.emit('voting-done',winnerData);
            game.resetRound();
        }

        
        
    })
    socket.on('web-gameOver',(winnerName) => {
        console.log(winnerName);
        socket.broadcast.emit('gameWinner',winnerName);
    })

    socket.on('web-newGame',() => {
        game = new GameDriver();
        socket.broadcast.emit('restart');
    })

})

console.log('server running');
