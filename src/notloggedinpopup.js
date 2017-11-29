document.getElementById('loginbutton').onclick = function () {
  console.log('clicked')
  chrome.tabs.create({ url: 'https://teamwork.com/chat' })
}
