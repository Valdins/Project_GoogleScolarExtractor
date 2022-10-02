saveProgress();

function saveProgress(){
    current_title = document.getElementsByTagName("h1").item(0).innerHTML;
    let value = {};
    value["Progress"] = current_title;

    chrome.runtime.sendMessage(
        value,
        (response) =>{
            console.log(response);
        }
    );
}
