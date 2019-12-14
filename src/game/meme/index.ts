class Meme{
    topText: String;
    bottomText: String;
    
    constructor(top: String, bottom: String){
        this.topText = top;
        this.bottomText = bottom;
    }

    updateBottomText(text:String){
        this.bottomText = text;
    }

    updateTopText(text:String){
        this.topText = text;
    }
}

export default Meme;