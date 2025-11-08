import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const className = 'square' + (props.highlight ? ' highlight' : '');
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        highlight={this.props.winningSquares.includes(i)}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)} 
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };

    this.state = this.initialState;
  }

  handleReset() {
    this.setState(this.initialState);
  }
  
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        markedSquare: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const win = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const markedSquare = history[move].markedSquare;
      const markedRow = 1 + Math.floor(markedSquare / 3);
      const markedColumn = 1 + (markedSquare % 3);
      const desc = move ?
        'Go to move #' + move + ' (Played in Row: ' + markedRow + " Column: " + markedColumn + ')' :
        'Go to game start';
      const moveClass = (this.state.stepNumber === move) ? "highlight" : "";
      return (
        <li key={move}>
          <button 
            className={moveClass}
            onClick={() => this.jumpTo(move)}>{desc}
          </button>
        </li>
      );
    });

    let status;
    if (win.winner) {
      status = 'Winner: ' + win.winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            winningSquares={win.winningSquares ? win.winningSquares : []}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <div><button onClick={() => this.handleReset()}>Start a New Game</button></div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return  {
        winner: squares[a],
        winningSquares: lines[i],
      }
    }
  }
  if (!squares.includes(null)) {
    return {
      winner: "Cat", 
      winningSquares: null,
    };
  }
  return {
    winner: null, 
    winningSquares: null,
  };
}