
chrome.browserAction.onClicked.addListener(()=>{
    chrome.tabs.query({
        currentWindow: true,
        active: true
      }, function(tabs) {
        if (tabs.length == 0) {
          return;
        }
        
        let tab = tabs[0];
        chrome.tabs.create({url: 'options/options.html', index: tab.index + 1});
    });
});