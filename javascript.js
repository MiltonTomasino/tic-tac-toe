let gameBoard = (() => {
    let board = [
        "", "", "",
        "", "", "",
        "", "", ""
    ]

    const render = () => {
        let boardHTML = "";
        board.forEach((value, index) => {
            boardHTML += `<div class="square" id="square-${index}">${value}</div>`;
        })
        document.querySelector(".container").innerHTML = boardHTML;

        let squares = document.querySelectorAll(".square");
        squares.forEach((square) => {square.addEventListener("click", Game.hangleClick)});
    }

    const update = (index, value) => {
        board[index] = value;
        render();
    }

    const getBoard = () => {
        return board;
    }


    return {
        render,
        update,
        getBoard,
    }
})();

const createPlayer =(name, mark) => {
    return {name, mark}
}

function checkGameBoard(board) {
    let gameStates = [
        [0, 1, 2],
        [0, 3, 6],
        [0, 4, 8],
        [1, 4, 7],
        [2, 5, 8],
        [2, 4, 6],
        [3, 4, 5],
        [6, 7, 8],
    ]

    for (let i = 0; i < gameStates.length; i++) {
        let [a, b, c] = gameStates[i];
        if (board[a] && board[a] == board[b] && board[a] == board[c]) {
            return true;
        }
    }

    return false;
}

function checkDraw(board) {
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            return false;
        }
    }
    return true;
}

const Game = (() => {
    let players = []
    let currPlayer;
    let gameOver;

    const start = (player1 = "player 1", player2 = "player 2") => {
        players = [];
        console.log(`player1: ${player1}, player2: ${player2}`);
        
        players.push(createPlayer(player1, "X"));
        players.push(createPlayer(player2, "O"));

        currPlayer = 0;
        gameOver = false;
        gameBoard.render();
    }

    const hangleClick = (e) => {
        let index = parseInt(e.target.id.split("-")[1]);
        if (gameBoard.getBoard()[index] !== "") {
            return
        }

        if (gameOver) {
            return;
        }

        gameBoard.update(index, players[currPlayer].mark)

        if (checkGameBoard(gameBoard.getBoard())) {
            console.log(`Game Over`);
            externalUI.displayWinner(players[currPlayer]);
            gameOver = true;
            
        } else if (checkDraw(gameBoard.getBoard())) {
            console.log("Draw");
            gameOver = true;   
        }
        currPlayer = currPlayer === 0 ? 1 : 0;
    }

    const reset = () => {
        for (let i = 0; i < gameBoard.getBoard().length; i++) {
            gameBoard.update(i, "");
        }
        gameOver = false;
        currPlayer = 0;
        gameBoard.render();
        externalUI.clearUI();
    }

    return {
        start,
        hangleClick,
        reset,
    }
})();

const externalUI = (() => {

    let message = document.querySelector(".message");
    let render = document.querySelector(".render");
    let player1 = document.querySelector("#player1");
    let player2 = document.querySelector("#player2");

    render.addEventListener("click", () => {

        let name1 = player1.value.trim();
        let name2 = player2.value.trim();
        
        name1 = name1 === "" ? undefined : name1;
        name2 = name2 === "" ? undefined : name2;

        Game.start(name1, name2);
    })

    let reset = document.querySelector(".reset");

    reset.addEventListener("click", Game.reset);

    const displayWinner = (player) => {

        message.textContent = `${player.name} Wins!`;
        message.showModal();
    }

    const clearUI = () => {
        message.textContent = "";
        player1.value = "";
        player2.value = "";
    }

    message.addEventListener("click", (e) => {
        const rect = message.getBoundingClientRect();
        const clickedOutside =
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom;
    
        if (clickedOutside) {
            message.close();
        }
    });

    return {
        displayWinner,
        clearUI,
    }
})();

externalUI;