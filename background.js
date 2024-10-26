let articles = [];

function loadArticles() {
  chrome.storage.local.get('articles', (result) => {
    if (result.articles) {
      articles = result.articles;
      console.log('Loaded articles:', articles);
    }
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ articles: [] });
  chrome.alarms.create('checkArticles', { periodInMinutes: 60 });
  loadArticles();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);
  if (request.action === 'addArticle') {
    if (articles.length < 7) {
      articles.push(request.article);
      chrome.storage.local.set({ articles: articles }).then(() => {
        console.log('Article added, updated list:', articles);
        sendResponse({ success: true });
      });
    } else {
      console.log('List is full, cannot add more articles');
      sendResponse({ success: false, message: 'List is full' });
    }
  } else if (request.action === 'getArticles') {
    console.log('Sending articles:', articles);
    sendResponse({ articles: articles });
  } else if (request.action === 'updateArticles') {
    articles = request.articles;
    chrome.storage.local.set({ articles: articles }).then(() => {
      console.log('Articles updated:', articles);
      sendResponse({ success: true });
    });
  }
  return true;
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkArticles') {
    if (articles.length > 0) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/icon128.png',
        title: 'LinkedIn Article Reminder',
        message: 'Time to read your most recent saved article!',
        buttons: [{ title: 'Open Article' }],
        priority: 2
      });
    }
  }
});

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (buttonIndex === 0) {
    const mostRecentArticle = articles[articles.length - 1];
    chrome.tabs.create({ url: mostRecentArticle.link });
  }
});

// Load saved articles on startup
loadArticles();
