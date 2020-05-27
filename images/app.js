const DIFFICULTY = { "EASY" : 2, "MEDIUM" : 3, "HARD": 4 };
const SQUARES_PER_ROW = 4;
const TRANSITION_TIME = 500;
const gameField = document.querySelector('#gameField');
let selectedSquares = [];
let canSelect = true;
let counter = 0;
squaresLeft = 0;


document.addEventListener('click', function(event){
    let target = event.target
    console.log(target);
    if (target.id === "levelButton") {
        createGameSquares(DIFFICULTY[event.target.dataset.difficulty]);
    } else if (target.classList.contains('cardImage')) {
        // target.classList.toggle("selected");
        
        // if (selectedSquares.includes(target)) {
        //     console.log("TRUE")
        // }
        // selectedSquares.push(target);
        handleSquareSelection(target);
    }
    
});

function createGameSquares(rows) {
    gameField.innerHTML = "";
    for(let i = 0; i < rows; i++) {
        let newRow = document.createElement('div');
        newRow.classList.add("squareRow");
        for(let j = 0; j < SQUARES_PER_ROW; j++) {
            let square = document.createElement('div');
            let card = document.createElement('div');
            let cardBack = document.createElement('div');
            let cardFront = document.createElement('div');
            card.classList.add('card');
            cardBack.classList.add('cardFace');
            cardFront.classList.add('cardFace')
            cardFront.classList.add('cardFaceFront');
            let backImage = document.createElement('img');
            backImage.classList.add('cardImage');
            let frontImage = document.createElement('img');
            frontImage.classList.add("cardImage");
            backImage.setAttribute("src", "images/backImage.jpg");
            frontImage.setAttribute("src", "images/5.jpg");
            cardBack.append(backImage);
            cardFront.append(frontImage);
            card.append(cardBack);
            card.append(cardFront);
            square.append(card);
            square.classList.add('square');
            square.dataset.index = i;
            console.log(square);
            newRow.append(square);
            squaresLeft++;
        }
        gameField.append(newRow);
    }
}

function handleSquareSelection(square) {
    if (!square.classList.contains('selected')) {
        if (canSelect) {
            square.parentElement.parentElement.classList.toggle('flipped');
            square.classList.toggle('selected');
            selectedSquares.push(square);
            counter++;
            console.log(counter);
        }
    }
    checkGameState();
}

function checkGameState() {
    if (selectedSquares.length === 2) {
        console.log(selectedSquares[0])
        console.log(selectedSquares[1])
        canSelect = false;
        if (selectedSquares[0].dataset.index !== selectedSquares[1].dataset.index) {
            
            setTimeout(function() {
                for (let square of selectedSquares) {
                    square.classList.toggle('selected');
                }
                selectedSquares = [];
                setTimeout(function() {
                    canSelect = true;
                }, TRANSITION_TIME);
                
            }, 2000);
        
        } else {
            canSelect = true;
            selectedSquares = [];
            squaresLeft -= 2;
            checkForAllMatched();
        }
        
    } 
    
}

function checkForAllMatched() {
    if (squaresLeft === 0) {
        alert("GAME OVER");
    }
}