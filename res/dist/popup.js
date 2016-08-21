$(function(){
    $('#buttonEditor').bind('click', function () {
        chrome.tabs.create({url: 'editor.html'});
    });
});