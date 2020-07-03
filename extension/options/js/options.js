var alertTimeout;

var filterSuggestionsTimeout;
var customFilterTimeout;

function showSavedAlert() {
    clearTimeout(alertTimeout);
    $(".alert").addClass("show");
    alertTimeout = setTimeout(function() {
        $(".alert").removeClass("show");
    }, 750);
}

var mFilterSuggestions = ["", "", "", "", "", "", ""];

function saveFilterSuggestions() {
    clearTimeout(filterSuggestionsTimeout);
    filterSuggestionsTimeout = setTimeout(function() {
        chrome.storage.sync.set({
            filterSuggestions: mFilterSuggestions
        }, function() {
            showSavedAlert();
        });
    }, 250);
}
function setInitialState() {
    chrome.storage.sync.get({
        shouldOpenInSameTab: true,
        questionsWithCodeFilter: false,
        communityWikisFilter: false,
        excludeDuplicateQuestionsFilter: false,
        answerTypeFilter: 0,
        customFilter: ""
    }, function(items) {
        if (items.shouldOpenInSameTab) {
            document.getElementById('same_tab_result').checked = true;
        } else {
            document.getElementById('new_tab_result').checked = true;
        }
        document.getElementById('question_with_code').checked = items.questionsWithCodeFilter;
        document.getElementById('community_wikis').checked = items.communityWikisFilter;
        document.getElementById('exclude_duplicate_questions').checked = items.excludeDuplicateQuestionsFilter;
        document.getElementById('answer_type').options.selectedIndex = items.answerTypeFilter;
        document.getElementById('custom_filter').value = items.customFilter;

        $(":input").attr('disabled', false);
    });
}

function setListeners() {
    $(".save_tab_result").on("change", function() {
        chrome.storage.sync.set({
            shouldOpenInSameTab: $("#same_tab_result").is(":checked")
        }, function(items) {
            showSavedAlert();
        });
    });
    $("#question_with_code").on("change", function() {
        chrome.storage.sync.set({
            questionsWithCodeFilter: this.checked
        }, function() {
            showSavedAlert();
        });
    });
    $("#community_wikis").on("change", function() {
        chrome.storage.sync.set({
            communityWikisFilter: this.checked
        }, function() {
            showSavedAlert();
        });
    });
    $("#exclude_duplicate_questions").on("change", function() {
        chrome.storage.sync.set({
            excludeDuplicateQuestionsFilter: this.checked
        }, function() {
            showSavedAlert();
        });
    });
    $("#answer_type").on("change", function() {
        chrome.storage.sync.set({
            answerTypeFilter: this.value
        }, function() {
            showSavedAlert();
        });
    });
    $("#custom_filter").on("input", function() {
        clearTimeout(customFilterTimeout);
        customFilterTimeout = setTimeout(function() {
            chrome.storage.sync.set({
                customFilter: this.value
            }, function() {
                showSavedAlert();
            });
        }, 250);
    });
}

setInitialState();
setListeners();