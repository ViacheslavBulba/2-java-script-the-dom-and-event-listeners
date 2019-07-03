/*jshint esversion: 6 */

/*JavaScript code for memory game with cards
The following logic is implemented:
* Turn over any two cards.
* If the two cards match, they stay open.
* If they don't match, cards close.
* Remember what was on each card and where it was.
* Watch and remember during each move.
* The game is over when all the cards have been matched.
* The game displays a star rating (initial rating is 10 stars) that reflects the player's performance. After each 2 incorrect moves, player loses a star of rating.*/

// Whole-script strict mode syntax
"use strict";
let timerValueInSeconds = 0;
let timerHolder;
let rating;
let clicks = 0;
let moves = 0;
let cardVariationsToPlay = [
    'fa-diamond',
    'fa-paper-plane-o',
    'fa-anchor',
    'fa-bolt',
    'fa-cube',
    'fa-leaf',
    'fa-bicycle',
    'fa-bomb'
];
const modal = document.querySelector(".winner");
const closeModal = document.querySelector(".close");
let ratingLiteral = '<li><i class="fa fa-star"></i></li>';
const starsRatingToDisplay = document.querySelector('.stars');
const timerCounter = document.querySelector('.timerValue');
let openCards = [];
const moveCounter = document.querySelector('.moves');
const restartIcon = document.querySelector('.restart');
let incorrectMovesCount = 0;

restartIcon.addEventListener('click', function () {
    initGame();
    clearInterval(timerHolder);
});

function generateOneCardHTML(card) {
    return `<li class="card" data-card="${card}"><i class="fa ${card}"></i></li>`;
}

function generateRatingHTML(currentRating) {
    let stars = '';
    for (let i = 0; i < currentRating; i++) {
        stars += ratingLiteral;
    }
    return stars;
}

function reduceRating() {
    rating--;
    if (rating < 1) {
        rating = 1;
    }
    starsRatingToDisplay.innerHTML = generateRatingHTML(rating);
}

function increaseMove() {
    moves++;
    moveCounter.innerText = moves;
}

function shuffle(array) {// Shuffle function from http://stackoverflow.com/a/2450976
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function createCards() {
    const deck = document.querySelector('.deck');
    deck.innerHTML = "";
    let cardHTML = shuffle(cardVariationsToPlay.concat(cardVariationsToPlay)).map(function (card) {
        return generateOneCardHTML(card);
    });
    deck.innerHTML = cardHTML.join('');
}

function compareCards(cards) {//check if two cards match
    if (cards[0].dataset.card == cards[1].dataset.card) {
        cards.forEach(function (card) {
            card.classList.add('match');
        });
    } else {//if there are two mistakes in a row - reduce rating
        incorrectMovesCount++;
        if (incorrectMovesCount%2 == 0){
            reduceRating();
        }
    }
    setTimeout(function () {//if cards don't match - close them
        cards.forEach(function (card) {
            card.classList.remove('open', 'show');
        });
        openCards = [];
    }, 300);
}

function setRating(ratingToSet) {//method to set up and display initial rating in stars
    rating = ratingToSet;
    starsRatingToDisplay.innerHTML = generateRatingHTML(rating);
}

function setMoves(movesToSet) {
    moves = movesToSet;
    moveCounter.innerText = moves;
}

function openCard(card) {
    card.classList.add('open', 'show');
}

function startTimer() {
    timerValueInSeconds = 0;
    timerHolder = setInterval(timer, 1000);
}

function initGame() {//main method, set up initial values and control clicks
    createCards();
    setRating(10);
    setMoves(0);
    timerCounter.innerText = 0;
    clicks = 0;
    incorrectMovesCount = 0;
    openCards = [];
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(function (card) {
        card.addEventListener('click', function () {
            if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match') && (openCards.length < 2)) {
                openCards.push(card);
                openCard(card);
                if (openCards.length == 2) {
                    increaseMove();
                    compareCards(openCards);
                }
                clicks++;
                if (clicks == 1) {
                    startTimer();
                }
            }
            if (getNumberOfMatches() == 16) {
                //stop game, player won, show win popup
                clearInterval(timerHolder);
                showModal();
            }
        });
    });
}

initGame();

function timer() {
    timerValueInSeconds++;
    timerCounter.innerText = timerValueInSeconds;
}

function getNumberOfMatches() {
    return document.querySelectorAll('.match').length;
}

closeModal.onclick = function () {// When the user clicks on <span> (x), close the modal
    modal.style.display = "none";
};

window.onclick = function (event) {// When the user clicks anywhere outside of the modal, hide it
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

function showModal() {//method for display player won popup on the page
    let winText = `Congratulations! Your game took ${timerValueInSeconds} seconds and ${moves} moves with final rating of ${rating} stars.`;
    const textInsideModal = document.querySelector('.win-message');
    textInsideModal.innerText = winText;
    modal.style.display = "block";
}

const playAgain = document.querySelector('.play-again-button');

playAgain.onclick = function() {//hide popup and start new game
    modal.style.display = "none";
    initGame();
    clearInterval(timerHolder);
};