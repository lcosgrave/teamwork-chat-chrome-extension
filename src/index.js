let gotAuthKey
let gotUserId
let gotInstallationId
let gotClientVersion
let gotInstallationDomain
let chatWebSocket = null

chrome.runtime.onStartup.addListener(function () {
  console.log('starting up')
  chrome.cookies.get({url: 'https://www.teamwork.com', name: 'userInstallation'}, function (cookie) {
    if (cookie != null) {
      console.log('cookies found')
      startUp()
    }
  })
})

chrome.runtime.onInstalled.addListener(function () {
  console.log('installing')
  chrome.cookies.get({url: 'https://www.teamwork.com', name: 'userInstallation'}, function (cookie) {
    if (cookie != null) {
      console.log('cookies found')
      startUp()
    }
  })
})
chrome.browserAction.onClicked.addListener(function () {
  if (userInstallation != null) {
    let newURL = userInstallation + '.teamwork.com/chat'
    chrome.tabs.create({ url: newURL })
    rotateIcon()
  } else {
    chrome.tabs.create({ url: 'https://teamwork.com/chat' })
    rotateIcon()
  }
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
  changeIconOnError()
}, false)
window.addEventListener('online', function () {
  console.log('back online')
  checkWebSocketOpened()
}, false)
