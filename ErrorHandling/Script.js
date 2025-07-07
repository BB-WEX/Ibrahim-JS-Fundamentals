async function fetchData() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        console.error('fetchData Error:', error.message);
    }
}

const name = document.getElementById("name");
const username = document.getElementById("username");
const email = document.getElementById("email");
const street = document.getElementById("street");
const suite = document.getElementById("suite");
const city = document.getElementById("city");
const zipcode = document.getElementById("zipcode");


function displayOutput(message, target){
    target.innerText = message;
}

function getID(){
    const textinput = document.getElementById("InputID").value;
    
    data.forEach(elem => {
        if(elem.id == textinput){
            SelectedData = elem;
        }
    });
    

    const TargetArray = [name, username, email, street, suite, city, zipcode];
    const ObjectArray = Object.values(SelectedData);
    const AddressArray = Object.values(SelectedData.address)

    ObjectArray.shift();

    var x = 0;
    
    for(let i = 0; i < TargetArray.length; i++){
        if(i < 3){
            displayOutput(ObjectArray[i], TargetArray[i]);
        }else{
            displayOutput(AddressArray[x], TargetArray[i]);
            x++;
        }
    }

}
