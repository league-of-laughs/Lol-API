import Player from '../player';
import Meme from '../meme';

class GameDriver{
    players: Player[];
    memeOneVotes: number;
    memeTwoVotes: number;
    playerVotingOne: String;
    playerVotingTwo: String;
    displayMeme: String;
    playersUploaded: number;
    numPlayers:number;

    constructor(){
        this.players = [];
        this.memeOneVotes = 0;
        this.memeTwoVotes = 0;
        this.playerVotingOne = null;
        this.playerVotingTwo = null;
        this.displayMeme = null;
        this.playersUploaded = 0;
    }

    addPlayer(playerName: String){
        let player = new Player(playerName);
        this.players.push(player);
    }

    voteMemeOne(){
        this.memeOneVotes ++;
    }

    voteMemeTwo(){
        this.memeTwoVotes ++;
    }

    updatePlayerMeme(name:String, top:String, bottom:String){
        this.players.map(player => {
            if(player.name == name){
                player.setCurrentMeme(new Meme(this.displayMeme));
                player.currentMeme.updateBottomText(bottom);
                player.currentMeme.updateTopText(top);
            }
        });

        this.increasePlayersUploaded();
    }

    setPlayerVotingOne(name:String){
        this.playerVotingOne = name;
    }

    setPlayerVotingTwo(name:String){
        this.playerVotingTwo = name;
    }

    resetRound(){
        this.memeOneVotes = 0;
        this.memeTwoVotes = 0;
        this.playerVotingOne = null;
        this.playerVotingTwo = null;
        this.players.map(player => {
            player.voted = false;
        })
    }

    increasePlayersUploaded(){
        this.playersUploaded ++;
    }

    isDoneUploading(){
      for(let player of this.players){
        if(player.name == name)
          player.setUploaded();
      }

      let incomplete = true; 
      for(let player of this.players){
        if(player.uploaded == false)
          incomplete = false;
      }
      console.log("number of players"+this.players.length);
      console.log("players uploaded"+this.playersUploaded)

      if(this.playersUploaded == this.numPlayers){
          return true;
      }

      return false;
    }

    setPlayerNumbers(name1, name2){
      for(let player of this.players) {
        if(player.name == name1){
          this.setPlayerVotingOne(player.name);
        }
    }
      for(let player of this.players){
        if(player.name == name2){
          this.setPlayerVotingTwo(player.name)
        }
      }
    }

    getNumPlayers(){
      return this.players.length;
    }
}

export default GameDriver;