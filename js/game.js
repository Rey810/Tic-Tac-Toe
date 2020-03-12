//store gameboard as an array inside a Gameboard object
//store players in objects
//tuck everyhting inside a module or factory:
//1 thing, use a module (gameBoard, displayController)
//2 or more things: use a factory
const positions = document.querySelectorAll('.piece-position');
const gameInfo = document.querySelector('.current-game-info');
const playerInfo = document.querySelector('.player-info');

//gameBoard
//a module: wrap the factory in an IIFE
//using an IIFE prevents it from being called again accidentally
//used to indicate and implement data privacy
const gameBoard = (() => {
    //array that stores game status
    let gameArray = ['', 'O', '', '', 'O', 'O', 'O', '', ''];

    const display = () => {
        // sets the innerHTML for each position
        [...positions].forEach(position => {
            position.innerHTML = gameArray[position.dataset.index];
        });
    };

    return { display, gameArray };
})();

//gameLogic
const gameLogic = (() => {
    //current game board
    let gameArray = gameBoard.gameArray;

    // current player's icon
    let currentIcon = 'X';

    const switchPlayer = () => {
        if (currentIcon == 'X') {
            currentIcon = 'O';
            playerInfo.innerHTML = 'Player 2';
        } else {
            currentIcon = 'X';
            playerInfo.innerHTML = 'Player 1';
        }
    };

    const makeMove = (positionIndex, position) => {
        //if the position is empty, put the move in place
        if (gameArray[positionIndex] == '') {
            console.log(`you clicked index ${positionIndex} on the array`);
            console.log(positionIndex);
            console.log(position);
            gameArray[positionIndex] = currentIcon;
            // set clicked position innerHTML to currentIcon
            position.innerHTML = currentIcon;
            switchPlayer();
        }
    };

    //add listeners at each position
    const positionListeners = [...positions].forEach(position => {
        position.addEventListener(
            'click',
            makeMove.bind(null, position.dataset.index, position)
        );
    });

    return {};
})();

//player
//a factory

//displayController
//a module: wrap the factory in an IIFE
gameBoard.display();
