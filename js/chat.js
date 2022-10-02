loadMessages();

function addMessageToChat(user){
    let chatBody = document.getElementById("chatMainBody");
    let chatText = document.getElementById("chatMessageTextInput");

    if(chatText.value.length > 0){
        chatBody.innerHTML += 
        `<div class="d-flex justify-content-end mb-4 pt-1">
            <div>
                <p class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">` + chatText.value +`</p>
            </div>
            <p class="p-2">`+ user + `</p>
        </div>`;
        
        let temp_value = {};
        let value = {};
        temp_value["Message"] = chatText.value;
    
        value["InsertChat"] = temp_value;

        chrome.runtime.sendMessage(
            value,
            (response) =>{
                console.log(response);
            }
        );

        chatText.value = '';
    }
}

function addMessageFromServer(user, text, option) {
    let chatBody = document.getElementById("chatMainBody");

    if (option == 1){
        chatBody.innerHTML += 
        `<div class="d-flex flex-row justify-content-start">
            <p class="p-2">`+ user + `</p>
            <div>
                <p class="small p-2 ms-3 mb-1 rounded-3" style="background-color: #f5f6f7;">` + text +`</p>
            </div>
        </div>`;
    } else {
        chatBody.innerHTML += 
        `<div class="d-flex justify-content-end mb-4 pt-1">
            <div>
                <p class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">` + text +`</p>
            </div>
            <p class="p-2">`+ user + `</p>
        </div>`;
    }
}

function loadMessages(){
    chrome.runtime.sendMessage(
        "ChatGet",
        (response) =>{
            console.log(response);
        }
    );
}

function getUser(){
    chrome.runtime.sendMessage(
        "getUser",
        (response) =>{
            console.log(response);
        }
    );
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>{
    if (Object.keys(message)[0] == "ChatStorage"){
        let msg_history = message["ChatStorage"];
        let user = message["UserData"];
        Object.keys(msg_history).forEach(function (item, index) {
            if(msg_history[item][0] == user[0])
                addMessageFromServer(msg_history[item][0], msg_history[item][1], 2);
            else
                addMessageFromServer(msg_history[item][0], msg_history[item][1], 1);
        });
    } else if (Object.keys(message)[0] == "UserData"){
        let user = message["UserData"];
        addMessageToChat(user[0]);
    }
    sendResponse("Chat Messages received!");
});

document.getElementById('sendMessageBtn').addEventListener('click', function() {
    getUser();
});