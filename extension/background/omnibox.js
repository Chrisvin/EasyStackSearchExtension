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
      switch (parseInt(answerTypeFilter)) {
          case 1:
              filterString += "answers:1 ";
              break;
          case 2:
              filterString += "hasaccepted:true ";
              break;
          case 3:
              filterString += "isanswered:true ";
              break;
          default:
              break;
      }
      if (customFilter) {
          filterString += customFilter+" ";
      }
      return filterString;
}

function openTab(searchUrl, shouldOpenInSameTab) {
  chrome.tabs.getSelected(null, function(tab) {
    if (shouldOpenInSameTab) { 
        chrome.tabs.update(tab.id, {url: searchUrl});
    } else {
        chrome.tabs.create({url: searchUrl, index: tab.index + 1});
    }
  });
}

// Open stackoverflow search in same tab when input is entered
chrome.omnibox.onInputEntered.addListener(
  function(text) {
    chrome.storage.sync.get({
      baseUrl: "https://www.stackoverflow.com/search?q=",
      shouldOpenInSameTab: true,
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
      var finalURL = items.baseUrl + encodeURIComponent(filterString + text);
      openTab(finalURL, items.shouldOpenInSameTab);
    });
});

// Suggest specific questions as text is being typed.
chrome.omnibox.onInputChanged.addListener(
  function(query, suggest) {
    // TODO: Provide user the option to choose whether question suggestions or filter suggestions will be shown.
    // TODO: Use StackOverflow api to get list of questions and sort them based on relevance.

    chrome.storage.sync.get({
      questionsWithCodeFilter: false,
      communityWikisFilter: false,
      excludeDuplicateQuestionsFilter: false,
      answerTypeFilter: 0,
      customFilter: "",
      filterSuggestions: []
    }, function(items) {

      var filterString = getFilterString(
        items.questionsWithCodeFilter, 
        items.communityWikisFilter, 
        items.excludeDuplicateQuestionsFilter, 
        items.answerTypeFilter, 
        items.customFilter);
      var defaultDescription = filterString + query;
      if (defaultDescription) {
        defaultDescription = " ";
      }
      chrome.omnibox.setDefaultSuggestion({ description: defaultDescription });

      var suggestions = [];
      var suggestion = "";
      
      var i, sLength = items.filterSuggestions.length;

      for (i=0;i<sLength;i++) {
        if (items.filterSuggestions[i]) {
          suggestion = items.filterSuggestions[i] + " " + query;
          suggestions.push({ content: suggestion, description: suggestion });
        }
      }

      suggest(suggestions);
    });
  }
)