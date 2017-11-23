let pingnonce = 1
function getUserProfile () {
  return axios.get('https://chattest.teamwork.com/chat/v3/me?includeAuth=true')
    .then(function (response) {
      return response.data
    })
}

function startUp () {
  setIcon()
  getUserProfile()
    .then(function (userProfile) {
      let unreadMessages = userProfile.account.counts.importantUnread
      updateBadgeCount(unreadMessages)
      return userProfile
    })
    .then(function (userProfile) {
      gotAuthKey = userProfile.account.authkey
      gotUserId = userProfile.account.user.id
      gotInstallationId = userProfile.account.installationId
      gotInstallationDomain = userProfile.account.url
    })
    .then(function () {
      startWebsocket()
      checkWebSocketMessages()
    })
    .catch((error) => {
      console.error(error)
      changeIconOnError()
    })
}


