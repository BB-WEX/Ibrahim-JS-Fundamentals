
// Scores and info
// Player
const total = document.getElementById("total");
const hand = document.getElementById("hand");
const score = document.getElementById("score");

var bet = document.getElementById("bet").value;
const betAtr = document.getElementById("bet");

const cardStore = document.getElementById("cards");

var timesDrawn = 0;
// Buttons
const hitBtn = document.getElementById("hit");
const passBtn = document.getElementById("pass");
const choicePopup = document.getElementById("choice-popup");
const cardHolder = document.getElementById("card-holder");


// Outcomes
const bust = document.getElementById("bust");
const win = document.getElementById("win");


// Dealer
const dealerHand = document.getElementById("hand-dealer");
const dealerTotal = document.getElementById("total-dealer");
// Store cards in array to reveal later
var dealerCards = [];
var firstTime = true


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

function UpdateBet() {
    bet = document.getElementById("bet").value;
    betAtr.setAttribute("max", score.innerText);
}

function RemoveCard(cards, draw) {
    var index = cards.indexOf(draw);
    if (index > -1) {
        cards.splice(index, 1)
    }
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
    const newCard = document.createElement("img");

    const suit = cardSuit[Math.floor(Math.random() * cardSuit.length)];
    console.log(suit);

    cardHolder.appendChild(newCard);
    newCard.src = `CardsImages/fronts/${suit}_${cardValue}.png`;

    const value = await GetChoice();

    choicePopup.classList.remove("show");
    cardHolder.innerHTML = "";
    cardStore.appendChild(newCard);

    // Offset the animation start the more cards there are
    var offsetX = -274 + timesDrawn * -212;
    document.documentElement.style.setProperty("--cardstartY", `${offsetX}px`)
    return value;
}


// Gets the value of card and a random suite and displays a visual 
function GetCard(value) {
    if (value == 1) {
        value = "ace";
        var chosenNum = HandleAcePick(value);
        return chosenNum;
    } else {
        const newCard = document.createElement("div");
        const suit = cardSuit[Math.floor(Math.random() * cardSuit.length)];
        console.log(suit);
        cardStore.appendChild(newCard);
        newCard.classList.add("drawn-card");
        newCard.style.backgroundImage = `url(CardsImages/fronts/${suit}_${value}.png)`;

        // Offset the animation start the more cards there are
        var offsetX = -274 + timesDrawn * -212;
        document.documentElement.style.setProperty("--cardstartY", `${offsetX}px`)
    }
}

function AcePick(num) {
    return num;
}

// Reveal dealer cards
function RevealDealerCards() {
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

    hitBtn.disabled = true;
    passBtn.disabled = true;

    if (draw == 1) {
        draw = await GetCard(draw);
        // Temporary until ace get animation it completed
        hitBtn.disabled = false;
        passBtn.disabled = false;
    } else { await GetCard(draw); }

    addEventListener("animationend", () => {
        hitBtn.disabled = false;
        passBtn.disabled = false;
    })


    hand.innerText += " |  " + draw;
    total.innerText = Number(total.innerText) + draw;

    DealerDraw();

    CheckBust();

    timesDrawn++;
}


function Pass() {

    DealerDraw();

    playerPassed = true;

    RoundEnd(playerPassed, dealerPassed);
}


function DealerDraw() {

    // Check if total is 16 or higher

    if (dealerCards.reduce((sum, num) => sum + num, 0) >= 16) {
        dealerPassed = true;
    } else {


        // Dealer draws first card is shown others are hidden
        // Draw card and take it away from card pile
        do {
            draw = Math.floor(Math.random() * 10) + 1;
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
        if (firstTime == true) {
            dealerHand.innerText += "  |  " + draw;
            dealerTotal.innerText = Number(dealerTotal.innerText) + draw;
            firstTime = false;
        } else {
            dealerHand.innerText += "  |  " + "?";
        }

        // Check if dealer went bust
        if (dealerCards.reduce((sum, num) => sum + num, 0) > 21) {
            RevealDealerCards();

            win.innerText += " +" + bet;
            win.style.display = "block";

            score.innerText = Number(score.innerText) + Number(bet);

            hitBtn.disabled = true;
            passBtn.disabled = true;

            setTimeout(Reset, 3000);
        }
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

            hitBtn.disabled = true;
            passBtn.disabled = true;


        } else {
            bust.innerText += " -" + bet;
            bust.style.display = "block";

            score.innerText = Number(score.innerText) - bet;

            hitBtn.disabled = true;
            passBtn.disabled = true;

        }

        setTimeout(Reset, 3000);
    }
}

// Check if user went over 21
function CheckBust() {
    if (total.innerText > 21) {

        bust.innerText += " -" + bet;
        bust.style.display = "block";

        score.innerText = Number(score.innerText) - bet;

        hitBtn.disabled = true;
        passBtn.disabled = true;

        RevealDealerCards();

        setTimeout(Reset, 3000);
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

    hitBtn.disabled = false;
    passBtn.disabled = false;
    betAtr.disabled = false;

    hand.innerText = "Cards: ";
    total.innerText = 0;

    dealerHand.innerText = "Cards: ";
    dealerTotal.innerText = 0;

    dealerCards = [];
    firstTime = true

    timesDrawn = 0;


    playerPassed = false;
    dealerPassed = false;
    UpdateBet();

    if (bet > score.innerText) {
        betAtr.value = 0;
        bet = document.getElementById("bet").value;
    }

    Lose();
}
