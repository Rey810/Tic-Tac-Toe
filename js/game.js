// elements to be manipulated
const playerInfoContainer = document.querySelector('.player-info-container');
const playerInfo = document.querySelector('.player-info');
const player1Form = document.querySelector('.player1-form');
const player2Form = document.querySelector('.player2-form');
const nextButton = document.querySelector('.add-player');
const startGameButton = document.querySelector('.start-game');
const gameContainer = document.querySelector('.game-container');
const gameBoard = document.querySelector('.game-board');
const positions = document.querySelectorAll('.piece-position');
const gameInfo = document.querySelector('.current-game-info');
const reset = document.querySelector('.reset');

// create players and store chosen moves
const playerFactory = name => {
    let completedMoveIndices = [];
    console.log('inside playerFactory');
    return { name, completedMoveIndices };
};

//displayController module
//using an IIFE prevents it from being called again accidentally
//used to indicate and implement data privacy
const displayController = (() => {
    //array that stores game status
    let gameArray = ['', '', '', '', '', '', '', '', ''];
    const gameBoardDisplay = () => {
        // sets the initial innerHTML for each position
        [...positions].forEach(position => {
            position.innerHTML = '';
            position.innerHTML = gameArray[position.dataset.index];
        });
    };

    //shows the form for the first player
    const turnOnPlayerInfoDisplay = () => {
        gameContainer.style.display = 'none';
        playerInfoContainer.style.display = 'flex';
        player1Form.style.display = 'flex';
    };

    //shows the form for the second player
    const turnOnPlayer2Form = () => {
        player1Form.style.animation = 'slideOut .3s ease-in forwards';
        setTimeout(() => {
            player2Form.style.display = 'flex';
            player2Form.style.animation = 'slideIn .3s ease-out';
        }, 300);
    };

    //shows the game board
    const turnOnGameDisplay = () => {
        player2Form.style.animation = 'slideOut .3s ease-in forwards';
        setTimeout(() => {
            playerInfoContainer.style.display = 'none';
            gameContainer.style.display = 'flex';
            gameContainer.style.animation = 'slideIn .3s ease-out';
        }, 300);
    };

    // This is called when the game is over
    const gameOverStatus = innerHTML => {
        gameInfo.innerHTML = innerHTML;
        gameBoard.style.pointerEvents = 'none';
        reset.style.display = 'block';
        reset.addEventListener('click', gameLogic.resetGame);
    };

    return {
        gameArray,
        turnOnGameDisplay,
        turnOnPlayer2Form,
        turnOnPlayerInfoDisplay,
        gameOverStatus,
    };
})();

//gameLogic
const gameLogic = (() => {
    //players will be stored here
    let playerArray = [];
    // the current player object will be stored here
    let currentPlayer = '';
    //current game board
    gameArray = displayController.gameArray;
    //the icon which will populate the clicked position
    let currentIcon = 'X';

    const gameStart = () => {
        const player1Name = document.querySelector('.player1-name').value;
        const player2Name = document.querySelector('.player2-name').value;
        let player1 = playerFactory(`${player1Name}`);
        let player2 = playerFactory(`${player2Name}`);
        playerArray.push(player1, player2);
        currentPlayer = playerArray[0];
        playerInfo.innerHTML = currentPlayer.name;
    };

    // called, within makeMove, after a move has been made
    const switchPlayer = () => {
        if (currentIcon == 'X') {
            currentIcon = 'O';
            // switch the current player to the other player
            currentPlayer = playerArray[1];
            playerInfo.innerHTML = currentPlayer.name;
        } else {
            currentIcon = 'X';
            // switch the current player to the other player
            currentPlayer = playerArray[0];
            playerInfo.innerHTML = currentPlayer.name;
        }
    };

    // called every time a position is clicked on
    const makeMove = (positionIndex, position) => {
        //if the position is empty, put the move in place
        if (gameArray[positionIndex] == '') {
            gameArray[positionIndex] = currentIcon;
            currentPlayer.completedMoveIndices.push(parseInt(positionIndex));

            // set clicked position display to the currentIcon
            position.style.color = 'white';
            position.innerHTML = currentIcon;
            gameStatusCheck(gameArray, currentIcon);
            switchPlayer();
        }
    };

    // this is called after each move
    const gameStatusCheck = (gameArray, currentIcon) => {
        // positions needed to win
        const winningArray = [
            //horizontal
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            //vertical
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            //diagonal
            [0, 4, 8],
            [2, 4, 6],
        ];

        // this array will be compared to an array of winning arrays
        // to check if it has any winning combinations
        let playerArray = currentPlayer.completedMoveIndices;

        //read function name :)
        const iFilterForAWinner = array => {
            //for each number in array, check if it's included in the playerArray
            if (
                playerArray.includes(array[0]) &&
                playerArray.includes(array[1]) &&
                playerArray.includes(array[2])
            ) {
                return true;
            }
        };

        //this will be the resulting array after checking if the player array includes a winning array. This is then checked for length.
        let thereIsAWinnerArray = winningArray.filter(iFilterForAWinner);

        //If it has a length then the player has a winning set of numbers.
        if (thereIsAWinnerArray.length >= 1) {
            displayController.gameOverStatus(
                `${currentPlayer.name} is the winner!`
            );
        }

        // if gameArray is full, return a draw
        if (gameArray.every(position => position != '')) {
            displayController.gameOverStatus("It's a draw!");
        }
    };

    //add listeners at each position
    const positionListeners = [...positions].forEach(position => {
        position.addEventListener(
            'click',
            makeMove.bind(null, position.dataset.index, position)
        );
    });

    // called when reset button is clicked. Listener sits in the displayController
    const resetGame = () => {
        location.reload();
        return true;
    };
    return { gameStart, gameArray, playerArray, currentPlayer, resetGame };
})();

nextButton.addEventListener('click', displayController.turnOnPlayer2Form);
startGameButton.addEventListener('click', displayController.turnOnGameDisplay);
startGameButton.addEventListener('click', gameLogic.gameStart);

particlesJS.load('particles-js', '../particles.json', function() {
    console.log('particles.js loaded - callback');
});
