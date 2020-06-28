import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        selected: null,
      }],
      xIsNext: true,
      stepNumber: 0,
    }
  }
  
  handleClick(i) {
    //gets the current history from the games state, uses stepnumber to ensure if we time travel back,
    //to this step in history, then we throw away the future moves that were made.
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    //sets the current to the last version of the board in the history.
    const current = history[history.length -1];
    //the array of squares is copied using slice to maintain immutability.
    const squares = current.squares.slice();

    //calculates winner and returns if someone has already won.
    if(CalculateWinner(squares) || squares[i]) {
      return;
    }

    //works out which symbol to place next based on the isnext flag
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    //when setting the state, we push a version of the squares into the history array by using concat.
    //concat doesn't mutate the original array unlike push.
    this.setState({
      history: history.concat([{
        squares: squares,
        selected: i,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = CalculateWinner(current.squares);

    const moves = history.map((step, move) => {

      const desc = move ?
        'Go to move #' + move + ' last pos was ' + (Math.floor(step.selected /3)) + ',' + (step.selected %3):
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ===0,
    });
  }
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
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

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function CalculateWinner(squares) {
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
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
