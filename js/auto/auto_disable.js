console.log("Auto Disable Pressed!")

chrome.runtime.sendMessage(
    "AutoStop",
    (response) =>{
        console.log(response);
    }
);