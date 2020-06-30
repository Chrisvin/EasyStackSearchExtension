
'use strict';

chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        id: "stack_overflow_search_context_id",
        title: "Search in StackOverflow",
        type: 'normal',
        contexts: ['selection'],
    });
});

chrome.contextMenus.onClicked.addListener(function(item, tab) {
    let searchUrl = "https://www.stackoverflow.com/search?q="+item.selectionText;
    chrome.tabs.create({url: searchUrl, index: tab.index + 1});
});