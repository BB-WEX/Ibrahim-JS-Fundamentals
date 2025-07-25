// Scores and info
// Player
const total = document.getElementById("total");
const hand = document.getElementById("hand");
const score = document.getElementById("score");

var bet = document.getElementById("bet").value;
const betAtr = document.getElementById("bet");

const cardStore = document.getElementById("cards");

var timesDrawn = 0;
const playerXpos = -274;
// Buttons
const hitBtn = document.getElementById("hit");
const passBtn = document.getElementById("pass");
const choicePopup = document.getElementById("choice-popup");
const cardHolder = document.getElementById("card-holder");


// Outcomes
const bust = document.getElementById("bust");
const win = document.getElementById("win");


// Dealer
const dealerCardStore = document.getElementById("card-dealer");
const dealerHand = document.getElementById("hand-dealer");
const dealerTotal = document.getElementById("total-dealer");

var dealerTimesDrawn = 0;
const dealerXPos = -319;
// Store cards in array to reveal later
var dealerCards = [];
var firstTime = true;


var playerPassed = false;
var dealerPassed = false;

// Card pile

const cardSuit = ["clubs", "diamonds", "hearts", "spades"];

const cardsDefault = [
    1, 1, 1, 1,
    2, 2, 2, 2,
    3, 3, 3, 3,
    4, 4, 4, 4,
    5, 5, 5, 5,
    6, 6, 6, 6,
    7, 7, 7, 7,
    8, 8, 8, 8,
    9, 9, 9, 9,
    10, 10, 10, 10,
    10, 10, 10, 10,
    10, 10, 10, 10,
    10, 10, 10, 10
];
var cardsAvailable = cardsDefault;


function Lose() {
    if (score.innerText <= 0) {
        console.log("The House Wins");
        score.innerText = 200;
    }
}

// Offset the animation start the more cards there are
function offsetAnim(variable, counter, who) {
    const offsetX = who + counter * -212;
    document.documentElement.style.setProperty(variable, `${offsetX}px`);
}

function UpdateBet() {
    bet = document.getElementById("bet").value;
    betAtr.setAttribute("max", score.innerText);
}

function RemoveCard(cards, draw) {
    var index = cards.indexOf(draw);
    if (index > -1) {
        cards.splice(index, 1);
    }
}

function SummonCard(place, type, value, extension) {
    const newCard = document.createElement("div");
    const suit = cardSuit[Math.floor(Math.random() * cardSuit.length)];
    console.log(suit);
    place.appendChild(newCard);
    newCard.classList.add(type);
    newCard.classList.add(extension);
    newCard.style.backgroundImage = `url(CardsImages/fronts/${suit}_${value}.png)`;
    return newCard;
}

function ButtonState(isDisabled) {
    hitBtn.disabled = isDisabled;
    passBtn.disabled = isDisabled;
}


// For the ace, player can choose 1 or 11 and program will wait
function GetChoice() {
    return new Promise((resolve) => {
        const btn1 = document.getElementById('btn1');
        const btn11 = document.getElementById('btn11');
        const AcePick = (value) => {
            // Remove to avoid duplicate event listerns
            btn1.removeEventListener('click', () => AcePick(1));
            btn11.removeEventListener('click', () => AcePick(11));
            resolve(value);
        };
        btn1.addEventListener('click', () => AcePick(1));
        btn11.addEventListener('click', () => AcePick(11));
    });
}

async function HandleAcePick(cardValue) {
    choicePopup.classList.add("show");
    const newCard = SummonCard(cardHolder, "drawn-ace", cardValue);
    const value = await GetChoice();
    choicePopup.classList.remove("show");
    cardHolder.innerHTML = "";
    newCard.style.animation = "1.5s ease-in-out normal AcePlace";
    newCard.style.boxShadow = "none";
    cardStore.appendChild(newCard);
    offsetAnim("--cardstartX", timesDrawn, playerXpos);
    return value;
}


// Gets the value of card and a random suite and displays a visual 
function GetCard(value) {
    if (value == 1) {
        value = "ace";
        var chosenNum = HandleAcePick(value);
        return chosenNum;
    } else {
        SummonCard(cardStore, "drawn-card", value);
        offsetAnim("--cardstartX", timesDrawn, playerXpos);
    }
}


// Reveal dealer cards
function RevealDealerCards() {
    document.documentElement.style.setProperty("--hidden", "0deg");
    dealerHand.innerText = "Cards: ";
    dealerTotal.innerText = 0;
    dealerCards.forEach(elem => {
        dealerHand.innerText += "  |  " + elem;
        dealerTotal.innerText = Number(dealerTotal.innerText) + elem;
    });
}

async function Hit() {
    betAtr.disabled = true;

    // Draw card and take it away from card pile
    do {
        draw = Math.floor(Math.random() * cardsAvailable.length) + 1;
        if (cardsAvailable.includes(draw)) {
            RemoveCard(cardsAvailable, draw);
            break
        } else if (cardsAvailable.length == 0) {
            console.log("No Cards", cardsAvailable, cardsAvailable.length);
            break
        }
    } while (true);

    ButtonState(true);

    if (draw == 1) {
        draw = await GetCard(draw);
    } else { await GetCard(draw); }

    hand.innerText += " |  " + draw;
    total.innerText = Number(total.innerText) + draw;

    if (CheckBust() == false) { DealerDraw(); }
    timesDrawn++;
}


function Pass() {
    ButtonState(true);
    DealerDraw();
    playerPassed = true;
    RoundEnd(playerPassed, dealerPassed);
}


function DealerDraw() {
    // Check if total is 16 or higher
    if (dealerCards.reduce((sum, num) => sum + num, 0) >= 16) {
        dealerPassed = true;
        cardStore.addEventListener("animationend", () => {
            ButtonState(false);
        });
    } else {
        // Dealer draws first card is shown others are hidden
        // Draw card and take it away from card pile
        do {
            draw = Math.floor(Math.random() * 11) + 1;
            if (cardsAvailable.includes(draw)) {
                RemoveCard(cardsAvailable, draw);
                break
            } else if (cardsAvailable.length == 0) {
                console.log("No Cards");
                break
            }
        } while (true);
        dealerCards.push(draw);
        // Show the first card
        var cardType;
        if (firstTime == true) {
            dealerHand.innerText += "  |  " + draw;
            dealerTotal.innerText = Number(dealerTotal.innerText) + draw;
            firstTime = false;
        } else {
            cardType = "hidden";
            dealerHand.innerText += "  |  " + "?";
        }
        if (draw == 11 && dealerCards.reduce((sum, num) => sum + num, 0) > 10) { draw = 1; }
        if (draw == 1 || draw == 11) { draw = "ace"; }

        offsetAnim("--dealer-cardstartX", dealerTimesDrawn, dealerXPos);
        setTimeout(() => {
            SummonCard(dealerCardStore, "card-dealer-card", draw, cardType);
        }, 1000)
        dealerCardStore.addEventListener("animationend", () => {
            ButtonState(false);
        });
        dealerTimesDrawn++;
    }
    // Check if dealer went bust
    if (dealerCards.reduce((sum, num) => sum + num, 0) > 21) {
        RevealDealerCards();
        win.innerText += " +" + bet;
        win.style.display = "block";
        score.innerText = Number(score.innerText) + Number(bet);
        ButtonState(true);
        setTimeout(Reset, 4000);
    }
}


function RoundEnd(plyr, dlr) {
    console.log(plyr, dlr);
    if (plyr == dlr) {
        RevealDealerCards();
        if (dealerTotal.innerText <= total.innerText) {
            win.innerText += " +" + bet;
            win.style.display = "block";
            score.innerText = Number(score.innerText) + Number(bet);
        } else {
            bust.innerText += " -" + bet;
            bust.style.display = "block";
            score.innerText = Number(score.innerText) - bet;
        }
        ButtonState(true);
        setTimeout(Reset, 4000);
    }
}

// Check if user went over 21
function CheckBust() {
    if (total.innerText > 21) {
        bust.innerText += " -" + bet;
        bust.style.display = "block";
        score.innerText = Number(score.innerText) - bet;
        ButtonState(true);
        RevealDealerCards();
        setTimeout(Reset, 4000);
    }
    else {
        return false;
    }
}


// Set everything to default value
function Reset() {
    bust.style.display = "none";
    win.style.display = "none";

    bust.innerText = "Loss";
    win.innerText = "Win";

    cardsAvailable = [...cardsDefault];

    cardStore.innerHTML = "";
    dealerCardStore.innerHTML = "";

    ButtonState(false);
    betAtr.disabled = false;

    hand.innerText = "Cards: ";
    total.innerText = 0;

    dealerHand.innerText = "Cards: ";
    dealerTotal.innerText = 0;
    dealerCards = [];
    firstTime = true;

    timesDrawn = 0;
    dealerTimesDrawn = 0;

    playerPassed = false;
    dealerPassed = false;

    document.documentElement.style.setProperty("--hidden", "180deg");
    UpdateBet();
    if (bet > score.innerText) {
        betAtr.value = 0;
        bet = document.getElementById("bet").value;
    }
    Lose();
}
