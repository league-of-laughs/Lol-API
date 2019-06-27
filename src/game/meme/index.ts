class Meme{
    topText: String;
    bottomText: String;
    
    constructor(url:String){
        this.topText = null;
        this.bottomText = null;
    }

    updateBottomText(text:String){
        this.bottomText = text;
    }

    updateTopText(text:String){
        this.topText = text;
    }
}

export default Meme;