function addHoverEffect() {
  const posts = document.querySelectorAll('.feed-shared-update-v2, .occludable-update');
  
  posts.forEach(post => {
    if (post.querySelector('.add-to-list-btn')) return; // Skip if button already exists

    post.addEventListener('mouseover', () => {
      post.style.border = '2px solid red';
      const addButton = post.querySelector('.add-to-list-btn');
      if (addButton) addButton.style.display = 'block';
    });

    post.addEventListener('mouseout', () => {
      post.style.border = 'none';
      const addButton = post.querySelector('.add-to-list-btn');
      if (addButton) addButton.style.display = 'none';
    });

    const addButton = document.createElement('button');
    addButton.textContent = '+';
    addButton.className = 'add-to-list-btn';
    addButton.style.display = 'none';
    
    addButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      let postInfo = extractPostInfo(post);

      if (postInfo.link) {
        console.log('Extracted post info:', postInfo);
        console.log('Sending message to add post:', postInfo);
        chrome.runtime.sendMessage({
          action: 'addArticle',
          article: postInfo
        }, (response) => {
          console.log('Received response:', response);
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
            console.error('Failed to add post:', response?.message);
          }
        });
      } else {
        console.error('Failed to extract post link');
        console.log('Post HTML:', post.outerHTML);
        alert('Unable to save this post. Please try a different one.');
        addButton.textContent = '!';
        setTimeout(() => {
          addButton.textContent = '+';
        }, 2000);
      }
    });

    post.style.position = 'relative';
    post.appendChild(addButton);
  });
}

function extractPostInfo(post) {
  let link = null;
  let title = '';

  console.log('Extracting post info from:', post);

  // Try to find the post URL
  const possibleLinkElements = [
    post.querySelector('.feed-shared-actor__container a'),
    post.querySelector('.feed-shared-actor__sub-description a'),
    post.querySelector('.feed-shared-text a'),
    post.querySelector('.feed-shared-article__meta a'),
    post.querySelector('.update-components-actor__container a'),
    post.querySelector('.update-components-text a'),
    post.querySelector('.feed-shared-update-v2__content a'),
    post.querySelector('.feed-shared-mini-update-v2__content a'),
    post.querySelector('a[data-control-name="update_topbar_actor"]'),
  ];

  for (const element of possibleLinkElements) {
    if (element && element.href) {
      console.log('Checking link:', element.href);
      const match = element.href.match(/\/feed\/update\/urn:li:activity:(\d+)/);
      if (match) {
        link = `https://www.linkedin.com/feed/update/urn:li:activity:${match[1]}`;
        console.log('Found matching link:', link);
        break;
      }
    }
  }

  // If we still don't have a link, try to find any link in the post
  if (!link) {
    const anyLink = post.querySelector('a[href^="https://www.linkedin.com/feed/update/"]');
    if (anyLink) {
      link = anyLink.href;
      console.log('Found any link:', link);
    }
  }

  // If we still don't have a link, try to construct one from the post's data-urn attribute
  if (!link) {
    const urn = post.getAttribute('data-urn');
    if (urn) {
      const match = urn.match(/urn:li:activity:(\d+)/);
      if (match) {
        link = `https://www.linkedin.com/feed/update/urn:li:activity:${match[1]}`;
        console.log('Constructed link from data-urn:', link);
      }
    }
  }

  // Try to extract a title or summary of the post
  const possibleTitleElements = [
    post.querySelector('.feed-shared-text'),
    post.querySelector('.feed-shared-article__title'),
    post.querySelector('.update-components-text'),
    post.querySelector('.update-components-article__title'),
    post.querySelector('.feed-shared-mini-update-v2__reshared-content-text'),
    post.querySelector('.feed-shared-update-v2__description'),
    post.querySelector('.feed-shared-actor__title'),
  ];

  for (const element of possibleTitleElements) {
    if (element && element.textContent.trim()) {
      title = element.textContent.trim().substring(0, 100) + (element.textContent.length > 100 ? '...' : '');
      console.log('Found title:', title);
      break;
    }
  }

  // If we still don't have a title, use a generic one
  if (!title) {
    title = 'LinkedIn Post';
    console.log('Using generic title');
  }

  console.log('Final extracted link:', link);
  console.log('Final extracted title:', title);

  return {
    link,
    title,
    timestamp: Date.now()
  };
}

// Run the function when the page loads
addHoverEffect();

// Use a MutationObserver to handle dynamically loaded content
const observer = new MutationObserver(addHoverEffect);
observer.observe(document.body, { childList: true, subtree: true });
