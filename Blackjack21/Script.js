
const total = document.getElementById("total");
const hand = document.getElementById("hand");
const score = document.getElementById("score");
const bet = document.getElementById("bet");

var cardsAvailable = [
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
]

function RemoveCard(cards, draw) {
    var index = cards.indexOf(draw);
    if (index > -1) {
        cards.splice(index, 1)
    }
}

function hit() {
    console.log(cardsAvailable);

    do {
        draw = Math.floor(Math.random() * 10) + 1;
        if (cardsAvailable.includes(draw)) {
            RemoveCard(cardsAvailable, draw);
            break
        } else if(cardsAvailable.length == 0){
            console.log("No Cards");
            break
        }
    } while (true);

    console.log(cardsAvailable);

    hand.innerText += " |  "+draw;
    total.innerText = Number(total.innerText) + draw;

}