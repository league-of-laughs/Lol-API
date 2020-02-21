import Player from '../player';
import Meme from '../meme';

class GameDriver{
    players: Player[];
    memeOneVotes: number;
    memeTwoVotes: number;
    playerVotingOne: Player;
    playerVotingTwo: Player;
    roundWinner: Player;
    displayMeme: String;
    playersUploaded: number;
    playersVoted: number;
    playersKnockedout: number;

    constructor(){
        this.players = [];
        this.memeOneVotes = 0;
        this.memeTwoVotes = 0;
        this.playerVotingOne = null;
        this.playerVotingTwo = null;
        this.displayMeme = null;
        this.playersUploaded = 0;
        this.playersVoted = 0;
        this.playersKnockedout = 0;
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
            if(!top && !bottom){
              player.setKnockedOut();
            }
            else{
              player.setCurrentMeme(new Meme(top, bottom));
            }
          }
        });

        this.increasePlayersUploaded();
    }

    setPlayers(){
      const inGame = [];

      this.players.map(player => {
        if(!player.knockedOut){
          inGame.push(player);
        }
      });

      if(inGame.length == 1){
        return;
      }

      this.shuffle(inGame);

      this.setPlayerVotingOne(inGame.pop());
      this.setPlayerVotingTwo(inGame.pop());
    }

    setPlayerVotingOne(player: Player){
        this.playerVotingOne = player;
    }

    setPlayerVotingTwo(player: Player){
        this.playerVotingTwo = player;
    }

    setRoundWinner(player: Player){
      this.roundWinner = player;
    }

    resetRound(){
        this.memeOneVotes = 0;
        this.memeTwoVotes = 0;
        this.playerVotingOne = null;
        this.playerVotingTwo = null;
        this.playersUploaded = 0;
        this.playersVoted = 0;
        this.roundWinner = null
    }

    increasePlayersUploaded(){
        this.playersUploaded++;
    }

    isDoneUploading(){
      console.log("number of players"+this.players.length);
      console.log("players uploaded"+this.playersUploaded)

      if(this.players.length == this.playersUploaded){
          return true;
      }

      return false;
    }

    setPlayerNumbers(name1, name2){
      this.setPlayerVotingOne(name1);
      this.setPlayerVotingTwo(name2);
    }

    vote(choice){
      choice === 1 ? this.voteMemeOne() : this.voteMemeTwo();

      this.playersVoted++;

      if(this.isDoneVoting()){
        this.handleWinner();
      }
    }

    isDoneVoting(){
      return this.playersVoted === this.players.length;
    }

    getNumPlayers(){
      return this.players.length;
    }

    handleWinner(){
      if(this.memeOneVotes > this.memeTwoVotes){
        this.playerVotingTwo.setKnockedOut();
        this.setRoundWinner(this.playerVotingOne);
      }

      else{
        this.playerVotingOne.setKnockedOut();
        this.setRoundWinner(this.playerVotingTwo);
      }

      this.playersKnockedout++;
    }

    isWinner(){
      return this.playersKnockedout === this.players.length - 1;
    }

    shuffle(a){
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
    }
}

export default GameDriver;