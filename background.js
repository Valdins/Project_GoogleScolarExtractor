let current_title = "";
chrome.tabs.onUpdated.addListener(TitleListener);

function TitleListener (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        chrome.scripting.executeScript({
            target: { tabId: tabId},
            files:['content_script.js']
        });
    }
}

function ManualTestingListener (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        console.log("Manual Page Change");
        chrome.scripting.executeScript({
            target: { tabId: tabId},
            files:['js/manual/manual_main.js']
        });
    }
}

function AutoTestingListener (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.active) {
        console.log("Auto Page Change");
        chrome.scripting.executeScript({
            target: { tabId: tabId},
            files:['js/auto/auto_main.js']
        });
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>{
    if (message == "ManualStart"){
        chrome.tabs.onUpdated.addListener(ManualTestingListener);
        let jsonfile = {};
        jsonfile["Test"] = "ManualActive";
        chrome.storage.local.set(jsonfile, function() {
            console.log("New jsonfile Saved!" + JSON.stringify(jsonfile));
        });
        chrome.tabs.reload();

    } else if (message == "ManualStop") {
        chrome.tabs.onUpdated.removeListener(ManualTestingListener);
        chrome.storage.local.remove(["Test"], function(){});
        chrome.tabs.reload();

    } else if (message == "AutoStart") {
        chrome.storage.local.remove(["AutoTest"], function(){
            chrome.tabs.onUpdated.addListener(AutoTestingListener);
            let jsonfile = {};
            jsonfile["Test"] = "AutoActive";
            chrome.storage.local.set(jsonfile, function() {
                console.log("New jsonfile Saved!" + JSON.stringify(jsonfile));
            });
            chrome.tabs.reload();
        });

    } else if (message == "AutoStop") {
        chrome.tabs.onUpdated.removeListener(AutoTestingListener);
        chrome.storage.local.remove(["Test"], function(){});
        chrome.tabs.reload();

    } else if (message == "loadChat") { 
        let value = {};
        value["loadChat"] = current_title;

        chrome.storage.local.get(["UserData"], function(result) {
            if (Object.keys(result).length !== 0){
                let msg = sendDataToServer(value, JSON.parse(JSON.stringify(result["UserData"])));
                msg.then(response => { saveChatToLocalStorage(response); })
            }
        });
        
    } else if (message == "loadHistory") { 
        let value = {};
        value["loadHistory"] = current_title;
        chrome.storage.local.get(["UserData"], function(result) {
            if (Object.keys(result).length !== 0){
                let msg = sendDataToServer(value, JSON.parse(JSON.stringify(result["UserData"])));
                msg.then(response => { saveHistoryToLocalStorage(response); })
            }
        });
        
    } else if (message == "ChatGet") { 
        getChatFromLocalStorage();

    } else if (message == "getTestStatus") {
        getTestStatusFromLocalStorage();

    } else if (message == "getUser") { 
        getUserFromLocalStorage();
        
    } else if (message == "Continue") { 
        getProgressFromLocalStorage();
 
    } else if (message == "HistoryGet") { 
        getHistoryFromLocalStorage();
 
    } else if (message == "ClearStorage") { 
        clearAllStorage();
 
    } else if (Object.keys(message)[0] == "Title") {
        current_title = message["Title"];

    } else if (Object.keys(message)[0] == "Progress") {
        saveProgressToLocalStorage(message["Progress"]);

    } else if (Object.keys(message)[0] == "InsertChat") {
        let temp_value = message["InsertChat"];
        let value = {};
        temp_value["WebpageTitle"] = current_title;
        value["InsertChat"] = temp_value;
        chrome.storage.local.get(["UserData"], function(result) {
            sendDataToServer(value, JSON.parse(JSON.stringify(result["UserData"])));
        });
    
    } else if (Object.keys(message)[0] == "setUser") {
        saveUserDataToLocalStorage(message["setUser"]);
        chrome.tabs.reload();
    } else {
        chrome.storage.local.get(["UserData"], function(result) {
            console.log("Question Sending");
            sendDataToServer(message, JSON.parse(JSON.stringify(result["UserData"])));
        });
    }

    sendResponse("Hi");
});

function sendDataToServer(message, userData) {
    message["UserData"] = userData;
    let data_to_send = JSON.stringify(message);

    return fetch('http://100.114.56.240:55002/', {
        method: 'post',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: 'keyword=' + data_to_send,
        mode: 'cors'
        })
        .then(res => res.json())
        .then(res => { return res });
}

function saveChatToLocalStorage(chatMessages){
    chrome.storage.local.remove(["ChatStorage"], function(){
        let jsonfile = {};
        jsonfile["ChatStorage"] = chatMessages;
        console.log("Chat messages");
        console.log(JSON.stringify(jsonfile));

        chrome.storage.local.set(jsonfile, function() {
            console.log("New jsonfile Saved!" + JSON.stringify(jsonfile));
        });
    });
}

function getChatFromLocalStorage(){
    chrome.storage.local.get(["ChatStorage", "UserData"], function(result) {
        let previous_inputs = JSON.parse(JSON.stringify(result));

        chrome.runtime.sendMessage(
            previous_inputs,
            (response) =>{
                console.log(response);
            }
        );
    });
}

// History Section
function saveHistoryToLocalStorage(history){
    chrome.storage.local.remove(["HistoryStorage"], function(){
        let jsonfile = {};
        jsonfile["HistoryStorage"] = history;
        console.log("History Storage");
        console.log(JSON.stringify(jsonfile));

        chrome.storage.local.set(jsonfile, function() {
            console.log("New jsonfile Saved!" + JSON.stringify(jsonfile));
        });
    })
}

function getHistoryFromLocalStorage(){
    chrome.storage.local.get(["HistoryStorage"], function(result) {
        let previous_inputs = JSON.parse(JSON.stringify(result));

        chrome.runtime.sendMessage(
            previous_inputs,
            (response) =>{
                console.log(response);
            }
        );
    });
}

// Progress
function saveProgressToLocalStorage(title){
    chrome.storage.local.remove(["ProgressStorage"], function(){
        let jsonfile = {};
        jsonfile["ProgressStorage"] = title;
        console.log("Progress: " + JSON.stringify(jsonfile));

        chrome.storage.local.set(jsonfile, function() {
            console.log("New jsonfile Saved!" + JSON.stringify(jsonfile));
        });
    })
}

function getProgressFromLocalStorage(){
    chrome.storage.local.get(["ProgressStorage"], function(result) {
        let previous_inputs = JSON.parse(JSON.stringify(result));
        console.log("Progress: " + JSON.stringify(previous_inputs));

        chrome.runtime.sendMessage(
            previous_inputs,
            (response) =>{
                console.log(response);
            }
        );
    });
}

function clearAllStorage(){
    chrome.storage.local.clear(function() {
        let error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
        console.log('Clearing all storage');
    });
}

// User Data / Survey info
function saveUserDataToLocalStorage(array){
    let jsonfile = {};
    jsonfile["UserData"] = array;
    chrome.storage.local.set(jsonfile, function() {
        console.log("New UserData json Saved!" + JSON.stringify(jsonfile));
    });
}

function getUserFromLocalStorage(){
    chrome.storage.local.get(["UserData"], function(result) {
        chrome.runtime.sendMessage(
            result,
            (response) =>{
                console.log(response);
            }
        );
    });
}

// Test Status
function getTestStatusFromLocalStorage(){
    chrome.storage.local.get(["Test"], function(result) {
        let status = JSON.parse(JSON.stringify(result));
        chrome.runtime.sendMessage(
            status,
            (response) =>{
                console.log(response);
            }
        );
    });
}