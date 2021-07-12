chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (_tabs) => {
        console.log("new page: ", tab.url);
        chrome.tabs.sendMessage(tabId, {
          message: "TabUpdated",
          tabId,
          changeInfo,
          url: _tabs[0].url,
        });
      });
    }
  });
});
