# LinkedIn Post Saver

## Description

LinkedIn Post Saver is a Chrome extension that allows users to save and manage LinkedIn posts for later reading. It's designed to help professionals keep track of interesting content they come across while browsing LinkedIn, without interrupting their workflow.

## Features

- Save LinkedIn posts with a single click
- Store up to 7 posts at a time
- View saved posts in a convenient popup
- Rearrange saved posts using drag-and-drop
- Mark posts as read to remove them from the list
- Receive hourly reminders to read saved posts

## Installation

1. Clone this repository or download the ZIP file and extract it.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## Usage

1. Browse LinkedIn as usual.
2. When you find a post you want to save, hover over it to reveal a red border and a "+" button.
3. Click the "+" button to save the post.
4. Click the extension icon in the Chrome toolbar to view your saved posts.
5. In the popup, you can:
   - Click on a post title to open it in a new tab
   - Drag and drop posts to reorder them
   - Click the checkmark button to mark a post as read and remove it from the list
6. Every hour, you'll receive a notification reminding you to read your most recently saved post.

## Files and Structure

- `manifest.json`: Extension configuration
- `background.js`: Handles background processes and notifications
- `content.js`: Injects the save button and handles post extraction
- `content.css`: Styles for the injected save button
- `popup.html`: HTML structure for the extension popup
- `popup.js`: Handles the functionality of the popup
- `popup.css`: Styles for the popup
- `images/`: Contains icon files for the extension

## Development

To modify or extend the extension:

1. Make changes to the relevant files.
2. If you modify `manifest.json`, you may need to reload the extension in Chrome.
3. For other files, you can usually just refresh the LinkedIn page to see your changes.

## Permissions

This extension requires the following permissions:

- `storage`: To store saved posts
- `alarms`: To set hourly reminders
- `notifications`: To display reminder notifications
- `https://www.linkedin.com/*`: To interact with LinkedIn pages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.
