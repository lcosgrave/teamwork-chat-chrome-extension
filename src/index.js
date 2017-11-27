let gotAuthKey
let gotUserId
let gotInstallationId
let gotClientVersion
let gotInstallationDomain
let chatWebSocket = null

// chrome.runtime.onStartup.addListener(startUp())
chrome.browserAction.onClicked.addListener(function () {
  getUserProfile()
    .then(function (userInstallation) {
      let newURL = userInstallation + '.teamwork.com/chat'
      chrome.tabs.create({ url: newURL })
      rotateIcon()
    })
})

chrome.webNavigation.onHistoryStateUpdated.addListener(function (e) {
  console.log('I recognise this page! 2')

  if (chatWebSocket === null) {
    startUp()
    console.log('starting null websocket')
  } else if (!(chatWebSocket.readyState === 0 || chatWebSocket.readyState === 1)) {
    startUp()
    console.log('starting')
  }
}, {url: [{urlContains: '.teamwork.com/chat/people'}, {urlContains: '.teamwork.com/chat/rooms'}]})

window.addEventListener('offline', function () {
  console.log('gone offline')
  closeWebSocket()
}, false)
window.addEventListener('online', function () {
  console.log('back online')
  checkWebSocketOpened()
}, false)
