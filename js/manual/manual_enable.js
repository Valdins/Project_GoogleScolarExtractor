console.log("Manual Enabled Pressed!")

chrome.runtime.sendMessage(
    "ManualStart",
    (response) =>{
        console.log(response);
    }
);