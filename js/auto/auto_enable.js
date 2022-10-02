console.log("Auto Enabled Pressed!")

chrome.runtime.sendMessage(
    "AutoStart",
    (response) =>{
        console.log(response);
    }
);