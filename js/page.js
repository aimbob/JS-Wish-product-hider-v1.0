$(function() {
    var page = new PageController(document);
});

// refresh page when settings changed
browser.storage.onChanged.addListener(function(changes, area) {
    location.reload();
});