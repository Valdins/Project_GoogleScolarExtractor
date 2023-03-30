console.log("Content Script");

let webpage_link = window.location.toString();
if(webpage_link.includes("webpage") == true){

    let current_title = document.getElementsByTagName("h1").item(0).id;
    console.log("Current title: " + current_title);
    sendTitle(current_title);

    loadChat();
    loadHistory();

    function sendTitle(title){
        let value = {};
        value["Title"] = title;
        chrome.runtime.sendMessage(
            value,
            (response) =>{
                console.log(response);
            }
        );
    }

    function loadChat(){
        chrome.runtime.sendMessage(
            "loadChat",
            (response) =>{
                console.log(response);
            }
        );
    }

    function loadHistory(){
        chrome.runtime.sendMessage(
            "loadHistory",
            (response) =>{
                console.log(response);
            }
        );
    }
}
