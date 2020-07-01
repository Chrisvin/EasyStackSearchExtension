'use strict';

function openTab(searchUrl) {
  chrome.storage.sync.get({
    shouldOpenInSameTab: true
  }, function(items) {
    if (items.shouldOpenInSameTab) {
      chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.update(tab.id, {url: searchUrl});
      });
    } else {
      chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.create({url: searchUrl, index: tab.index + 1});
      });
    }
  });
}

// Open stackoverflow search in same tab when input is entered
chrome.omnibox.onInputEntered.addListener(
  function(text) {
    var prefix = 'https://'
    var postfix = '/search?q='
    var seURL = 'www.stackoverflow.com'
    // TODO: Add support to change seURL for different SE sites.
    
    var finalURL = prefix + seURL + postfix + encodeURIComponent(text);
    
    openTab(finalURL);
});

// Suggest specific questions as text is being typed.
chrome.omnibox.onInputChanged.addListener(
  function(query, suggestFn) {
    // TODO: Use StackOverflow api to get list of questions and sort them based on relevance.
  }
)