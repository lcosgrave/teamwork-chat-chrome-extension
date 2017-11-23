function startWebsocket () {
  chatWebSocket = new WebSocket('wss://chat-socks.teamwork.com')
  let pingInterval
  chatWebSocket.onopen = function (event) {
    console.log('web socket opened')
    pingInterval = setInterval(ping, 5000)
  }
  chatWebSocket.onclose = function (event) {
    console.log('web socket closed')
    clearInterval(pingInterval)
  }
}

function checkWebSocketMessages () {
  chatWebSocket.onmessage = function (event) {
    var msg = JSON.parse(event.data)
    console.log(msg)

    if (msg.name == 'authentication.request') {
      sendAuthenticationResponse()
    } else if (msg.name == 'authentication.error') {
      chatWebSocket.close()
      changeIconOnError()
    } else if (msg.name == 'room.user.active' || msg.name == 'room.message.created') {
      getUserProfile()
        .then(function (userProfile) {
          let unreadMessages = userProfile.account.counts.importantUnread
          console.log('updating count ' + unreadMessages)
          ping()
          return unreadMessages
        })
        .then(function (unreadMessages) {
          updateBadgeCount(unreadMessages)
        })
        .catch((error) => {
          console.error(error)
          updateBadgeCount('?')
        })
    }
  }
}

sendAuthenticationResponse = function () {
  var authenticationResponse = {
    contentType: 'object',
    name: 'authentication.response',
    source: {
      name: 'Teamwork Chat - Chrome Extension',
      version: '1.0.0'
    },
    contents: {
      authKey: gotAuthKey,
      userId: gotUserId,
      installationId: gotInstallationId,
      clientVersion: '0.1.0',
      installationDomain: gotInstallationDomain
    },
    nodeId: null,
    nonce: null,
    uid: null
  }
  chatWebSocket.send(JSON.stringify(authenticationResponse))
  console.log(authenticationResponse)
}

ping = function () {
  var pingObject = { contentType: 'object',
    name: 'ping',
    source: {
      name: 'Teamwork Chat - Chrome Extension',
      version: '1.0.0'
    },
    contents: { },
    nodeId: null,
    nonce: pingnonce,
    uid: null
  }
  chatWebSocket.send(JSON.stringify(pingObject))
  console.log(pingObject)
  pingnonce++
}
