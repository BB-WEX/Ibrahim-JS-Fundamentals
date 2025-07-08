
// Scores and info

const total = document.getElementById("total");
const hand = document.getElementById("hand");
const score = document.getElementById("score");
var bet = document.getElementById("bet").value;
const betAtr = document.getElementById("bet");

betAtr.setAttribute("max", score.innerText);


// Buttons
const hitBtn = document.getElementById("hit");
const passBtn = document.getElementById("pass");

// Outcomes
const bust = document.getElementById("bust");
const win = document.getElementById("win");

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
    10, 10, 10, 10
];
var cardsAvailable = cardsDefault;



function updateBet() {
    bet = document.getElementById("bet").value;
    betAtr.setAttribute("max", score.innerText);
}

function RemoveCard(cards, draw) {
    var index = cards.indexOf(draw);
    if (index > -1) {
        cards.splice(index, 1)
    }
}

// Set everything to default value

function Reset() {
    bust.style.display = "none";
    win.style.display = "none";

    bust.innerText = "Bust";
    win.innerText = "Win";

    cardsAvailable = cardsDefault;

    hitBtn.disabled = false;
    passBtn.disabled = false;
    betAtr.disabled = false;

    hand.innerText = "Cards: ";
    total.innerText = 0;

    if (bet > score.innerText) {
        betAtr.value = score.innerText;
    }
}


function hit() {

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

    // Check if user went over 21

    if (total.innerText > 21) {

        bust.innerText += " -" + bet;
        bust.style.display = "block";

        score.innerText = Number(score.innerText) - bet;

        hitBtn.disabled = true;
        passBtn.disabled = true;

        setTimeout(Reset, 3000);
    }

}

function pass() {
    // let dealer choose do their turn
    // for now end turn

    if (total.innerText == 21){
        
        win.innerText += " +" + bet;
        win.style.display = "block";

        score.innerText = Number(score.innerText) + Number(bet);

        hitBtn.disabled = true;
        passBtn.disabled = true;

        setTimeout(Reset, 3000);
    }
}