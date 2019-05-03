import React, { Component } from 'react'
import './index.css';
import io from "socket.io-client";

var socket;

class Game extends Component{
  constructor(props){
    super(props);
    
    
    this.state = {
      endpoint: "localhost:8000",
      board: {},
      selected: '',
      legalMove: [],
      mandatory: [],
      colNames: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
     
    };
    socket = io(this.state.endpoint);

    const colNames = this.state.colNames;
    for(let row = 0; row < 8; row++){
      for(let col = 0; col < 8; col++){
        let id = colNames[col] + (row+1);
        this.state.board[id] = {
          color: (row+col)%2 ? 'light' : 'dark',
          id: colNames[col] + (row+1),
          content: '',
          pieceColor: '',
          highlighted: false,
          queen: false
        };
      }
    }
  }

  changePiece(id, content, color, isQueen){
    let newBoard = this.state.board;
    newBoard[id].content = content
    newBoard[id].pieceColor = color;
    newBoard[id].queen = isQueen;
    this.setState({board: newBoard});
  } 

  handleClick(id){
    // socket.emit -> nom du socket.on coté serveur
    id.preventDefault();
     let choice = (id.currentTarget.id);
     socket.emit('handleClick')
     // else {
     //   this.handleOccupied(choice)
     // }
} 

  
  componentDidMount(){
  // reception des messages
  // socket.on -> emit du coté serveur

    const reds = ['A1', 'A3', 'B2', 'C1', 'C3', 'D2', 'E1', 'E3', 'F2', 'G1', 'G3', 'H2'];
    const blues = ['A7', 'B6', 'B8', 'C7', 'D6', 'D8', 'E7', 'F6', 'F8', 'G7', 'H6', 'H8'];
    reds.forEach(pos => this.changePiece(pos, <div className="red checker"></div>, 'red', false));
    blues.forEach(pos => this.changePiece(pos, <div className="blue checker"></div>, 'blue', false));
//-------------------------------------------------------------
    socket.on('click', (data) =>{
      this.setState({click: 'coucou'});
    });
}
  render(){
    console.log(this.state.board)
    return (

      <>        
       <h1> hello le jeu </h1>
        <div 
          className="col align-self-center" 
          id="mainboard">
          <div id="checker-board">
            {Object.keys(this.state.board).map(key => {
              let square = this.state.board[key];
              return (
                <div 
                  className={`square ${square.color}${square.highlighted ? ' highlighted' : ''}`} 
                  id={square.id} 
                  key={square.id} 
                  onClick={this.handleClick.bind(this)}>{square.content}
              </div>
            )})}
          </div>
        </div>

      </>
    );
  }
}

export default Game;



