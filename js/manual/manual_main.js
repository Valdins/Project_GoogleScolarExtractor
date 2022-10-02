console.log("Manual Main Script")

let inputs, index;
let cleaned_inputs = [];

inputs = document.getElementsByTagName('input');

// Current title
current_title = document.getElementsByTagName("h1").item(0).id;

for (index = 0; index < inputs.length; ++index) {
    if(inputs[index].type == 'checkbox' || inputs[index].type == 'radio' || inputs[index].type == 'text' || inputs[index].type == 'submit' || inputs[index].type == 'button') {
        cleaned_inputs.push(inputs[index]);
    }
}

cleaned_inputs.forEach(function (item) {
    if (item.type == 'submit') {
        console.log("Forward found!");
        item.addEventListener('click', function() {
            saveAnswersFromPage(current_title);
        });
    }
});

function saveAnswersFromPage(current_title){
    console.log("Answer save!");
    let type_data = {};
    let value_data = {};
    let selected_data = [];
    cleaned_inputs.forEach(function (item) {
        if (item.type == 'checkbox' || item.type == 'radio' || item.type == 'text'){
            type_data[item.id] = item.type;

            if ((item.type == 'radio' || item.type == 'checkbox') && item.checked) {
                selected_data.push(item.id);
            }
            if ((item.type == 'text')) {
                value_data[item.id] = item.value;
            }
        }
    });
    sendResultsToBackground(current_title, type_data, value_data, selected_data);
}

function sendResultsToBackground(current_title, type_data, value_data, selected_data) {
    let temp_value = {};
    let value = {};
    temp_value["Type"] = type_data;
    temp_value["WebpageTitle"] = current_title;
    temp_value["Value"] = value_data;
    temp_value["Selected"] = selected_data;

    value["InsertManual"] = temp_value;

    chrome.runtime.sendMessage(
        value,
        (response) =>{
            console.log(response);
        }
    );
}
