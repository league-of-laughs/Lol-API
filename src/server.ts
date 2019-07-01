const express = require('express');
const bodyparser = require('body-parser');

const port = process.env.PORT || 3000;
const host = '0.0.0.0'

import GameDriver from './game/gameDriver';

const app = express();
app.use(bodyparser.json());

app.get('/',(req, res) => {
    console.log('hit')
    res.sendFile('/pages/landing/index.html',{root:__dirname});
})

let server = app.listen(port);
const io = require('socket.io')(server)

const gamesMap = {};
let game;

const getGame = (room): GameDriver => {
  return gamesMap[room];
}

io.on('connection',(socket) => {
  console.log('new user connected');

  socket.on('web-newGame',(room) => {
    gamesMap[room] = new GameDriver();
    socket.join(room);
    console.log('creating new game for room: '+room);
  })

  socket.on('mobile-addPlayer',({ room, name }) => {
    try{
      const game = getGame(room);
      game.addPlayer(name);
      socket.join(room);
      socket.broadcast.to(room).emit('web-displayAddedPlayer', name);
      console.log(`adding ${name} to game room: ${room}`);
      console.log(game)
      socket.emit('mobile-attempt_join',true);
    }catch(e){
      socket.emit('mobile-attempt_join',false);
    }
  })

    socket.on('web-startGame', (meme, room) => {
        const game = getGame(room);
        console.log(`starting game with ${game.getNumPlayers()} players`);
        socket.broadcast.to(room).emit('mobile-start',meme, room);
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
            if(player.voted == false){
                incomplete = false;
                console.log('not done yet');
            }
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
})

console.log('server running');
