let gotAuthKey;
let gotUserId;
let gotInstallationId;
let gotClientVersion;
let gotInstallationDomain;
let chatWebSocket;


chrome.runtime.onInstalled.addListener(function() {
    getUserProfile()
    .then(function(userProfile)  {
       let unreadMessages = userProfile.account.counts.importantUnread;
        updateBadgeCount(unreadMessages);
        return userProfile;
    })
    .then(function(userProfile)  {
        gotAuthKey = userProfile.account.authkey;
        gotUserId = userProfile.account.user.id;
        gotInstallationId = userProfile.account.installationId;
        gotInstallationDomain = userProfile.account.url;

    })
    .then(function(){
        startWebsocket();
        checkWebSocketMessages();
        chatWebSocket.onopen = function(event){
             setInterval(ping, 5000);
             }

    })
    .catch((error) => {
        console.error(error);
        updateBadgeCount("?");
    });
});






