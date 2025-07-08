
const Home = document.getElementById("HOMEcounter");
const Away = document.getElementById("AWAYcounter");


function AddScore(Score, Target){
    console.log(Target);
    Score = Number(Score);
    Target.innerText = Number(Target.innerText) + Score;    
}