class Meme{
    url:String;
    topText: String;
    bottomText: String;
    votes: number;
    
    constructor(url:String){
        this.url = url;
        this.topText = null;
        this.bottomText = null;
        this.votes = 0;
    }

    updateBottomText(text:String){
        this.bottomText = text;
    }

    updateTopText(text:String){
        this.topText = text;
    }

    addVote(){
        this.votes ++;
    }

    resetVote(){
        this.votes = 0;
    }

}

export default Meme;