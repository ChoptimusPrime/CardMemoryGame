//Jon Compton
//Springboard May 26 Cohort

const CARDS_PER_ROW = 4;
const DIFFICULTY_ROWS = { "EASY" : 2, "MODERATE" : 3, "HARD" : 4 };
const GAME_FIELD = document.querySelector("#gameField");
const CURRENT_SCORE_SPAN = document.querySelector("#currentScoreSpan");
const TOP_SCORE_SPAN = document.querySelector("#topScoreSpan");
const SOUNDS = { swoosh : new Audio("sounds/swoosh.mp3"),
                 spalt  : new Audio("sounds/splat.mp3"),
                 theme  : new Audio("sounds/Get_Off.wav"),
                 tada   : new Audio("sounds/ta-da.mp3") 
                };
let gameState = { currentScore  : 0,
                  cardsLeft     : 0,
                  canSelect     : true,
                  difficulty    : "EASY",
                  soundOn       : true,
                  selectedCards : [] 
                };

document.addEventListener("click", function(event){
    let element = event.target;
    if (element.classList.contains("difficultyButton")) {
        gameState.difficulty = element.innerText;
        startGame();
    } else if (element.classList.contains("cardCover")) {
        if (gameState.canSelect) {
            handleCardClick(element);
        }
    } else if (element.id === "soundButton") {
        handleSoundButtonClick(element);
    }
});

function handleSoundButtonClick(button) {
    if (gameState.soundOn) {
        SOUNDS.theme.pause();
        button.innerText  = "MUSIC ON";
        gameState.soundOn = false;
    } else {
        SOUNDS.theme.play();
        button.innerText = "MUSIC OFF";
        gameState.soundOn = true;
    }
}

function clearGameData() {
    gameState.currentScore = 0;
    gameState.cardsLeft = 0;
    gameState.canSelect = true;
    gameState.selectedCards = [];
    CURRENT_SCORE_SPAN.innerText = 0;
    GAME_FIELD.innerHTML = "";
}

function startGame() {
    startGameTheme();
    clearGameData();
    checkLocalStorage();
    generateCardRows();
}

function generateCardRows() {
    let numberOfRows = DIFFICULTY_ROWS[gameState.difficulty];
    let cardNumberArray = generateCardNumbers(numberOfRows * CARDS_PER_ROW);
    for (let i = 0; i < numberOfRows; i++) {
        let newRow = newDiv();
        newRow.classList.add("row");
        for (let i = 0; i < CARDS_PER_ROW; i++) {
            newRow.append(getCard(cardNumberArray.pop()));
            gameState.cardsLeft++;
        }
        GAME_FIELD.append(newRow);
    }

}

function getCard(imgNumber) {
    let newCard = newDiv();
    newCard.classList.add("cardContainer");
    let cardSurface = newDiv();
    cardSurface.classList.add("card");
    cardSurface.append(getCardFace("images/backImage.jpg"));
    let cardFront = getCardFace(`images/${ imgNumber }.jpg`);
    cardFront.classList.add("cardFaceFront");
    cardSurface.append(cardFront);
    newCard.append(cardSurface);
    let cardCover = newDiv();
    cardCover.classList.add("cardCover");
    cardCover.dataset.image = `images/${ imgNumber }.jpg`;
    newCard.append(cardCover);
    return newCard;
}

function getCardFace(img) {
    let cardFace = newDiv();
    let cardImage = document.createElement("img");
    cardImage.setAttribute("src", img);
    cardImage.classList.add("faceImage");
    cardFace.append(cardImage);
    cardFace.classList.add("cardFace");
    return cardFace;
}

function generateCardNumbers(numberOfCards) {
    let numberOfPairs = numberOfCards / 2;
    let arrayOfPairs = [];
    for (let i = 1; i <= numberOfPairs; i++) {
        arrayOfPairs.push(i);
        arrayOfPairs.push(i);
    }
    return shuffle(arrayOfPairs);

}

function handleCardClick(card) {
    if (card.dataset.selected !== "true") {
        SOUNDS.swoosh.currentTime = 0;
        SOUNDS.swoosh.play();
        incrementScore();
        flipCard(card);
        card.dataset.selected = "true";
        gameState.selectedCards.push(card);
        if (gameState.selectedCards.length === 2) {
            gameState.canSelect = false;
            checkSelectionsForMatch();
        }
    }
}

function flipCard(card) {
    card.previousElementSibling.classList.toggle("selected");
}

function checkSelectionsForMatch() {
    let firstSelection = gameState.selectedCards[0];
    let secondSelection = gameState.selectedCards[1];
    if (firstSelection.dataset.image === secondSelection.dataset.image) {
        SOUNDS.tada.currentTime = 0;
        SOUNDS.tada.play();
        gameState.canSelect = true;
        gameState.cardsLeft -= 2;
        if (gameState.cardsLeft === 0) {
            gameOver();
        }
        gameState.selectedCards = [];
    } else {
        SOUNDS.spalt.play();
        setTimeout(function() {
            for (let card of gameState.selectedCards) {
                card.dataset.selected = "false";
                flipCard(card);
                gameState.selectedCards = [];
            }
            SOUNDS.swoosh.currentTime = 0;
            SOUNDS.swoosh.play();
            setTimeout(function() {
                gameState.canSelect = true;
            }, 500);
        }, 2000);
    }
    
}

function incrementScore() {
    gameState.currentScore++;
    CURRENT_SCORE_SPAN.innerText = `${gameState.currentScore}`;
}

function newDiv() {
    return document.createElement('div');
}

function startGameTheme() {
    let themeSong = SOUNDS.theme;
    themeSong.loop = true;
    themeSong.currentTime = 0;
    if (gameState.soundOn) {
        SOUNDS.theme.play();
    }
}


function shuffle(imageNumberArray) {
    let counter = imageNumberArray.length;

    // While there are elements in the imageNumberArray
    while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = imageNumberArray[counter];
    imageNumberArray[counter] = imageNumberArray[index];
    imageNumberArray[index] = temp;
    }
    return imageNumberArray;
}

function gameOver() {
    if (gameState.soundOn) {
        SOUNDS.theme.pause();
    }
    checkLocalStorage();
    alert("Game Over");  
}

function checkLocalStorage() {
    let previousScore = JSON.parse(localStorage.getItem(gameState.difficulty));
    if (gameState.currentScore === 0) {
        if (previousScore) {
            TOP_SCORE_SPAN.innerText = previousScore;
        } else {
            TOP_SCORE_SPAN.innerText = "N/A";
        }
    } else {
        if (previousScore) {
            if (gameState.currentScore < parseInt(previousScore)) {
                localStorage.setItem(gameState.difficulty, JSON.stringify(gameState.currentScore));
            }
        } else {
            localStorage.setItem(gameState.difficulty, JSON.stringify(gameState.currentScore));
        }
        
        
    }
}