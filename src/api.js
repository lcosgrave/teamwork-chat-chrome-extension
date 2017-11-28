let pingnonce = 1
let userInstallation
let userProfileFound = false

function getUserProfile () {
  return new Promise((resolve, reject) => {
    if (userInstallation != null) {
      let userProfile = getUserProfileFromVariable()
      resolve(userProfile)
    } else {
      chrome.cookies.get({url: 'https://www.teamwork.com', name: 'userInstallation'}, function (cookie) {
        if (cookie === null) {
          console.log('no cooookies')
          let userProfile = getUserProfileFromWebAddress()
          resolve(userProfile)
        } else {
          console.log('cookiiee')
          let userProfile = getUserProfileFromCookie()
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
        chrome.cookies.set({url: 'https://www.teamwork.com', name: 'userInstallation', value: userInstallation, expirationDate: 2237706996})
        userProfileFound = true
        resolve(response.data)
      })
      .catch((error) => {
        console.error(error)
        changeIconOnError()
      })
  })
}

function getUserProfileFromCookie () {
  return new Promise((resolve, reject) => {
    getCookie()
      .then(function (cookieValue) {
        userInstallation = cookieValue
        console.log('got it ' + cookieValue)
        let installationURL = cookieValue + '.teamwork.com/chat/v3/me?includeAuth=true'
        return axios.get(installationURL)
      })
      .then(function (response) {
        userProfileFound = true
        resolve(response.data)
      })
      .catch((error) => {
        getUserProfileFromWebAddress()
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
function getCookie () {
  return new Promise((resolve, reject) => {
    chrome.cookies.get({url: 'https://www.teamwork.com', name: 'userInstallation'}, function (cookie) {
      console.log(cookie.value)
      resolve(cookie.value)
    })
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
      console.log('user profile: ' + userProfile)
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
  let currentUrl = tablink
  let dotIndex = currentUrl.indexOf('.')
  let installation = currentUrl.substring(0, dotIndex)
  return installation
}
