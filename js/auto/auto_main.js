let inputs, index;
let cleaned_inputs = [];
let input_types = [];
let previous_inputs = [];
let outcome = [];

// All inputs on the page
inputs = document.getElementsByTagName('input');

// Current title
current_title = document.getElementsByTagName("h1").item(0).id;
console.log("Current title: " + current_title);

// Cleaned inputs
for (index = 0; index < inputs.length; ++index) {
    if(inputs[index].type == 'checkbox' || inputs[index].type == 'radio' || inputs[index].type == 'text') {
        if(inputs[index].id.endsWith("other") == false && cleaned_inputs.includes(inputs[index].id.split("_").slice(0, 1).join("_")) == false)
            cleaned_inputs.push(inputs[index]);
        input_types.push(inputs[index].type);
    }
}

// Unique array
input_types = [...new Set(input_types)];

// Main Section
chrome.storage.local.get(["AutoTest"], function(result) {

    let status_prev_input_answer = false;

    previous_inputs = JSON.parse(JSON.stringify(result));

    if (typeof previous_inputs == 'undefined' || Object.keys(previous_inputs).length === 0) {
        console.log("No previous inputs");
        previous_inputs = createNewTestInputs(cleaned_inputs);
    }

    console.log("Continue AutoTest");
    previous_inputs = JSON.parse(JSON.stringify(previous_inputs["AutoTest"]));
    data_from_qst = previous_inputs["page_data"];
    let temp_var = {};
    temp_var[Object.keys(previous_inputs)[0]] = Object.values(previous_inputs)[0];
    previous_inputs = temp_var;

    // Check if current question exists
    question_input_history = previous_inputs[Object.keys(previous_inputs)];
    console.log(JSON.stringify(question_input_history));
    qih_list = Object.keys(question_input_history);

    let manual_test = false;

    for (index = 0; index < qih_list.length; ++index) {
        if (question_input_history[qih_list[index]] == "Testing"){
            console.log("Found variable : Testing");
            if(qih_list[index] == current_title){
                console.log("Setting Manual");
                question_input_history[qih_list[index]] = "MANUAL";
                manual_test = true;
                alert("Manual Testing: auto-test wasn't able to go to next question, please fill answers and move forward. Testing will resume automatically!");
            } else{
                question_input_history[qih_list[index]] = current_title;
            }

            saveUpdatedQuestionHistory(current_title, question_input_history, data_from_qst);

            if (manual_test == false){
                console.log("Rest of values: " + Object.values(question_input_history));
                if (Object.values(question_input_history).includes("")){
                    status_prev_input_answer = true;
                    document.getElementById('backbutton').click();
                    return;
                } else {
                    console.log("Testing finised, begin next question");

                    // Sending result back to background
                    sendResultsToBackground(Object.keys(previous_inputs)[0], question_input_history, data_from_qst);

                    previous_inputs = createNewTestInputs(cleaned_inputs);
                    previous_inputs = JSON.parse(JSON.stringify(previous_inputs["AutoTest"]));
                    data_from_qst = previous_inputs["page_data"];
                    let temp_var = {};
                    temp_var[Object.keys(previous_inputs)[0]] = Object.values(previous_inputs)[0];
                    previous_inputs = temp_var;
                    question_input_history = previous_inputs[Object.keys(previous_inputs)];
                    qih_list = Object.keys(question_input_history);
                }
            }
        } else if (question_input_history[qih_list[index]] == "MANUAL"){
            console.log("Found Manual");
            if(qih_list[index] != current_title){
                question_input_history[qih_list[index]] = current_title;
                saveUpdatedQuestionHistory(current_title, question_input_history, data_from_qst);

                console.log("Manual Testing finised, begin next question");

                // Sending result back to background
                sendResultsToBackground(Object.keys(previous_inputs)[0], question_input_history, data_from_qst);

                previous_inputs = createNewTestInputs(cleaned_inputs);
                previous_inputs = JSON.parse(JSON.stringify(previous_inputs["AutoTest"]));
                data_from_qst = previous_inputs["page_data"];
                let temp_var = {};
                temp_var[Object.keys(previous_inputs)[0]] = Object.values(previous_inputs)[0];
                previous_inputs = temp_var;
                question_input_history = previous_inputs[Object.keys(previous_inputs)];
                qih_list = Object.keys(question_input_history);
            }
        }

    }
    if(status_prev_input_answer == false){
        console.log("qih_list: " + qih_list);
        for (index = 0; index < qih_list.length; ++index) {
            if (question_input_history[qih_list[index]] == ""){
                console.log("Found variable : Empty");
                question_input_history[qih_list[index]] = "Testing";
                
                console.log("Updated Questions history: " + JSON.stringify(question_input_history));
                saveUpdatedQuestionHistory(current_title, question_input_history, data_from_qst);
                alert("Hi");
                TestQuestionType(current_title, input_types, qih_list[index], cleaned_inputs);
                break;
            }
        }
    }
});

function TestQuestionType(current_title, input_types, input, cleaned_inputs){

    console.log("Testing Input : " + input);
    // Input options
    if (input_types.length  == 1) {
        // Radio inputs
        if(input_types[0] == 'radio') {
            console.log("Radio input detected");
            document.getElementById(input).checked = 'checked';
            document.getElementById('forwardbutton').click();
            return;

        // Checkbox inputs
        } else if (input_types[0] == 'checkbox') {
            console.log("Checkbox input detected");
            // Clear previous checkboxes
            cleaned_inputs.forEach(function (item, index) {
                document.getElementById(String(item.id)).checked = '';
            });
            
            document.getElementById(input).checked = 'checked';
            document.getElementById('forwardbutton').click();
            console.log("Went forward");
            return;

        // Text inputs
        } else if (input_types[0] == 'text') {
            console.log("Text input detected");

            saveTextQuestionHistory(current_title, data_from_qst);

            // Inputs without "Other fields"
            let inputs_without_other = [];
            cleaned_inputs.forEach(function (item, index) {
                let temp_input = item.id.split('_');
                if (temp_input[1].startsWith("95") == false){
                    inputs_without_other.push(item.id);
                }
            });

            // Trying to find inputs to move to the next page
            random_int_values = randomList(inputs_without_other.length, 100);
            inputs_without_other.forEach(function (item, index) {
                document.getElementById(item).value = random_int_values[index];
            });
            
            document.getElementById('forwardbutton').click();
            return;
            
        }
    } else if (input_types.length  == 2) {
        // Text & Checkbox inputs
        if(input_types.includes("text") && input_types.includes("checkbox")) {
            console.log("Text & Checkbox inputs detected");

            // Inputs without "Other fields"
            let text_inputs = [];
            cleaned_inputs.forEach(function (item, index) {
                if (item.type == "text"){
                    text_inputs.push(item.id);
                }
            });

            if (text_inputs.length == 0) {
                console.log("Checkbox & 'Other' texts");
                // Clear previous checkboxes
                cleaned_inputs.forEach(function (item, index) {
                    if(String(item.id).split('_')[1].startsWith('95') == false)
                        document.getElementById(String(item.id)).checked = '';
                });
                
                document.getElementById(input).checked = 'checked';
                if (input.split('_')[1].startsWith('95')){
                    console.log(input+"_other");
                    document.getElementById(input+"_other").value = "Test value inserted";
                }

                document.getElementById('forwardbutton').click();
                return;

            } else {
                saveTextQuestionHistory(current_title, data_from_qst);
                document.getElementById('forwardbutton').click();
                return;
            }

        // Radio & Checkbox inputs
        } else if(input_types.includes("radio") && input_types.includes("checkbox")) {
            console.log("Radio & Checkbox inputs detected");
            // Clear previous checkboxes
            cleaned_inputs.forEach(function (item, index) {
                document.getElementById(String(item.id)).checked = '';
            });
            
            document.getElementById(input).checked = 'checked';
            document.getElementById('forwardbutton').click();
            return;
        
        // Text & Radio inputs
        } else if(input_types.includes("text") && input_types.includes("radio")) {
            console.log("Text & Radio inputs detected");
            saveTextQuestionHistory(current_title, data_from_qst);
            document.getElementById('forwardbutton').click();
            return;
        }
    } else if (input_types.length > 2) {
        console.log("More than 2 input types detected");
        saveTextQuestionHistory(current_title, data_from_qst);
        document.getElementById('forwardbutton').click();
        return;
    }
}

function createNewTestInputs(cleaned_inputs){

    let temp_value = {};
    let input_data = {};
    let jsonfile = {};
    let value = {};
    cleaned_inputs.forEach(function (item, index) {
        temp_value[item.id] = "";
        let ty = "";
        let val = "";
        if (item.type == 'checkbox' || item.type == 'radio' || item.type == 'text'){
            ty = item.type;
            if ((item.type == 'text'))
                val = item.value;
        }
        input_data[item.id] = [ty, val];
    });

    value[current_title] = temp_value;
    value["page_data"] = input_data;

    jsonfile["AutoTest"] = value;

    chrome.storage.local.remove(["AutoTest"], function(){
        chrome.storage.local.set(jsonfile, function() {
            console.log("New jsonfile Saved!" + JSON.stringify(jsonfile));
        });
    });

    return jsonfile;
}

function saveUpdatedQuestionHistory(title, question_input_history, data_from_qst){
    chrome.storage.local.remove(["AutoTest"], function(){
        let jsonfile = {};
        let value = {};
        value[title] = question_input_history;
        value["page_data"] = data_from_qst;
        jsonfile["AutoTest"] = value;

        chrome.storage.local.set(jsonfile, function() {
            console.log("New Updated Q Hist Saved!" + JSON.stringify(jsonfile));
        });
    });
}

function saveTextQuestionHistory(current_title, data_from_qst){
    chrome.storage.local.remove(["AutoTest"], function(){
        let jsonfile = {};
        let value = {};
        let temp_value = {};
        temp_value[current_title] = "Testing";
        value[current_title] = temp_value;
        value["page_data"] = data_from_qst;
        jsonfile["AutoTest"] = value;

        chrome.storage.local.set(jsonfile, function() {
            console.log("New Text Save!" + JSON.stringify(jsonfile));
        });
    });
}

function sendResultsToBackground(current_title, question_input_history, data_from_qst) {
    let temp_value = {};
    let value = {};
    temp_value["Questions"] = question_input_history;
    temp_value["WebpageTitle"] = current_title;

    value["InsertAuto"] = temp_value;
    value["page_data"] = data_from_qst;

    chrome.runtime.sendMessage(
        value,
        (response) =>{
            console.log(response);
        }
    );
}

function randomList(m,n) {
    let arr = new Array(m);
    for(let i=0;i<arr.length;i++) {arr[i]=0;}
    for (let i = 0; i < n; i++) {arr[(Math.floor((Math.random() * n) )%m)]++;}

    return arr;
}