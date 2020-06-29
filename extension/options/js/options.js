var alertTimeout;

function showSavedAlert() {
    clearTimeout(alertTimeout);
    $(".alert").addClass("show");
    alertTimeout = setTimeout(function() {
        $(".alert").removeClass("show");
    }, 750);
}

function setupOptions() {

    chrome.storage.sync.get({
        shouldOpenInSameTab: true
    }, function(items) {
        if (items.shouldOpenInSameTab) {
            document.getElementById('same_tab_result').checked = true;
        } else {
            document.getElementById('new_tab_result').checked = true;
        }
    });

    $("#save_options").click(function() {
        chrome.storage.sync.set({
            shouldOpenInSameTab: $("#same_tab_result").is(":checked")
        }, function(items) {
            $(".alert").addClass("show");
            setTimeout(function() {
                $("#save_options").blur();
                $(".alert").removeClass("show");
            }, 750);
        });
    });;

}

setupOptions();