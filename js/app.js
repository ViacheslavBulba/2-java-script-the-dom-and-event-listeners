// Whole-script strict mode syntax
"use strict";
let timerValueInSeconds = 0;
let timerHolder;
let rating;
let clicks = 0;
let moves = 0;
let cards = [
    'fa-diamond', 'fa-diamond',
    'fa-paper-plane-o', 'fa-paper-plane-o',
    'fa-anchor', 'fa-anchor',
    'fa-bolt', 'fa-bolt',
    'fa-cube', 'fa-cube',
    'fa-leaf', 'fa-leaf',
    'fa-bicycle', 'fa-bicycle',
    'fa-bomb', 'fa-bomb',
];
let modal = document.getElementById("myModal");
let closeModal = document.getElementsByClassName("close")[0];
let ratingLiteral = '<li><i class="fa fa-star"></i></li>';
let starsRatingToDisplay = document.querySelector('.stars');
let timerCounter = document.querySelector('.timerValue');
let openCards = [];
let moveCounter = document.querySelector('.moves');
let restartIcon = document.querySelector('.restart');
let incorrectMovesCount = 0;

restartIcon.addEventListener('click', function () {
    initGame();
    clearInterval(timerHolder);
});

function generateCard(card) {
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
    let deck = document.querySelector('.deck');
    deck.innerHTML = "";
    let cardHTML = shuffle(cards).map(function (card) {
        return generateCard(card);
    });
    deck.innerHTML = cardHTML.join('');
}

function compareCards(cards) {
    if (cards[0].dataset.card == cards[1].dataset.card) {//check if cards match
        cards.forEach(function (card) {
            card.classList.add('match');
        })
    } else {//if there are two mistakes in a row - reduce rating
        incorrectMovesCount++;
        if (incorrectMovesCount%2 == 0){
            reduceRating();
        }
    }
    setTimeout(function () {//if cards don't match - close them
        cards.forEach(function (card) {
            card.classList.remove('open', 'show');
        })
        openCards = [];
    }, 300);
}

function setRating(ratingToSet) {
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

function initGame() {
    createCards();
    setRating(10);
    setMoves(0);
    timerCounter.innerText = 0;
    clicks = 0;
    incorrectMovesCount = 0;
    openCards = [];
    let allCards = document.querySelectorAll('.card');
    allCards.forEach(function (card) {
        card.addEventListener('click', function () {
            if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match') && (openCards.length < 2)) {
                openCards.push(card);
                openCard(card);
                if (openCards.length == 2) {
                    increaseMove();
                    compareCards(openCards)
                }
                clicks++;
                if (clicks == 1) {
                    startTimer();
                }
            }
            if (getNumberOfMatches() == 16) {
                //stop game
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
}

window.onclick = function (event) {// When the user clicks anywhere outside of the modal, hide it
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function showModal() {
    let winText = `Congratulations! Your game took ${timerValueInSeconds} seconds and ${moves} moves with final rating of ${rating} stars.`;
    let textInsideModal = document.querySelector('.win-message');
    textInsideModal.innerText = winText;
    modal.style.display = "block";
}

let btn = document.getElementById("playAgainBtn");

btn.onclick = function() {
    modal.style.display = "none";
    initGame();
    clearInterval(timerHolder);
}