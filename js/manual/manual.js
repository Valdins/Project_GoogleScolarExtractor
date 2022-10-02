
getTestStatus();

function injectManualStart() {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.scripting.executeScript({target: {tabId: tabs[0].id}, files: ['js/manual/manual_enable.js']})
    })
  }
  
  function injectManualDisable() {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.scripting.executeScript({target: {tabId: tabs[0].id}, files: ['js/manual/manual_disable.js']})
    })
  }

  function getTestStatus(){
    chrome.runtime.sendMessage(
        "getTestStatus",
        (response) =>{
            console.log(response);
        }
    );
  }
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>{
    if (Object.keys(message)[0] == "Test"){
      let testStatus = message["Test"];
      if (testStatus == "ManualActive"){
        document.getElementById('manualTestBtn').setAttribute("disabled", "");
      }
    } else if(Object.keys(message).length === 0) {
      document.getElementById('manualTestBtnDisable').setAttribute("disabled", "");
    }
    sendResponse("Test received!");
  });

document.getElementById('manualTestBtn').addEventListener('click', injectManualStart);
document.getElementById('manualTestBtnDisable').addEventListener('click', injectManualDisable);
  
  