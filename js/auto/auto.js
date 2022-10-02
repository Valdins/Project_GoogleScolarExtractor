
  getTestStatus();
  
  function injectAutoStart() {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.scripting.executeScript({target: {tabId: tabs[0].id}, files: ['js/auto/auto_enable.js']})
    })
  }
  
  function injectAutoDisable() {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      chrome.scripting.executeScript({target: {tabId: tabs[0].id}, files: ['js/auto/auto_disable.js']})
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
    if (testStatus == "AutoActive"){
      document.getElementById('autoTestBtn').setAttribute("disabled", "");
    }
  } else if(Object.keys(message).length === 0) {
    document.getElementById('autoTestBtnDisable').setAttribute("disabled", "");
  }
  sendResponse("Test received!");
});

  document.getElementById('autoTestBtn').addEventListener('click', injectAutoStart);
  document.getElementById('autoTestBtnDisable').addEventListener('click', injectAutoDisable);
  
  