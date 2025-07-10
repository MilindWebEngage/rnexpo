const {
  withAppBuildGradle,
  withAndroidManifest,
  withMainApplication,
  createRunOncePlugin,
  AndroidConfig,
} = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const PLUGIN_NAME = 'WebEngageExpoNativePushPlugin';
const PLUGIN_VERSION = '1.0.0';
const FIREBASE_DEPENDENCY = `implementation 'com.google.firebase:firebase-messaging:23.+'`;
const GOOGLE_SERVICES_PLUGIN_ID = 'com.google.gms.google-services';
const WEBENGAGE_SERVICE_NAME = 'MyFirebaseMessagingService';
const MESSAGING_EVENT_ACTION = 'com.google.firebase.MESSAGING_EVENT';

function configureAppBuildGradle(config) {
  return withAppBuildGradle(config, (cfg) => {
    let { contents } = cfg.modResults;

    if (/^\s*plugins\s*\{/.test(contents)) {
      if (!contents.includes(`id("${GOOGLE_SERVICES_PLUGIN_ID}")`)) {
        contents = contents.replace(/plugins\s*\{/, `plugins {\n    id("${GOOGLE_SERVICES_PLUGIN_ID}")`);
      }
    } else if (!contents.includes(`apply plugin: "${GOOGLE_SERVICES_PLUGIN_ID}"`)) {
      contents = `apply plugin: "${GOOGLE_SERVICES_PLUGIN_ID}"\n${contents}`;
    }

    if (!contents.includes(FIREBASE_DEPENDENCY)) {
      contents = contents.replace(/dependencies\s*\{/, `dependencies {\n    ${FIREBASE_DEPENDENCY}`);
    }

    cfg.modResults.contents = contents;
    return cfg;
  });
}

function injectFcmRegistration(config) {
  return withMainApplication(config, (cfg) => {
    const methodCall = 'WebEngageExpo.registerFcmToken();';
    let contents = cfg.modResults.contents;

    if (!contents.includes(methodCall)) {
      contents = contents.replace(/super\.onCreate\(\);?/, match => `${match}\n    ${methodCall}`);
    }

    cfg.modResults.contents = contents;
    return cfg;
  });
}


function createFirebaseService(config) {
  return withAndroidManifest(config, (cfg) => {
    const projectRoot = config._internal.projectRoot;
    const packageName = cfg.android.package || config.package;
    const serviceFile = path.join(projectRoot, 'plugins', `${WEBENGAGE_SERVICE_NAME}.java`);
    const javaDestPath = path.join(
      projectRoot,
      'android', 'app', 'src', 'main', 'java',
      ...packageName.split('.'),
      `${WEBENGAGE_SERVICE_NAME}.java`
    );

    if (!fs.existsSync(serviceFile)) {
      throw new Error(`Missing ${WEBENGAGE_SERVICE_NAME}.java. Please place it in ./plugins and try again.`);
    }

    fs.mkdirSync(path.dirname(javaDestPath), { recursive: true });
    let contents = fs.readFileSync(serviceFile, 'utf8');
    contents = contents.replace(/^package\s+.*;/m, `package ${packageName};`);
    fs.writeFileSync(javaDestPath, contents);

    const mainApp = AndroidConfig.Manifest.getMainApplicationOrThrow(cfg.modResults);
    const serviceEntry = {
      $: {
        'android:name': `.${WEBENGAGE_SERVICE_NAME}`,
        'android:exported': 'false'
      },
      'intent-filter': [{
        action: [{ $: { 'android:name': MESSAGING_EVENT_ACTION } }]
      }]
    };

    if (!mainApp.service) mainApp.service = [];
    if (!mainApp.service.find(s => (s.$?.['android:name'] || s.attributes?.['android:name']) === serviceEntry.$['android:name'])) {
      mainApp.service.push(serviceEntry);
    } else {
      console.warn(`[${PLUGIN_NAME}] Service entry already present in AndroidManifest`);
    }

    return cfg;
  });
}

module.exports = createRunOncePlugin(
  (config) => {
    config = configureAppBuildGradle(config);
    config = injectFcmRegistration(config);
    config = createFirebaseService(config);
    return config;
  },
  PLUGIN_NAME,
  PLUGIN_VERSION
);
