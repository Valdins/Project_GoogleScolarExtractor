continueProgress();

function continueProgress(){
    chrome.runtime.sendMessage(
        "Continue",
        (response) =>{
            console.log(response);
        }
    );
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>{
    if (Object.keys(message)[0] == "ProgressStorage"){
        let question_history = message["ProgressStorage"];
        navigate(question_history);
    } 
    sendResponse("Navigated!");
});

function navigate(page){
    if (page == "Select Mode"){
        window.location.href = "../html/selection.html";
    } else if (page == "Auto-Test"){
        window.location.href = "../html/auto.html";
    } else if (page == "Manual Test"){
        window.location.href = "../html/manual.html";
    } else if (page == "Question History"){
        window.location.href = "../html/history.html";
    } else if (page == "Chat"){
        window.location.href = "../html/chat.html";
    } else if (page == "Chat."){
        window.location.href = "../html/chatManual.html";
    } else if (page == "Question History."){
        window.location.href = "../html/historyManual.html";
    } else if (page == "Export results"){
        window.location.href = "../html/download.html";
    }
}