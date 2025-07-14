
// Scores and info
// Player
const total = document.getElementById("total");
const hand = document.getElementById("hand");
const score = document.getElementById("score");
var bet = document.getElementById("bet").value;
const betAtr = document.getElementById("bet");


// Buttons
const hitBtn = document.getElementById("hit");
const passBtn = document.getElementById("pass");

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


function Lose(){
    if (score <= 0){
        console.log("The House Wins");
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




function Hit() {
    betAtr.disabled = true;

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


    // Show the card drawn

    hand.innerText += " |  " + draw;
    total.innerText = Number(total.innerText) + draw;

    CheckBust();

    DealerDraw();
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
        } while (dealerScore >= 16);

        dealerCards.push(draw);

        // Show the first card
        if (firstTime == true) {
            dealerHand.innerText += "  |  " + draw;
            dealerTotal.innerText = Number(dealerTotal.innerText) + draw;
            firstTime = false;
        } else {
            dealerHand.innerText += "  |  " + "?";
        }
    }
}


function RoundEnd(plyr, dlr) {
    console.log(plyr, dlr);

    if (plyr == dlr) {
        // Reveal dealer cards
        dealerHand.innerText = "Cards: ";
        dealerTotal.innerText = 0;

        dealerCards.forEach(elem => {
            dealerHand.innerText += "  |  " + elem;
            dealerTotal.innerText = Number(dealerTotal.innerText) + elem;
        });

        if (dealerTotal.innerText < total.innerText) {
            win.innerText += " +" + bet;
            win.style.display = "block";

            score.innerText = Number(score.innerText) + Number(bet);

            hitBtn.disabled = true;
            passBtn.disabled = true;

            setTimeout(Reset, 3000);
        } else {
            bust.innerText += " -" + bet;
            bust.style.display = "block";

            score.innerText = Number(score.innerText) - bet;

            hitBtn.disabled = true;
            passBtn.disabled = true;

            setTimeout(Reset, 3000);
        }
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

        // Reveal dealer cards
        dealerHand.innerText = "Cards: ";
        dealerTotal.innerText = 0;

        dealerCards.forEach(elem => {
            dealerHand.innerText += "  |  " + elem;
            dealerTotal.innerText = Number(dealerTotal.innerText) + elem;
        });

        setTimeout(Reset, 3000);
    }

}


// Set everything to default value
function Reset() {
    bust.style.display = "none";
    win.style.display = "none";

    bust.innerText = "Loss";
    win.innerText = "Win";

    cardsAvailable = cardsDefault;

    hitBtn.disabled = false;
    passBtn.disabled = false;
    betAtr.disabled = false;

    hand.innerText = "Cards: ";
    total.innerText = 0;

    dealerHand.innerText = "Cards: ";
    dealerTotal.innerText = 0;

    dealerCards = [];
    firstTime = true


    playerPassed = false;
    dealerPassed = false;
    UpdateBet();

    if (bet > score.innerText) {
        betAtr.value = score.innerText;
    }
    
    Lose();
}
