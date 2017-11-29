chrome.storage.local.get('userName', function (data) {
  document.getElementById('name').innerHTML = data.userName
})
chrome.storage.local.get('userCompany', function (data) {
  document.getElementById('company').innerHTML = data.userCompany
})
chrome.storage.local.get('userTitle', function (data) {
  document.getElementById('title').innerHTML = data.userTitle
})
chrome.storage.local.get('userHandle', function (data) {
  document.getElementById('handle').innerHTML = data.userHandle
})
chrome.storage.local.get('userAvatar', function (data) {
  document.getElementById('avatar').src = data.userAvatar
})

function getInstallationURL () {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('userInstallation', function (data) {
      let installationURL = data.userInstallation + '.teamwork.com/chat'
      resolve(installationURL)
    })
  })
}
document.getElementById('gotochatbutton').onclick = function () {
  console.log('clicked')
  getInstallationURL()
    .then(function (installationURL) {
      chrome.tabs.create({url: installationURL})
    })
}
