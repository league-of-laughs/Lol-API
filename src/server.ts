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

  socket.on('host-newGame',(room) => {
    gamesMap[room] = new GameDriver();
    socket.join(room);
    console.log('creating new game for room: '+ room);
  });

  socket.on('client-addPlayer',({ room, name }) => {
    try{
      console.log(room)
      const game = getGame(room);
      game.addPlayer(name);
      socket.join(room);
      socket.broadcast.to(room).emit('host-displayAddedPlayer', name);
      console.log(`adding ${name} to game room: ${room}`);
      socket.emit('client-attempt_join',true);
    }catch(e){
      console.log(e);
      socket.emit('client-attempt_join',false);
    }
  });

  socket.on('host-startGame', (room) => {
    console.log(gamesMap);
    try{
      console.log('starting game');
      const game = getGame(room);
      console.log(`starting game with ${game.getNumPlayers()} players`);
      socket.broadcast.to(room).emit('client-start');
    }catch(e){
      console.log(e);
    }
  });

    socket.on('client-uploadMeme',({ room, data }) => {
        const game  = getGame(room);
        console.log('player uploading meme')
        console.log(data);
        console.log(room)

        const { name, top, bottom } = data;

        game.updatePlayerMeme(name,top,bottom);

        socket.broadcast.to(room).emit('host-playerUploadedMeme',name);

        if(game.isDoneUploading()){
            console.log('done uploading')
            io.sockets.to(room).emit('all-doneUploading',game.players);
        }
    });

    socket.on('host-setPlayerNumbers',(room, data) => {
        console.log('assigning 2 players');
        console.log(data)
        let { name1, name2 } = data;
        const game = getGame(room);
        game.setPlayerNumbers(name1, name2);

        socket.broadcast.emit('client-startVoting');
    });

    socket.on('client-voteMeme',(room, data) => {
        const game = getGame(room);  

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
            socket.broadcast.emit('host-addWinner',winner)
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

    socket.on('host-gameOver',(winnerName) => {
        console.log(winnerName);
        socket.broadcast.emit('gameWinner',winnerName);
    });
});

console.log('server running');
