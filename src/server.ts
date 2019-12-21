const express = require('express');
const bodyparser = require('body-parser');
const port = process.env.PORT || 3000;
const host = '0.0.0.0'

import GameDriver from './game/gameDriver';

const app = express();
app.use(bodyparser.json());

let server = app.listen(port);
const io = require('socket.io')(server)

const gamesMap = {};

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

      socket.broadcast.to(room).emit('host-playerUploadedMeme', name);

      if(game.isDoneUploading()){
        console.log('done uploading')
        io.sockets.to(room).emit('all-doneUploading',game.players);
      }
    });

    socket.on('host-setPlayerNumbers',(room) => {
      console.log('assigning 2 players');
      const game = getGame(room);
      game.setPlayers();

      io.sockets.to(room).emit('client-startVoting', game);
    });

    socket.on('client-voteMeme',({ room, choice }) => {
      const game = getGame(room);  

      game.vote(choice);

      if(game.isDoneVoting()){
        const winner = game.roundWinner;

        if(game.isWinner()){
          io.sockets.to(room).emit('game-over', winner);
        }
        
        else{
          io.sockets.to(room).emit('voting-done',winner);
          game.resetRound();
        }
      }
  });

    socket.on('host-gameOver',(winnerName) => {
      console.log(winnerName);
      socket.broadcast.emit('gameWinner',winnerName);
    });
});

console.log('server running');
