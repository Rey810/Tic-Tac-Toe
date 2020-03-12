//store displayController as an array inside a displayController object
//store players in objects
//tuck everyhting inside a module or factory:
//1 thing, use a module (displayController, displayController)
//2 or more things: use a factory
const gameContainer         =   document.querySelector('.game-container');
const positions             =   document.querySelectorAll('.piece-position');
const gameInfo              =   document.querySelector('.current-game-info');
const playerInfo            =   document.querySelector('.player-info');
const reset                 =   document.querySelector('.reset');
const playerInfoContainer   =   document.querySelector('.player-info-container');
const player1Form           =   document.querySelector('.player1-form');
const player2Form           =   document.querySelector('.player2-form');
const nextButton            =   document.querySelector('.add-player');
const startGameButton       =   document.querySelector('.start-game');

//player creation goes here with form listeners to create named players
//player
//a factory
const playerFactory = name => {
    let completedMoveIndices = [];
    console.log('inside playerFactory');
    return { name, completedMoveIndices };
};

//displayController
//a module: wrap the factory in an IIFE
//using an IIFE prevents it from being called again accidentally
//used to indicate and implement data privacy
const displayController = (() => {
    //array that stores game status
    let gameArray = ['', '', '', '', '', '', '', '', ''];
    console.log('inside displayController');
    const gameBoardDisplay = () => {
        // sets the innerHTML for each position
        [...positions].forEach(position => {
            position.innerHTML = '';
            position.innerHTML = gameArray[position.dataset.index];
        });
    };

    const turnOnPlayerInfoDisplay = () => {
        gameContainer.style.display = 'none';
        playerInfoContainer.style.display = 'flex';
        player1Form.style.display = 'block';
        nextButton.style.display = 'block';
    };

    const turnOnGameDisplay = () => {
        playerInfoContainer.style.display = 'none';
        player2Form.style.display = 'none';
        startGameButton.style.display = 'none';
        gameContainer.style.display = 'grid';
    };

    const turnOnPlayer2Form = () => {
        player1Form.style.display = 'none';
        nextButton.style.display = 'none';
        player2Form.style.display = 'block';
        startGameButton.style.display = 'block';
    };
    
    return { gameBoardDisplay, gameArray, turnOnGameDisplay, turnOnPlayer2Form, turnOnPlayerInfoDisplay };
})();

//gameLogic
const gameLogic = (() => {

    console.log('inside gameLogic');
    let playerArray = [];
    let currentPlayer = '';
    //current game board
    gameArray = displayController.gameArray;
    console.log(`game logic game array ${gameArray}`);
    let currentIcon = 'X';
    
    const gameStart = () => {
        const player1Name = document.querySelector('.player1-name').value;
        const player2Name = document.querySelector('.player2-name').value;
        console.log("Inside gameLogic.gameStart");
        let player1 = playerFactory(`${player1Name}`);
        let player2 = playerFactory(`${player2Name}`);
        console.log(player1);
        console.log(player2);
        playerArray.push(player1, player2);
        console.log(`playerArray: ${playerArray}`);
        currentPlayer = playerArray[0];
        console.log(`This is the current player within gameStart ${currentPlayer.name}`);
        //hide forms and show game board
        playerInfo.innerHTML = currentPlayer.name;
        //create a player with entered name
        //players enter names here and a clear board is brought into
        // this will be run after each reset button click
        return `the returned current player ${currentPlayer.name}`;
    };

    // players contained in this array

    //const asterix = playerFactory('Asterix');
    //const obelix = playerFactory('Obelix');
    //playerArray.push(asterix, obelix);


    // current player's icon and current player object

    const switchPlayer = () => {
        console.log('inside gameLogic.switchPlayer');
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

    const makeMove = (positionIndex, position) => {
        //if the position is empty, put the move in place
        if (gameArray[positionIndex] == '') {
            console.log(`you clicked index ${positionIndex} on the array`);
            console.log(positionIndex);
            console.log(position);
            gameArray[positionIndex] = currentIcon;
            console.log(currentPlayer);
            currentPlayer.completedMoveIndices.push(parseInt(positionIndex));

            // set clicked position innerHTML to currentIcon
            position.innerHTML = currentIcon;
            gameStatusCheck(gameArray, currentIcon);
            switchPlayer();
        }
    };

    const gameStatusCheck = (gameArray, currentIcon) => {
        const winningArray = [
            //horizontal
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            //vertical
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            //diagonal
            [0, 4, 8], [2, 4, 6]
        ];

        //this will be the resulting array after checking if the player array includes a winning array
        let playerArray = currentPlayer.completedMoveIndices;
        

        const iFilterForAWinner = array => {
	    //for each number in array, check if it's included in the playerArray
         if ((playerArray.includes(array[0]))   &&    
            (playerArray.includes(array[1]))    && 
            playerArray.includes(array[2])){
                return true;
            }
        };

        //this is then checked for length. 
        //If it has a length then the player has a winning set of numberrs.
        let thereIsAWinnerArray = winningArray.filter(iFilterForAWinner);

        const gameOverStatus = innerHTML => {
            gameInfo.innerHTML = innerHTML;
            reset.style.display = 'block';
            reset.addEventListener('click', resetGame);
        }

        if (thereIsAWinnerArray.length >= 1){
            gameOverStatus(`${currentPlayer.name} is the winner!`)
            console.log('There is a winner!');
        } else {
            console.log('no winner it seems...');
        }

        //maybe compare player's moves to a winning array
        // currentPlayer.completedMoveIndices;
        // if gameArray is full, return a draw
        if (gameArray.every(position => position != '')) {
            gameOverStatus("It's a draw!");
        }
    };

    //add listeners at each position
    const positionListeners = [...positions].forEach(position => {
        position.addEventListener(
            'click',
            makeMove.bind(null, position.dataset.index, position)
        );
    });

    const resetGame = () => {
        // displayController.turnOnPlayerInfoDisplay();
        // displayController.gameArray = ['', '', '', '', '', '', '', '', ''];
        // displayController.gameBoardDisplay();
        // playerArray = [];
        // currentPlayer = '';
        // currentIcon = 'X';
        location.reload();
        return true;
    };

    return { gameStart, gameArray, playerArray, currentPlayer };
})();

startGameButton.addEventListener('click', gameLogic.gameStart);
nextButton.addEventListener('click', displayController.turnOnPlayer2Form);
startGameButton.addEventListener('click', displayController.turnOnGameDisplay);
