import Player from '../player';
import Meme from '../meme';

const axios = require('axios');

let Memes = [
    "https://sports-images.vice.com/images/2017/01/25/when-nick-young-the-basketball-player-met-nick-young-the-meme-body-image-1485378510.jpg",
    "https://sports-images.vice.com/images/2017/01/25/when-nick-young-the-basketball-player-met-nick-young-the-meme-body-image-1485378510.jpg",
    "https://sports-images.vice.com/images/2017/01/25/when-nick-young-the-basketball-player-met-nick-young-the-meme-body-image-1485378510.jpg"
]

class GameDriver{
    players: Player[];
    memeOne: Meme;
    memeTwo: Meme;
    playerVotingOne: String;
    playerVotingTwo: String;
    displayMeme: String;

    constructor(){
        this.players = [];
        this.memeOne = null;
        this.memeTwo = null;
    }

    addPlayer(playerName: String){
        let player = new Player(playerName);
        this.players.push(player);
    }

    voteMemeOne(){
        this.memeOne.addVote;
    }

    voteMemeTwo(){
        this.memeTwo.addVote;
    }

    setNewDisplayMeme(){
        this.displayMeme = Memes[Math.floor(Math.random()*Memes.length)];
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

    



}

export default GameDriver;