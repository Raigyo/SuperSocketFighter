import React, {Component} from 'react';
import './App.css';
import io from "socket.io-client";

let socket;

/* const with that displays the move of the player */
const PlayerCard =({color, symbol})=> {
  const style ={
    backgroundColor: color,
    backgroundImage: "url(./img/" + symbol + ".png)"
  }
  return(
    <div style = {style} className="player-card">
      {/*{symbol}*/}
    </div>
  )
}

/* const that displays the characters animations */
const PlayerSprite =({character, animation})=> {
  const style ={
    //backgroundColor: color,
    backgroundImage: "url(./img/" + character + ".png)"
  }
  return(
      <div style = {style} className = {animation}>
      {/*{symbol}*/}
      </div>
  )
}

/* constructor with all the states of the game */
class App extends Component {
  constructor(props){
    super(props)
    this.playerChoice = this.playerChoice.bind(this)
    this.symbols = ["rock", "paper", "scissors", "lizard", "spock"]
    this.state = {
      endpoint: "localhost:8000",
      playerRedDisplay: this.symbols[0],
      playerBlueDisplay: this.symbols[0],
      round: 1,
      scoreRed: 0,
      scoreBlue: 0,
      resultDisplay: "",
      nextMove: false,
      nextFight: false,
      buttonsChoice: true,
      nextRound: false,
      animationPlayerOne: "p1-idle",
      animationPlayerTwo: "p2-idle",
      healthRyu: 100,
      healthChun: 100,
      playerOneHasPlayed: false,
      playerTwoHasPlayed: false,
    }
    socket = io(this.state.endpoint);
  }

  componentDidMount(){
  // reception des messages
  /*  socket.on('moves', (data) =>{
      this.setState({
        playerRed: this.symbols[data.movePlayerOne],
        playerBlue: this.symbols[data.movePlayerTwo],
        playerOneHasPlayed: data.playerOneHasPlayed,
        playerTwoHasPlayed: data.playerTwoHasPlayed,
        nextFight: true,
      })
    });*/
    //this.decideWinner();
  }

  componentDidUpdate(){
    socket.on('moves', (data) =>{
      this.setState({
        playerRed: this.symbols[data.movePlayerOne],
        playerBlue: this.symbols[data.movePlayerTwo],
        playerOneHasPlayed: data.playerOneHasPlayed,
        playerTwoHasPlayed: data.playerTwoHasPlayed,
        nextFight: true,
      })
      if (this.state.playerOneHasPlayed === true && this.state.playerTwoHasPlayed === true){
        this.runGame();
      }
    });
  }

  /* function to make a move*/
  playerChoice = (move) => {
        if (this.props.playerNumberOne === true){
          socket.emit('move-playerone', {playerOneMove: move})
        }
        else {
          socket.emit('move-playertwo', {playerTwoMove: move})
        }
  }

/* function to launch the next round */
  runNextRound = () => {
        this.setState((preState) => {return {round : preState.round + 1}});
        this.setState({
          playerRedDisplay: this.symbols[0],
          playerBlueDisplay: this.symbols[0],
          resultDisplay: "",
          winner: "",
          nextMove: false,
          nextFight: false,
          buttonsChoice: true,
          nextRound: false,
          animationPlayerOne: "p1-idle",
          animationPlayerTwo: "p2-idle",
          healthRyu: 100,
          healthChun: 100,
          //playerOneHasPlayed: false,
          //playerTwoHasPlayed: false,
        })
  }

  /* function to decide winner + if the round is finished */
  decideWinner = () => {
    const {playerBlue, playerRed} = this.state
    this.setState({
      playerRedDisplay: this.state.playerRed,
      playerBlueDisplay: this.state.playerBlue,
      resultDisplay: this.state.playerRed + " versus " + this.state.playerBlue + " : ",
      nextFight: false,
      nextMove: true,
      buttonsChoice: false,
      nextRound: false,
    })
    if (playerRed === playerBlue){
      return " It's a draw !"
    }
    if (
          (playerRed==="scissors" && playerBlue ==="paper")||
          (playerRed==="paper" && playerBlue ==="rock")||
          (playerRed==="rock" && playerBlue ==="lizard")||
          (playerRed==="lizard" && playerBlue ==="spock")||
          (playerRed==="spock" && playerBlue ==="scissors")||
          (playerRed==="scissors" && playerBlue ==="lizard")||
          (playerRed==="lizard" && playerBlue ==="paper")||
          (playerRed==="paper" && playerBlue ==="spock")||
          (playerRed==="spock" && playerBlue ==="rock")||
          (playerRed==="rock" && playerBlue ==="scissors")
        )
        {
          if (this.state.healthChun !== 20){
            this.setState((preState) => {return {scoreRed : preState.scoreRed + 1, healthChun : preState.healthChun -20, animationPlayerOne: "p1-won", animationPlayerTwo: "p2-lost"}});
            return this.props.playerOne + " strikes ! "
          }
          if (this.state.healthChun === 20){
            this.setState((preState) => {return {scoreRed : preState.scoreRed + 1, healthChun : preState.healthChun -20, nextMove: false, nextFight: false, nextRound: true, animationPlayerOne: "p1-wonRound", animationPlayerTwo: "p2-looseRound"}});
            return this.props.playerOne + " wins ! "
          }
        }
    if (this.state.healthRyu !== 20){
      this.setState((preState) => {return {scoreBlue : preState.scoreBlue + 1, healthRyu : preState.healthRyu -20, animationPlayerTwo: "p2-won", animationPlayerOne: "p1-lost"}});
      return this.props.playerTwo + " strikes !"
    }
    if (this.state.healthRyu === 20){
      this.setState((preState) => {return {scoreBlue : preState.scoreBlue + 1, healthRyu : preState.healthRyu -20, nextMove: false, nextFight: false, nextRound: true, animationPlayerOne: "p1-looseRound", animationPlayerTwo: "p2-wonRound"}});
      return this.props.playerTwo + " wins !"
    }
  }

  /* function to launch a game */
  runGame = () => {
    this.setState({nextFight: false, buttonsChoice: false})
    this.setState({winner: this.decideWinner()})
  }

  /* function that reset some states after a move */
  nextMove = () => {
    this.setState({
      playerRedDisplay: this.symbols[0],
      playerBlueDisplay: this.symbols[0],
      nextFight: false,
      nextMove: false,
      buttonsChoice: true,
      resultDisplay: "",
      winner: "",
      animationPlayerOne: "p1-idle",
      animationPlayerTwo: "p2-idle",
    })
  }

  render(){
    const nextMove = this.state.nextMove;
    const nextFight = this.state.nextFight;
    const nextRound = this.state.nextRound;
    const buttonsChoice = this.state.buttonsChoice;
    let buttonNextDisplay;
    let buttonsChoiceDisplay;
    let buttonNextRound;
    if (nextMove) {
      //buttonNextDisplay = <div className="hud"><button onClick={this.nextMove}>NEXT MOVE</button></div>
      let counter =0;
      let myInterval = setInterval(() => {
        counter++;
        if(counter > 10){
          clearInterval(myInterval)
          this.nextMove();
        }
      },500)
    }
    /*if (nextFight) {
      buttonNextDisplay =  <div className="hud"><button onClick={this.runGame}>FIGHT!</button></div>
    }*/
    if (buttonsChoice) {
      buttonsChoiceDisplay =
      <div className="buttonsGroup" id="buttonsGroup">
          <div className="hud">Choose your weapon:</div>
          <input className = "buttonsPlay" alt = "button rock" onClick={() => this.playerChoice(0)} type = "image" src = "./img/rock.png" />
          <input className = "buttonsPlay" alt = "button paper" onClick={() => this.playerChoice(1)} type = "image" src = "./img/paper.png" />
          <input className = "buttonsPlay" alt = "button scissors" onClick={() => this.playerChoice(2)} type = "image" src = "./img/scissors.png" />
          <input className = "buttonsPlay" alt = "button lizard" onClick={() => this.playerChoice(3)} type = "image" src = "./img/lizard.png" />
          <input className = "buttonsPlay" alt = "button spock" onClick={() => this.playerChoice(4)} type = "image" src = "./img/spock.png" />
    </div>
    }
    if (nextRound) {
      buttonNextRound =
        <div className="hud">
          <button onClick={this.runNextRound}>PLAY NEXT ROUND</button>
        </div>
      }
    return (

    <div id="conteneur-flexbox">
      <div className="title" id="title"><img src="img/socket-fighter.png" alt=""/></div>
      <div className="hud" id="player-1">
        <div>{this.props.playerOne}: {this.state.scoreRed}</div>
        <div><progress id="health-ryu" className="health" value={`${this.state.healthRyu}`} max="100"></progress></div>
          <PlayerSprite
          character="ryu"
          animation={this.state.animationPlayerOne}
          />
      </div>{/*\div player-1*/}
      <div className="App" id="App">
        <div className="hud">ROUND: {this.state.round} </div>
        <div id="cards" className="cards">
            <PlayerCard
            color="red"
            symbol={this.state.playerRedDisplay}
            />
            <PlayerCard
            color="blue"
            symbol={this.state.playerBlueDisplay}
            />
        </div>
        <div className="versus"><img src="img/versus.png" alt=""/></div>
        <div className="hud">{/*this.state.resultDisplay*/} {this.state.winner}</div>
        {buttonsChoiceDisplay}
        {buttonNextDisplay}
        {buttonNextRound}
      </div>{/*\div app*/}
      <div className="hud" id="player-2">
        <div>{this.props.playerTwo}: {this.state.scoreBlue}</div>
        <div><progress id="health-chun" className="health" value={`${this.state.healthChun}`} max="100"></progress></div>
        <PlayerSprite
        character="chun-li"
        animation={this.state.animationPlayerTwo}
        />
      </div>{/*\div player-2*/}
    </div>//\conteneur-flexbox
      );
  }//\render
}//\class App

export default App;
