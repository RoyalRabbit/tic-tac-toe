const gameBoard = (() => {
    const rows = 3;
    const columns = 3;
    const board = [];
    for (let i = 0; i < rows; i += 1) {
        board[i] = [];
        for (let j = 0; j < columns; j += 1) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const printBoard = () => {
        const boardState = board.map((row) =>
            row.map((column) => column.getValue())
        );
        console.log(boardState);
    };

    const markBoard = (row, column, player) => {
        const spot = board[row][column];
        if (spot.getValue() > 0) return;
        spot.addMark(player);
    };

    return { getBoard, printBoard, markBoard };
})();

function Cell() {
    let value = 0;
    const addMark = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addMark,
        getValue,
    };
}

const gameController = ((
    playerOneName = 'Player One',
    playerTwoName = 'Player Two'
) => {
    const players = [
        { name: playerOneName, mark: 1 },
        { name: playerTwoName, mark: 2 },
    ];

    // Switch Player Logic
    let activePlayer = players[0];

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getPlayer = () => activePlayer;
    // Play Round logic

    return { getPlayer, switchActivePlayer };
})();
