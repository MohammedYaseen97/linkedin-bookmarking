function renderArticles() {
  chrome.storage.sync.get('articles', (data) => {
    const articles = data.articles || [];
    const articleList = document.getElementById('articleList');
    articleList.innerHTML = '';

    if (articles.length === 0) {
      articleList.innerHTML = '<li>No articles saved yet.</li>';
    } else {
      articles.forEach((article, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <a href="${article.link}" target="_blank">${article.title}</a>
          <button class="remove" data-index="${index}">Remove</button>
        `;
        articleList.appendChild(li);
      });

      const removeButtons = document.querySelectorAll('.remove');
      removeButtons.forEach(button => {
        button.addEventListener('click', removeArticle);
      });
    }
  });
}

function removeArticle(e) {
  const index = parseInt(e.target.getAttribute('data-index'));
  chrome.storage.sync.get('articles', (data) => {
    const articles = data.articles || [];
    articles.splice(index, 1);
    chrome.storage.sync.set({ articles }, renderArticles);
  });
}

document.addEventListener('DOMContentLoaded', renderArticles);

// Add this line for debugging
chrome.storage.sync.get('articles', (data) => console.log('Current articles:', data.articles));
