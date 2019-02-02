import Meme from '../meme';

class Player{
    name: String;
    currentMeme: Meme;
    currentVote: number;
    knockedOut: boolean;
    number: number;
    voted: boolean;
    uploaded: boolean;

    constructor(name:String){
        this.name = name;
        this.knockedOut = false;
        this.currentMeme = null,
        this.number = null;
        this.currentVote = null;
        this.voted = false;
        this.uploaded = false;
    }

    setCurrentMeme(meme: Meme){
        this.currentMeme = meme;
    }

    getName(){
        return this.name;
    }

    setNumber(number: number){
        this.number = number;
    }

}

export default Player;