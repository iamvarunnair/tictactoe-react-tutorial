import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// This is a function component
function Square(props) {
    return (
        <button className='square' onClick={props.onClick}>
            {props.value}
        </button>
    );
}

/* In React,
    it’s conventional to use on[Event] names for props
    which represent events and
    handle[Event] for the methods which handle the events.
*/

class Board extends React.Component {
    /* So far you setState() update takes the complete state, not one of its keys */
    /* changing state of parent component rerenders parent as well as child components */
    /* if a component doesn't maintain state, but some other component can change its state, it's now a controlled compoenent */
    renderSquare(i) {
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
    render() {
        let i,
            j,
            createdBoard = [],
            index = 0;
        for (i = 0; i < 3; i++) {
            let boardRow = [];
            for (j = 0; j < 3; j++) {
                boardRow.push(this.renderSquare(index));
                index++;
            }
            createdBoard.push(
                <div key={i} className='board-row'>
                    {boardRow}
                </div>
            );
        }
        return <div>{createdBoard}</div>;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    move: {
                        col: null,
                        row: null,
                    },
                },
            ],
            historyOrder: 0,
            stepNumber: 0,
            xIsNext: true,
        };
        /* historyOrder
            0: sorting history in ascending order
            1: sorting history in descending order
        */
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    move: { row: parseInt(i / 3, 10), col: i % 3 },
                },
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0,
        });
    }
    sortMoves(order) {
        /* order
            0: sorting history in ascending order
            1: sorting history in descending order
        */
        if (order !== this.state.historyOrder) {
            this.setState({
                history: this.state.history.slice().reverse(),
                historyOrder: order,
            });
            console.log('check 123', this.state.history);
        }
    }
    render() {
        let current;
        const history = this.state.history;
        if (this.state.historyOrder === 0) {
            current = history[this.state.stepNumber];
        } else {
            current = history[0];
        }
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            let desc;
            if (this.state.historyOrder === 0 && move === 0) {
                desc = 'Go to game start: (col: 0, row 0)';
            } else if (
                this.state.historyOrder &&
                this.state.stepNumber === move
            ) {
                desc = 'Go to game start: (col: 0, row 0)';
            } else {
                desc = `Go to move #${
                    this.state.historyOrder
                        ? this.state.stepNumber - move
                        : this.state.stepNumber + 1 - move
                }: (${step.move.col + 1}, ${step.move.row + 1})`;
            }
            if (
                (this.state.historyOrder === 0 &&
                    this.state.stepNumber === move) ||
                (this.state.historyOrder === 1 && move === 0)
            ) {
                return (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}>
                            <strong>{desc}</strong>
                        </button>
                    </li>
                );
            } else {
                return (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}>
                            {desc}
                        </button>
                    </li>
                );
            }
        });
        /*
                    key is a special and reserved property in React.
                    When an element is created, React extracts the key property and stores the key directly on the returned element.
                    Key cannot be referenced using this.props.key.
                    A component cannot inquire about its key.
                    If no key is specified, React will present a warning and use the array index as a key by default.
                    Keys do not need to be globally unique; they only need to be unique between components and their siblings.
                 */

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (this.state.stepNumber === 9) {
            status = `Opse! It's a draw.`;
        } else {
            status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className='game'>
                <div className='game-board'>
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className='game-info'>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
                <div className='move-order'>
                    <div>Toggle move order</div>
                    <ol>
                        <li key={0}>
                            <button onClick={() => this.sortMoves(0)}>
                                Ascending
                            </button>
                        </li>
                        <li key={1}>
                            <button onClick={() => this.sortMoves(1)}>
                                Descending
                            </button>
                        </li>
                    </ol>
                </div>
            </div>
        );
    }
}
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
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return squares[a];
        }
    }
    return null;
}
// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
