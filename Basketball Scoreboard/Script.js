
const Home = document.getElementById("HOMEcounter");
const Away = document.getElementById("AWAYcounter");


function AddScore(Score, Target){
    Score = Number(Score);
    Target.innerText = Number(Target.innerText) + Score;
    Target.innerText = (Number(Target.innerText)).toLocaleString("en-US", {minimumIntegerDigits: 2, useGrouping:false});
}

function Reset(Target){
    Target.innerText = 0;
    Target.innerText = (Number(Target.innerText)).toLocaleString("en-US", {minimumIntegerDigits: 2, useGrouping:false});
}