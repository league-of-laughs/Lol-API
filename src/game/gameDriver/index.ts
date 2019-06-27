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
        this.numPlayers = 0;
    }

    addPlayer(playerName: String){
        let player = new Player(playerName);
        this.players.push(player);
        this.numPlayers ++;
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
        })
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

    getNumPlayers(){
        return this.numPlayers;
    }

}

export default GameDriver;