let gotAuthKey
let gotUserId
let gotInstallationId
let gotClientVersion
let gotInstallationDomain
let chatWebSocket

chrome.runtime.onStartup.addListener(startUp())
chrome.browserAction.onClicked.addListener(function () {
  var newURL = 'http://chattest.teamwork.com/chat'
  chrome.tabs.create({ url: newURL })
  rotateIcon()
})

chrome.webNavigation.onCommitted.addListener(function(e) {
    console.log("I recognise this page!");
        if (chatWebSocket.readyState === 'CLOSED' || chatWebSocket.readyState === 'CLOSING'){
            startUp();
            console.log("starting");
        }

      }, {url: [{ urlContains: 'chattest.teamwork.com/chat/people'}, { urlContains: 'chattest.teamwork.com/chat/rooms'}]});

 chrome.webNavigation.onHistoryStateUpdated.addListener(function(e) {
       console.log("I recognise this page! 2");
       console.log(chatWebSocket.readyState);
                if (chatWebSocket.readyState === 2 || chatWebSocket.readyState === 3){
                               startUp();
                               console.log("starting");
                }

 }, {url: [{ urlContains: 'chattest.teamwork.com/chat/people'}, { urlContains: 'chattest.teamwork.com/chat/rooms'}]});

