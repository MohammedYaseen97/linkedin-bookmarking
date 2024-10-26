function addHoverEffect() {
  const articles = document.querySelectorAll('.feed-shared-update-v2');
  
  articles.forEach(article => {
    if (article.querySelector('.add-to-list-btn')) return; // Skip if button already exists

    article.addEventListener('mouseover', () => {
      article.style.border = '2px solid red';
      article.querySelector('.add-to-list-btn').style.display = 'block';
    });

    article.addEventListener('mouseout', () => {
      article.style.border = 'none';
      article.querySelector('.add-to-list-btn').style.display = 'none';
    });

    const addButton = document.createElement('button');
    addButton.textContent = '+';
    addButton.className = 'add-to-list-btn';
    addButton.style.display = 'none';
    
    addButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const title = article.querySelector('.feed-shared-article__title')?.textContent.trim();
      const link = article.querySelector('.feed-shared-article__meta a')?.href;
      
      if (title && link) {
        chrome.runtime.sendMessage({
          action: 'addArticle',
          article: { title, link }
        }, (response) => {
          if (response && response.success) {
            addButton.textContent = '✓';
            setTimeout(() => {
              addButton.textContent = '+';
            }, 2000);
          } else {
            addButton.textContent = '!';
            setTimeout(() => {
              addButton.textContent = '+';
            }, 2000);
          }
        });
      }
    });

    article.style.position = 'relative';
    article.appendChild(addButton);
  });
}

// Run the function when the page loads
addHoverEffect();

// Use a MutationObserver to handle dynamically loaded content
const observer = new MutationObserver(addHoverEffect);
observer.observe(document.body, { childList: true, subtree: true });
