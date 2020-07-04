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

function saveFilterSuggestions(showAlert = true) {
    clearTimeout(filterSuggestionsTimeout);
    filterSuggestionsTimeout = setTimeout(function() {
        chrome.storage.sync.set({
            filterSuggestions: mFilterSuggestions
        }, function() {
            if (showAlert) {
                showSavedAlert();
            }
        });
    }, 500);
}

function addFilterSuggestionDiv() {
    let count = $("#filter_suggestion_count");
    var index = parseInt(count.val());

    let img = $('<img>', {
        class: "close",
        src: "../icons/cancel-black-24dp.svg",
        style: "margin-right: 0.5rem;",
        value: index
    });
    img.click(function() {
        var i, len = parseInt(count.val());
        for (i=index;i<len-1;i++) {
            document.getElementById("filter_suggestion_" + i).value = document.getElementById("filter_suggestion_" + (i+1)).value;
            mFilterSuggestions[i] = mFilterSuggestions[i+1];
        }
        $("#filter_suggestion_div_" + (len-1)).remove();
        count.val(parseInt(count.val()) - 1).trigger('change');
        mFilterSuggestions[len-1] = "";
        saveFilterSuggestions();
    });

    let filterSuggestion = $('<input>', {
        type: "text",
        class: "form-control",
        value: mFilterSuggestions[index],
        id: "filter_suggestion_" + index,
        placeholder:  "Filter Suggestion " + (index+1)
    });
    filterSuggestion.on('input', function() {
        mFilterSuggestions[index] = this.value;
        saveFilterSuggestions();
    });

    $("#filter_suggestion_container").append(
        $('<div>', {
            class: "c-inline",
            id: "filter_suggestion_div_" + index,
            style: "margin-top: 0.5rem;"
        }).append(
            img, filterSuggestion
        )
    );

    count.val(parseInt(count.val()) + 1).trigger('change');
}

function setInitialState() {
    chrome.storage.sync.get({
        shouldOpenInSameTab: true,
        questionsWithCodeFilter: false,
        communityWikisFilter: false,
        excludeDuplicateQuestionsFilter: false,
        answerTypeFilter: 0,
        customFilter: "",
        filterSuggestions: []
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

        $("#add_suggestion_filter").click(function() {
            addFilterSuggestionDiv();
        });

        $("#filter_suggestion_count").on("change", function() {
            if (this.value < 7) {
                $("#add_suggestion_filter").show();
            } else {
                $("#add_suggestion_filter").hide();
            }
        });

        var i, len = items.filterSuggestions.length;
        var latestFilterIndex = 0;
        for (i=0;i<len;i++) {
            if (items.filterSuggestions[i]) {
                mFilterSuggestions[latestFilterIndex] = items.filterSuggestions[i];
                addFilterSuggestionDiv();
                latestFilterIndex++;
            }
        }
        saveFilterSuggestions(false);
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
                customFilter: $("#custom_filter").val()
            }, function() {
                showSavedAlert();
            });
        }, 500);
    });
}

setInitialState();
setListeners();