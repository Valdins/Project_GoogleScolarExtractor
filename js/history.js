loadQuestionHistory();

function addQuestionHistory(nr, data){
    let chatBody = document.getElementById("historySubmenu");
    if(data[1] == true){
        chatBody.innerHTML += 
        `<li>
            <a id="historyPageLink" href="#" class="Flagged">` + nr +"."+ data[0] + ` &#128681</a>
        </li>`;
    } else{
        chatBody.innerHTML += 
        `<li>
            <a id="historyPageLink" href="#" class="">`+ nr +"."+ data[0] + `</a>
        </li>`;
    }
    
}

function loadQuestionHistory(){
    chrome.runtime.sendMessage(
        "HistoryGet",
        (response) =>{
            console.log(response);
        }
    );
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>{
    if (Object.keys(message)[0] == "HistoryStorage"){
        let question_history = message["HistoryStorage"];
        Object.keys(question_history).forEach(function (item, index) {
            addQuestionHistory(item, question_history[item]);
        });
    } 
    sendResponse("History received!");
});