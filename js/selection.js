function ClearAll() {
    chrome.runtime.sendMessage(
        "ClearStorage",
        (response) =>{
            console.log(response);
            window.location.href = "../html/popup.html";
        }
    );
}
    
document.getElementById('NewTestBtn').addEventListener('click', ClearAll);