function renderArticles(articles) {
  console.log('Rendering articles:', articles);
  const articleList = document.getElementById('articleList');
  articleList.innerHTML = '';

  if (articles.length === 0) {
    articleList.innerHTML = '<li>No posts saved yet.</li>';
    return;
  }

  articles.forEach((article, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="drag-handle">☰</span>
      <a href="${article.link}" target="_blank">${article.title || 'Untitled Post'}</a>
      <button class="mark-read">✓</button>
    `;

    li.querySelector('.mark-read').addEventListener('click', () => {
      articles.splice(index, 1);
      chrome.runtime.sendMessage({ action: 'updateArticles', articles: articles }, () => {
        renderArticles(articles);
      });
    });

    articleList.appendChild(li);
  });

  // Enable drag and drop functionality
  new Sortable(articleList, {
    animation: 150,
    handle: '.drag-handle',
    onEnd: () => {
      const newOrder = Array.from(articleList.children).map(li => {
        const link = li.querySelector('a').href;
        return articles.find(article => article.link === link);
      });
      chrome.runtime.sendMessage({ action: 'updateArticles', articles: newOrder });
    }
  });
}

chrome.runtime.sendMessage({ action: 'getArticles' }, (response) => {
  console.log('Received articles from background:', response.articles);
  renderArticles(response.articles);
});
