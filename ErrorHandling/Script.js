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


function displayOutput(message, target) {
    try {
        target.innerText = message;
    } catch (error) {
        console.error("Cannot Target .innerText");
    }
}

function getID() {
    const textinput = document.getElementById("InputID").value;

    data.forEach(elem => {
        if (elem.id == textinput) {
            SelectedData = elem;
        }
    });

    try {
        SelectedData;


        const TargetArray = [name, username, email, company, phone, website, street, suite, city, zipcode];
        const ObjectArray = Object.values(SelectedData);
        const AddressArray = Object.values(SelectedData.address);

        ObjectArray.shift();
        AddressArray.pop();

        for (let i = 0; i < TargetArray.length; i++) {
            displayOutput(ObjectArray[i], TargetArray[i]);
            displayOutput(SelectedData.company.name, company);

            if (i >= 6) {
                for (let x = 0; x < AddressArray.length; x++) {
                    displayOutput(AddressArray[x], TargetArray[i]);
                    i++
                }
            }
        }
    } catch (error) {
        console.error("ID in data not found");
    }
}
