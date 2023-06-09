const gameBoard = () => {
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
        console.log(getBoardState());
    };

    const getBoardState = () => {
        const boardState = board.map((row) =>
            row.map((column) => column.getValue())
        );
        return boardState;
    };

    const markBoard = (row, column, player) => {
        const spot = board[row][column];
        if (spot.getValue() > 0) return;
        spot.addMark(player);
    };

    return { getBoard, printBoard, markBoard, getBoardState };
};

function Cell() {
    let value = 0;
    const addMark = (player) => {
        value = player;
    };

    const getValue = () => value;

    const resetValue = () => {
        value = 0;
    };

    return {
        addMark,
        getValue,
        resetValue,
    };
}

const gameController = (
    playerOneName = 'Player One',
    playerTwoName = 'Player Two'
) => {
    const players = [
        { name: playerOneName, mark: 1, symbol: 'X' },
        { name: playerTwoName, mark: 2, symbol: 'O' },
    ];
    const board = gameBoard();
    // Switch Player Logic
    let activePlayer = players[0];

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const changeName = (player, playerName) => {
        switch (player) {
            case 1: {
                players[0].name=playerName;
                break;
            }  
            case 2: {
                players[1].name=playerName;
                break;
            }
            default : {
                console.log('Error: changeName error')
            }
        }
    };

    const getPlayer = () => activePlayer;

    // Play Round logic
    const playRound = (row, column) => {
        const playerMark = getPlayer().mark;
        board.markBoard(row, column, playerMark);
    };

    const resetBoard = () => {
        board
            .getBoard()
            .forEach((row) => row.forEach((obj) => obj.resetValue()));
        activePlayer = players[0];
    };

    // Function to check if a win condition is set
    const checkWin = (playerValue = getPlayer().mark) => {
        const checkBoard = board.getBoardState();
        const allEqual = (arr) => arr.every((v) => v === playerValue);
        const win = { check: false, condition: '', winArray: [] };
        const rows = 3;
        const columns = 3;

        // Check if a row is all equal to the playerValue
        for (let i = 0; i < rows; i += 1) {
            const row = checkBoard[i];
            if (allEqual(row)) {
                win.check = true;
                win.condition = 'row';
                win.winArray = i;
            }
        }

        // Check for columns to be all equal to playerValue
        for (let i = 0; i < columns; i += 1) {
            const column = checkBoard.map((arr) => arr[i]);
            if (allEqual(column)) {
                win.check = true;
                win.condition = 'column';
                win.winArray = i;
            }
        }

        // Check diagonals to be all equal to playerValue
        const diagTL = [];
        const diagTR = [];
        for (let i = 0; i < rows; i += 1) {
            diagTL.push(checkBoard[i][i]);
            diagTR.push(checkBoard[i][2 - i]);
        }
        if (allEqual(diagTL) || allEqual(diagTR)) {
            win.check = true;
            win.condition = allEqual(diagTL) ? 'diagTL' : 'diagTR'; // this line sets the win.condition property
            win.winArray = allEqual(diagTL) ? 0 : 1; // this line sets the win.winArray property
        }

        return win;
    };

    return {
        getPlayer,
        switchActivePlayer,
        playRound,
        resetBoard,
        checkWin,
        ...board,
    };
};

const screenController = (() => {
    const game = gameController();

    // Select div for player and gameboard and reset
    const playerTurnDiv = document.querySelector('.playerTurn');
    const gameBoardDiv = document.querySelector('.gameBoard');
    const buttonDiv = document.querySelector('.button-container');

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
                        addElement(gameBoardDiv, 'button', '', coord);
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

    function addLine(winObject) {
        const { condition, winArray } = winObject;

        // Draw horizontal/vertical lines for row and column win conditions
        if (condition === 'row' || condition === 'column') {
            const cells = document.querySelectorAll(
                `[data-${condition}="${winArray}"]`
            );
            cells.forEach((e) => e.classList.add(condition));
        }

        // Draw diagonal lines for diagonal win condition
        else if (condition === 'diagTL') {
            for (let i = 0; i <= 2; i += 1) {
                const cell = document.querySelector(
                    `[data-row="${i}"][data-column="${i}"]`
                );
                cell.classList.add('diagTL');
            }
        } else if (condition === 'diagTR') {
            for (let i = 0; i <= 2; i += 1) {
                const cell = document.querySelector(
                    `[data-row="${i}"][data-column="${2 - i}"]`
                );
                cell.classList.add('diagTR');
            }
        }
    }

    // Reset Button Handler
    function clickHandlerButton(event) {
        const selectedTarget = event.target;
        if (selectedTarget.classList.contains('reset-btn')) {
            game.resetBoard();
            updateScreen();
        }
        if (selectedTarget.classList.contains('changename-btn')) {
            console.log('wee')
        }
    }

    // Get user input for desired mark location
    function clickHandlerBoard(event) {
        const selectedTarget = event.target;
        const winCheck = game.checkWin(1).check || game.checkWin(2).check;

        // Checks that clicked item contains 'cell' in class list
        if (
            selectedTarget.classList.contains('cell') &&
            !selectedTarget.textContent &&
            !winCheck
        ) {
            // Get the row and columun data
            const { row, column } = selectedTarget.dataset;

            // Mark spot using coordinate and active player
            game.playRound(row, column);

            // Check if active player has just won
            const playerWinCheck = game.checkWin();

            if (playerWinCheck.check) {
                updateScreen();

                // Console log the player object who won
                console.log(playerWinCheck);

                // Display winner message
                const winner = game.getPlayer();
                console.log(`${winner.name} (${winner.symbol}) Won!`);

                // Draw the line for the winning row
                addLine(playerWinCheck);
            }

            // If player did not win, switch active player
            else if (!winCheck) {
                game.switchActivePlayer();
                updateScreen();
            }
        }
    }

    gameBoardDiv.addEventListener('click', clickHandlerBoard);
    buttonDiv.addEventListener('click', clickHandlerButton);

    // Initial Render
    updateScreen();

    return { updateScreen };
})();
