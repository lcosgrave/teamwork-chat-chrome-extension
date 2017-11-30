let canvas = document.getElementById('canvas')
let canvasContext = canvas.getContext('2d')
let icon = document.getElementById('icon')
let previousImportantUnread = 0

function updateBadgeCount (importantUnread) {
  chrome.browserAction.setBadgeText({
    text: importantUnread.toString()
  })
  if (importantUnread > previousImportantUnread) {
    rotateIcon()
  }
  previousImportantUnread = importantUnread
}

function setIcon () {
    chrome.browserAction.setBadgeBackgroundColor({color: '#3B3E4A'})
  canvasContext.drawImage(icon, 0, 0)
  chrome.browserAction.setIcon({
    imageData: canvasContext.getImageData(0, 0, 19, 19)
  })
}

function rotateIcon () {
  let numberOfRotations = 0
  let interval = setInterval(function () {
    numberOfRotations++
    if (numberOfRotations > 36) {
      numberOfRotations = 0
      clearInterval(interval)
    }
    canvasContext.clearRect(0, 0, canvas.width, canvas.height)
    canvasContext.save()
    canvasContext.translate(canvas.width / 2, canvas.height / 2)
    canvasContext.rotate(10 * numberOfRotations * (Math.PI / 180))
    canvasContext.drawImage(icon, -canvas.width / 2, -canvas.width / 2)
    canvasContext.restore()
    chrome.browserAction.setIcon({imageData: canvasContext.getImageData(0, 0, canvas.width, canvas.height)})
  }, 20)
}

function changeIconOnError () {
  updateBadgeCount('?')
  chrome.browserAction.setPopup({ popup: 'src/notloggedinpopup.html' })
  chrome.browserAction.setIcon({
    path: {
      '16': '../../res/chat_icon_greyscale.png'
    }
  })
}
