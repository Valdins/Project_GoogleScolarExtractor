console.log("Manual Disable Pressed!")

chrome.runtime.sendMessage(
    "ManualStop",
    (response) =>{
        console.log(response);
    }
);