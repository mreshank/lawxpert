// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable experimental features for SDK 53
  isCSSEnabled: true,
});

// Define specific folders to watch instead of the entire node_modules
const projectRoot = __dirname;
const nodeModulesPath = path.resolve(projectRoot, 'node_modules');

// Extremely aggressive file watcher reduction
config.watchFolders = [projectRoot];
config.resolver.blockList = [
  /node_modules\/.*\/node_modules\/(?!react-native|expo|@expo|@react-native|@babel\/runtime)/,
];

// Optimize resolver
config.resolver.disableHierarchicalLookup = true;
config.resolver.nodeModulesPaths = [nodeModulesPath];

// Disable source maps in development to reduce load
config.transformer.minifierConfig = {
  mangle: {
    toplevel: true,
  },
  compress: {
    unused: true,
    dead_code: true,
    global_defs: {
      __DEV__: false,
    },
  },
};

// Cache optimization
config.cacheStores = [
  new (require('metro-cache')).FileStore({
    root: path.join(projectRoot, 'node_modules/.cache/metro'),
  }),
];

module.exports = config; 