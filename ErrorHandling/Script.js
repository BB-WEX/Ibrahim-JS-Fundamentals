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
const phone = document.getElementById("phone");
const website = document.getElementById("website");
const company = document.getElementById("company");

const noFoundMessage = document.getElementById("no-found");

function displayOutput(message, target) {
    try {
        target.innerText = message;
    } catch (error) {
        console.error("Cannot Target .innerText");
    }
}

function getIDInfo(selectedData) {
    const targetArray = [name, username, email, company, phone, website, street, suite, city, zipcode];
    const objectArray = Object.values(selectedData);
    const addressArray = Object.values(selectedData.address);

    objectArray.shift();
    addressArray.pop();

    for (let i = 0; i < targetArray.length; i++) {
        displayOutput(objectArray[i], targetArray[i]);
        displayOutput(selectedData.company.name, company);

        if (i >= 6) {
            for (let x = 0; x < addressArray.length; x++) {
                displayOutput(addressArray[x], targetArray[i]);
                i++
            }
        }
    }
}

function getID() {
    const textinput = document.getElementById("InputID").value;
    selectedData = null;
    data.forEach(elem => {
        if (elem.id == textinput) {
            selectedData = elem;
        }
    });

    try {
        getIDInfo(selectedData);
        noFoundMessage.style.opacity = "0";
    } catch (error) {
        console.error("ID in data not found");
        noFoundMessage.style.opacity = "1";
    }
}
