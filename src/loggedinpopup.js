 let canvas = document.getElementById('canvas')
 let context = canvas.getContext('2d')
 let userAvatarImage = new Image();
 let userAvatar;

chrome.storage.local.get('userName', function (data) {
  document.getElementById('name').innerHTML = data.userName
})
chrome.storage.local.get('userCompany', function (data) {
  document.getElementById('company').innerHTML = data.userCompany
})
chrome.storage.local.get('userTitle', function (data) {
  document.getElementById('title').innerHTML = data.userTitle
})
chrome.storage.local.get('userInstallationName', function (data) {
  document.getElementById('installation').innerHTML = data.userInstallationName
})
chrome.storage.local.get('userAvatar', function (data) {
 userAvatarImage.src = data.userAvatar
 userAvatarImage.onload = function() {
context.drawImage(userAvatarImage, 0, 0,  canvas.width, canvas.height)
}
})

function getInstallationURL () {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('userInstallation', function (data) {
      let installationURL = data.userInstallation
      resolve(installationURL)
    })
  })
}
document.getElementById('chatlogo').onclick = function () {
  getInstallationURL()
    .then(function (installationURL) {
      chrome.tabs.create({url: installationURL + '.teamwork.com/chat'})
    })
}

document.getElementById('gotochatbutton').onclick = function () {
  getInstallationURL()
    .then(function (installationURL) {
      chrome.tabs.create({url: installationURL + '.teamwork.com/chat'})
    })
}

document.getElementById('logoutbutton').onclick = function () {
  console.log('clicked')
  getInstallationURL()
    .then(function (installationURL) {
        let logoutURL = installationURL + '.teamwork.com/launchpad/v1/logout.json'
        axios.put(logoutURL)
    .then(function() {
        chrome.runtime.sendMessage({loginStatus: "logged out"})
        window.close();
    })
    })
}

canvas.onmouseover = function () {
rotateCanvas()
}

canvas.onclick = function () {
rotateCanvas()
getInstallationURL()
    .then(function (installationURL) {
      chrome.tabs.create({url: installationURL + '.teamwork.com/chat'})
    })
}

function rotateCanvas () {
  let numberOfRotations = 0
  let interval = setInterval(function () {
    numberOfRotations++
    if (numberOfRotations > 36) {
      numberOfRotations = 0
      clearInterval(interval)
    }
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.save()
    context.translate(canvas.width / 2, canvas.height / 2)
    context.rotate(10 * numberOfRotations * (Math.PI / 180))
    context.drawImage(userAvatarImage, -canvas.width / 2, -canvas.width / 2,canvas.height, canvas.width)
    context.restore()
  }, 20)
}