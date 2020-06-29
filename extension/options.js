
let optionalPermissionsList = ['storage']

function checkOptionalPermissions(onPermissionsAvailable, onPermissionsUnavailable) {
    chrome.permissions.contains({
        permissions: optionalPermissionsList
    }, function(result) {
        if (result) {
            onPermissionsAvailable();
        } else {
            onPermissionsUnavailable();
        }
    });
}

function disableOptionsElements() {
    document.getElementById('same_tab_radio').disabled = true
    document.getElementById('add_tab_radio').disabled = true
    document.getElementById('save').disabled = true
}

function enableOptionsElements() {
    document.getElementById('same_tab_radio').disabled = false
    document.getElementById('add_tab_radio').disabled = false
    document.getElementById('save').disabled = false
}

function saveOptions() {
    var sameTabChecked = document.getElementById('same_tab_radio').checked;
    chrome.storage.sync.set({
        shouldOpenInSameTab: sameTabChecked
    }, function() {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

function restoreOptions() {
    chrome.storage.sync.get({
        shouldOpenInSameTab: true
    }, function(items) {
        document.getElementById('same_tab_radio').checked = items.shouldOpenInSameTab;
    });
}

function setupOptionsPage() {
    let requestPermButton = document.getElementById('permission_request');
    requestPermButton.parentNode.removeChild(requestPermButton);
    document.addEventListener('DOMContentLoaded', restoreOptions);
    document.getElementById('save').addEventListener('click', saveOptions);
}

function requestOptionalPermissions() {
    chrome.permissions.request({
        permissions: optionalPermissionsList
      }, function(granted) {
        if (granted) {
          setupOptionsPage();
        } else {
          // Showing warning feels a bit obnoxious, so let's just ignore it.
          // User should realize that permission is needed, since it's the only enabled button.
        }
      });
}

checkOptionalPermissions(function onPermissionsAvailable() {
    setupOptionsPage();
}, function onPermissionsUnavailable() {
    let requestPermButton = document.getElementById('permission_request');
    // requestPermButton.addEventListener('click', requestOptionalPermissions);
    requestOptionalPermissions();
})
