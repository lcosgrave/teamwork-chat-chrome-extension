let gotAuthKey;
let gotUserId;
let gotInstallationId;
let gotClientVersion;
let gotInstallationDomain;


    let chatWebSocket = new WebSocket("wss://chat-socks.teamwork.com");
     chatWebSocket.onmessage = function (event) {
         var msg = JSON.parse(event.data);
         console.log(msg);











}
sendAuthenticationResponse = function () {
    var authenticationResponse = {
                             source: {
                             name: 'Teamwork Chat - Chrome Extension',
                             version: '1.0.0'
                             },
                             contents: {
                             authKey: gotAuthKey,
                             userId:  gotUserId,
                             installationId: gotInstallationId,
                             clientVersion: '1.0.0',
                             installationDomain: gotInstallationDomain,
                             status: null
                             }
                               }
    chatWebSocket.send(authenticationResponse);
    console.log(authenticationResponse);

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
        gotAuthKey = userProfile.account.authkey;
        gotUserId = userProfile.account.user.id;
        gotInstallationId = userProfile.account.installationId;
        gotInstallationDomain = userProfile.account.url;
    
    })
    .then(function(){
        sendAuthenticationResponse();
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




