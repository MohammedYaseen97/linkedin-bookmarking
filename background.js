chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ articles: [] });
  chrome.alarms.create('reminderAlarm', { periodInMinutes: 60 });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'addArticle') {
    chrome.storage.sync.get('articles', (data) => {
      const articles = data.articles || [];
      if (articles.length < 7) {
        articles.push(request.article);
        chrome.storage.sync.set({ articles }, () => {
          sendResponse({ success: true });
        });
      } else {
        sendResponse({ success: false, message: 'Todo list is full' });
      }
    });
    return true; // Indicates that the response is sent asynchronously
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'reminderAlarm') {
    chrome.storage.sync.get('articles', (data) => {
      const articles = data.articles || [];
      if (articles.length > 0) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'images/icon128.png',
          title: 'LinkedIn Article Reminder',
          message: 'You have articles in your todo list. Time to read!'
        });
      }
    });
  }
});
