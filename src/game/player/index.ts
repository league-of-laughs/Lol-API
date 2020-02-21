import Meme from '../meme';

class Player{
    name: String;
    currentMeme: Meme;
    knockedOut: boolean;
    voted: boolean;
    uploaded: boolean;

    constructor(name:String){
        this.name = name;
        this.knockedOut = false;
        this.currentMeme = new Meme('',''),
        this.voted = false;
        this.uploaded = false;
    }

    setCurrentMeme(meme: Meme){
        this.currentMeme = meme;
    }

    getName(){
        return this.name;
    }

    setUploaded(){
        this.uploaded = true;
    }

    setKnockedOut(){
        this.knockedOut = true;
    }
}

export default Player;