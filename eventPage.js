let apiKey;

let chatWebSocket = new WebSocket("wss://chat-socks.teamwork.com");
chatWebSocket.onopen = function(event){
    console.log(event.data);
}
chatWebSocket.onmessage = function (event) {
  console.log(event.data);
}
function getUserProfile(){
    return axios.get('https://digitalcrew.teamwork.com/chat/v3/me?includeAuth=true')
    .then(function (response) {
        return response.data
    });
}

function updateBadgeCount(importantUnread){
    chrome.browserAction.setBadgeText({
        text: importantUnread.toString()
    });
}

chrome.runtime.onInstalled.addListener(function() {
    getUserProfile()
    .then(function(userProfile)  {
        updateBadgeCount(userProfile.account.counts.importantUnread);
        return userProfile;
    })
    .then(function(userProfile)  {
        apiKey = userProfile.account.user.apiKey;
    })
    .catch((error) => {
        console.error(error);
        updateBadgeCount("?");
    });
});

chrome.browserAction.onClicked.addListener(function() {
    getUserProfile()
    .then((userProfile) => {
            updateBadgeCount(userProfile.account.counts.importantUnread);
        })
    .catch((error) => {
            console.error(error);
            updateBadgeCount("?");
        });
});



