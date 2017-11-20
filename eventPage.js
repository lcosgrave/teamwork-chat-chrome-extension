function setMessageCount () {
var messageCount = "00000";
chrome.browserAction.setBadgeText({text: messageCount});
}


chrome.runtime.onInstalled.addListener(function() {
  console.log('setting Message Count');
 setMessageCount();
});



