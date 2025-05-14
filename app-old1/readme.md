# LawXpert Mobile App

A React Native mobile application that loads the LawXpert web application (https://lawexpert.vercel.app/) in a WebView.

## Features

- Loads the LawXpert website in a native mobile app
- Automatically redirects to the home page on app refresh/reopen
- Works on both iOS and Android
- Responsive design that adapts to all screen sizes
- Built with Expo SDK 53 for the latest features and compatibility

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

### Troubleshooting "too many open files" Error on macOS

If you encounter an "EMFILE: too many open files, watch" error on macOS, you have several options:

#### Option 1: Use the simplified app version
This is the most reliable solution for macOS file limit issues:
```bash
npm run start:simple
```
This uses a streamlined version of the app with minimal overhead.

#### Option 2: Use lightweight configuration
```bash
npm run start:lightweight
```
This reduces memory usage and the number of file watchers.

#### Option 3: Temporary fix for current session
```bash
npm run start:macos
```
This temporarily increases the file watch limit for your session.

#### Option 4: Permanent system fix
Add the following line to your shell profile (`~/.zshrc`):
```bash
ulimit -n 10240
```
Then restart your terminal or run `source ~/.zshrc`.

#### Option 5: Install Watchman
Watchman is more efficient with file watching than Node's native watcher:
```bash
brew install watchman
```

3. To run on specific platforms:
```bash
# For iOS
npm run ios

# For Android
npm run android
```

## Building for Production

### Prerequisites
- An Expo account
- EAS CLI installed: `npm install -g eas-cli`
- Follow Expo's documentation for setting up build configurations

### Build Commands
```bash
# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## SDK 53 Features

This app has been updated to use Expo SDK 53, which includes:
- Improved performance and stability
- Support for React Native 0.73.4
- Support for the latest iOS and Android versions
- Better web compatibility
- Enhanced support for different screen sizes and orientations

## Customization

- Update the `homeUrl` in App.js if the production URL changes
- Replace placeholder assets in the `assets` folder with your own icons and splash screens

## Technology Stack

- React Native 0.73.4
- Expo SDK 53
- React Native WebView 13.6.4