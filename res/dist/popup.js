$(function(){
    $('#buttonEditor').bind('click', function () {
        chrome.tabs.create({url: 'editor.html'});
    });
    $('#buttonMaintance').bind('click', function () {
        chrome.tabs.create({url: 'maintance.html'});
    });
});