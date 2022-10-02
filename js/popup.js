function setUser() {
    let username = document.getElementById('usernameInputField').value;
    let country = document.getElementById('countryInputField').value.toUpperCase();
    let link = document.getElementById('linkInputField').value;
    const dataToSend = [username, country, link];
    
    let value = {};
    value["setUser"] = dataToSend;

    if(username.length > 0 && country.length > 0 && link.length > 0) {
        chrome.runtime.sendMessage(
            value,
            (response) =>{
                console.log(response);
                window.location.href = "../html/selection.html";
            }
        );
    }
    else
        alert("Please insert values in the fields!");
}

document.getElementById('selectionPagebtn').addEventListener('click', setUser);