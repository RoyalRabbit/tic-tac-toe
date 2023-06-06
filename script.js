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
    const board = gameBoard;
    // Switch Player Logic
    let activePlayer = players[0];

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getPlayer = () => activePlayer;
    // Play Round logic

    return { getPlayer, switchActivePlayer, ...board };
    // return { getPlayer, switchActivePlayer, getBoard: board.getBoard, printBoard: board.printBoard};
})();

const screenController = (() => {
    const game = gameController;

    // Select div for player and gameboard
    const playerTurnDiv = document.querySelector('.playerTurn');
    const gameBoardDiv = document.querySelector('.gameBoard');

    // Function for adding elements
    const addElement = (target, element, value, coord) => {
        // Create new element
        const newElement = document.createElement(element);

        // Give element content
        const newContent = document.createTextNode(value);

        // Add text node to element
        newElement.appendChild(newContent);
        
        // If coord parameter is passed, add cell class and row/column datasets
        if (coord) {
            // Add classlist
            newElement.classList.add('cell');

            // Add coord values (row and column)
            const [row, column] = coord;
            newElement.dataset.row = row;
            newElement.dataset.column = column;
        }

        // Add new element to target
        target.appendChild(newElement);
    };

    const addCoord = (i, j) => {
        this.dataset.row = i;
        this.dataset.column = j;
    };

    // Show initial state
    const updateScreen = () => {
        // Clear game board content
        gameBoardDiv.textContent = '';

        // Get current state
        const board = game.getBoard();
        const activePlayer = game.getPlayer();

        // Set player turn content
        playerTurnDiv.textContent = activePlayer.name;

        // Set game board content
        for (let i = 0; i < board.length; i += 1) {
            for (let j = 0; j < board[i].length; j += 1) {
                const value = board[i][j].getValue();
                const coord = [i, j];
                switch (value) {
                    case 0:
                        addElement(gameBoardDiv, 'button', 'Place', coord);
                        break;
                    case 1:
                        addElement(gameBoardDiv, 'button', 'X', coord);
                        break;
                    case 2:
                        addElement(gameBoardDiv, 'button', 'O', coord);
                        break;
                    default:
                        addElement(gameBoardDiv, 'button', '', coord);
                        console.log(
                            `Player Value Error @ Row: ${coord[0]} Column: ${coord[1]}`
                        );
                }
            }
        }
    };
    return { updateScreen };
})();
