//store gameboard as an array inside a Gameboard object
//store players in objects
//tuck everyhting inside a module or factory:
//1 thing, use a module (gameBoard, displayController)
//2 or more things: use a factory
const positions = document.querySelectorAll('.piece-position');

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

    let currentPlayer = 'X';

    const switchPlayer = () => {
        currentPlayer == 'X' ? (currentPlayer = 'O') : (currentPlayer = 'X');
    };

    const makeMove = position => {
        //if the position is empty, put the move in place
        if (gameArray[position] == '') {
            console.log(`you clicked index ${position} on the array`);
            gameArray[position] = currentPlayer;
            switchPlayer();
        }
        gameBoard.display();
    };

    //add listeners at each position
    const positionListeners = [...positions].forEach(position => {
        position.addEventListener(
            'click',
            makeMove.bind(null, position.dataset.index)
        );
    });

    return {};
})();

function gameLogic2() {
    function printFunction() {
        console.log('this function is accessible from anywhere');
    }
}

//player
//a factory

//displayController
//a module: wrap the factory in an IIFE
gameBoard.display();
