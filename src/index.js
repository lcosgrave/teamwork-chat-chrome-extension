let gotAuthKey
let gotUserId
let gotInstallationId
let gotClientVersion
let gotInstallationDomain
let gotApiKey
let chatWebSocket = null

chrome.runtime.onStartup.addListener(function () {
  chrome.cookies.get({url: 'https://www.teamwork.com', name: 'userInstallation'}, function (cookie) {
    if (cookie != null) {
      startUp()
    }
  })
})

chrome.runtime.onInstalled.addListener(function () {
  chrome.cookies.get({url: 'https://www.teamwork.com', name: 'userInstallation'}, function (cookie) {
    if (cookie != null) {
      startUp()
    } else {
      changeIconOnError()
    }
  })
})

chrome.runtime.onMessage.addListener(function (message) {
    if(message.loginStatus === "logged out"){
    closeWebSocket()
    }
})

chrome.webNavigation.onHistoryStateUpdated.addListener(function (e) {
  if (chatWebSocket === null) {
    startUp()
  } else if (!(chatWebSocket.readyState === 0 || chatWebSocket.readyState === 1)) {
    startUp()
  }
}, {url: [{urlContains: '.teamwork.com/chat/people'}, {urlContains: '.teamwork.com/chat/rooms'}]})

window.addEventListener('offline', function () {
  closeWebSocket()
  updateBadgeCount('?')
}, false)
window.addEventListener('online', function () {
  checkWebSocketOpened()
}, false)
