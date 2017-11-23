let pingnonce = 1
function getUserProfile () {
  return axios.get('https://chattest.teamwork.com/chat/v3/me?includeAuth=true')
    .then(function (response) {
      return response.data
    })
}

function updateBadgeCount (importantUnread) {
  chrome.browserAction.setBadgeText({
    text: importantUnread.toString()
  })
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
