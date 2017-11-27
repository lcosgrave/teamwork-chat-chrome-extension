let pingnonce = 1
let userProfileFound = false
let userInstallation
function getUserProfile () {
  return new Promise((resolve, reject) => {
    if (userProfileFound === false) {
      console.log('user profile found is false')
      getTab()
        .then(function (tabURL) {
          return getInstallationURL(tabURL)
        })
        .then(function (installationName) {
          userInstallation = installationName
          let installationURL = installationName + '.teamwork.com/chat/v3/me?includeAuth=true'
          userProfile = installationURL
          return axios.get(installationURL)
        })
        .then(function (response) {
          resolve(response.data)
        })
        .catch((error) => {
          console.error(error)
          changeIconOnError()
        })
    } else {
      console.log(userInstallation)
      resolve(userInstallation)
    }
  })
}

function getTab () {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
      let tab = tabs[0]
      console.log(tab.url)
      resolve(tab.url)
    })
  })
}

function startUp () {
  setIcon()
  getUserProfile()
    .then(function (userProfile) {
      console.log(userProfile)
      userProfileFound = true
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

function getInstallationURL (tablink) {
  console.log(tablink)
  let currentUrl = tablink
  let dotIndex = currentUrl.indexOf('.')
  console.log(dotIndex)
  let installation = currentUrl.substring(0, dotIndex)
  console.log(installation)
  return installation
}
