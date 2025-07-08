
const counter = document.getElementById("count-el");
const entries = document.getElementById("save-el");

function Increase(){
    counter.innerText = Number(counter.innerText) + 1;
}

function Save(){
    entries.innerText += "-"+counter.innerText;
}