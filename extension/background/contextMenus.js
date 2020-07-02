
'use strict';

function getFilterString(
    questionsWithCodeFilter,
    communityWikisFilter,
    excludeDuplicateQuestionsFilter,
    answerTypeFilter,
    customFilter
    ) {
        var filterString = "";
        if (questionsWithCodeFilter) {
            filterString += "hascode:true ";
        }
        if (communityWikisFilter) {
            filterString += "wiki:true ";
        }
        if (excludeDuplicateQuestionsFilter) {
            filterString += "duplicate:false ";
        }
        switch (answerTypeFilter) {
            //TODO: Fix me, I don't work for some reason. :(
            case 1:
                filterString += "answers:1 ";
                break;
            case 2:
                filterString += "hasaccepted:true";
                break;
            case 3:
                filterString += "isanswered:true";
                break;
            default:
                break;
        }
        if (customFilter) {
            filterString += customFilter+" ";
        }
        return filterString;
}

chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        id: "stack_overflow_search_context_id",
        title: "Search in Stack Overflow",
        type: 'normal',
        contexts: ['selection'],
    });
});

chrome.contextMenus.onClicked.addListener(function(item, tab) {
    chrome.storage.sync.get({
        questionsWithCodeFilter: false,
        communityWikisFilter: false,
        excludeDuplicateQuestionsFilter: false,
        answerTypeFilter: 0,
        customFilter: ""
    }, function(items) {
        let filterString = getFilterString(
            items.questionsWithCodeFilter, 
            items.communityWikisFilter, 
            items.excludeDuplicateQuestionsFilter, 
            items.answerTypeFilter, 
            items.customFilter);
        let searchText = filterString + item.selectionText;
        let searchUrl = "https://www.stackoverflow.com/search?q="+encodeURIComponent(searchText)
        chrome.tabs.create({url: searchUrl, index: tab.index + 1});
    });
});