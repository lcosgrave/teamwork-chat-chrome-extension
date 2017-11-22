function startWebsocket() {
chatWebSocket = new WebSocket("wss://chat-socks.teamwork.com");
}

function checkWebSocketMessages() {
 chatWebSocket.onmessage = function (event) {
             var msg = JSON.parse(event.data);
             console.log(msg);

             if(msg.name == "authentication.request"){
                 sendAuthenticationResponse();
             }
             else if(msg.name == "room.user.active" || msg.name == "room.message.created"){
                          getUserProfile()
                             .then(function(userProfile)  {
                                 let unreadMessages = userProfile.account.counts.importantUnread;
                                  console.log("updating count " + unreadMessages);
                                  ping();
                                  return unreadMessages;
                              })
                              .then(function(unreadMessages)  {
                              updateBadgeCount(unreadMessages);
                              })
                              .catch((error) => {
                                            console.error(error);
                                            updateBadgeCount("?");
                                        });

             }

        }
}