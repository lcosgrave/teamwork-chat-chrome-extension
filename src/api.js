let pingnonce = 1
let userInstallation

function getUserProfile () {
  return new Promise((resolve, reject) => {
    if (userInstallation != null) {
      let userProfile = getUserProfileFromVariable()
      resolve(userProfile)
    } else {
      chrome.storage.local.get('userInstallation', function (data) {
        if (data.userInstallation == null) {
          let userProfile = getUserProfileFromWebAddress()
          resolve(userProfile)
        } else {
          let userProfile = getUserProfileFromLocalStorage()
          resolve(userProfile)
        }
      })
    }
  })
}

function getUserProfileFromWebAddress () {
  return new Promise((resolve, reject) => {
    getTab()
      .then(function (tabURL) {
        return getInstallationURL(tabURL)
      })
      .then(function (installationName) {
        userInstallation = installationName
        let installationURL = installationName + '.teamwork.com/chat/v3/me?includeAuth=true'
        return axios.get(installationURL)
      })
      .then(function (response) {
        chrome.storage.local.set({userInstallation: userInstallation})
        resolve(response.data)
      })
      .catch((error) => {
        console.error(error)
        changeIconOnError()
        clearData()
      })
  })
}

function getUserProfileFromLocalStorage () {
  return new Promise((resolve, reject) => {
    getLocallyStoredProfile()
      .then(function (installation) {
        userInstallation = installation
        let installationURL = userInstallation + '.teamwork.com/chat/v3/me?includeAuth=true'
        return axios.get(installationURL)
      })
      .then(function (response) {
        resolve(response.data)
      })
      .catch((error) => {
        console.error(error)
        changeIconOnError()
      })
  })
}

function getUserProfileFromVariable () {
  return new Promise((resolve, reject) => {
    getUserProfileFromVariableHTTPRequest()
      .then(function (response) {
        resolve(response.data)
      })
  })
}

function getUserProfileFromVariableHTTPRequest () {
  return new Promise((resolve, reject) => {
    let installationURL = userInstallation + '.teamwork.com/chat/v3/me?includeAuth=true'
    resolve(axios.get(installationURL))
  })
}
function getLocallyStoredProfile () {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('userInstallation', function (data) {
      resolve(data.userInstallation)
    })
  })
}

function getTab () {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
      let tab = tabs[0]
      resolve(tab.url)
    })
  })
}

function startUp () {
  setIcon()
  getUserProfile()
    .then(function (userProfile) {
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
      gotApiKey = userProfile.account.user.apiKey
      let userName = userProfile.account.user.firstName + ' ' + userProfile.account.user.lastName
      chrome.storage.local.set({userName: userName})
      let userCompany = userProfile.account.user.company.name
      chrome.storage.local.set({userCompany: userCompany})
      let userTitle = userProfile.account.user.title
      chrome.storage.local.set({userTitle: userTitle})
      let userInstallationName = userProfile.account.installationName
      chrome.storage.local.set({userInstallationName: userInstallationName})
      let userAvatar = userProfile.account.user.avatar
      chrome.storage.local.set({userAvatar: userAvatar})
    })
    .then(function () {
            startWebsocket()
            checkWebSocketMessages()
        })
    .then(function () {
      chrome.browserAction.setPopup({ popup: 'src/loggedinpopup.html' })
    })
    .catch((error) => {
      console.error(error)
      changeIconOnError()
    })
}

function clearData () {
  chrome.storage.local.clear()
    gotAuthKey = null
    gotUserId = null
    gotInstallationId = null
    gotClientVersion = null
    gotInstallationDomain = null
    gotApiKey = null
    userInstallation = null
    }

function getInstallationURL (tablink) {
  let currentUrl = tablink
  let dotIndex = currentUrl.indexOf('.')
  let installation = currentUrl.substring(0, dotIndex)
  return installation
}
