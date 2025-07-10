const fs = require('fs');
const path = require('path');
const {
  withAppBuildGradle,
  withAndroidManifest,
  withMainApplication,
  AndroidConfig,
  createRunOncePlugin,
} = require('@expo/config-plugins');

const PLUGIN_VERSION = '1.0.0';

const expoWebEngagePlugin = (config, props = {}) => {
  const {
    environment = config.webEngage?.environment || 'in',
  } = props;

  const javaFilePath = config.webEngage?.file;
  const javaPackage = config.webEngage?.packageName;

  if (!javaFilePath || !javaPackage) {
    throw new Error(
      'WebEngage plugin: `webEngage.file` and `webEngage.packageName` must be defined in app.json'
    );
  }

  const javaClassName = 'WebEngageExpo';

  if (!withAppBuildGradle || !AndroidConfig) {
    throw new Error(
      'WebEngageExpoPlugin requires @expo/config-plugins >= 4.0.0'
    );
  }

  config = withAppBuildGradle(config, (cfg) => {
    const DEPENDENCY = `implementation 'com.webengage:android-sdk:4.+'`;
    const pattern = /^\s*dependencies\s*\{\s*$/m;
    if (!cfg.modResults.contents.includes(DEPENDENCY)) {
      if (pattern.test(cfg.modResults.contents)) {
        cfg.modResults.contents = cfg.modResults.contents.replace(
          pattern,
          (match) => `${match}\n    ${DEPENDENCY}`
        );
      } else {
        console.warn(
          'WebEngageExpoPlugin: dependencies block not found in build.gradle'
        );
      }
    }
    return cfg;
  });

  config = withAndroidManifest(config, (cfg) => {
    let app;
    try {
      app = AndroidConfig.Manifest.getMainApplicationOrThrow(cfg.modResults);
    } catch (e) {
      console.warn(
        'WebEngageExpoPlugin: <application> tag not found in AndroidManifest.xml'
      );
      return cfg;
    }

    const metaExists = app['meta-data']?.some(
      (m) => m.$['android:name'] === 'com.webengage.sdk.android.environment'
    );
    if (!metaExists) {
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        app,
        'com.webengage.sdk.android.environment',
        environment
      );
    }

    return cfg;
  });

  config = withMainApplication(config, (cfg) => {
    const importStatement = `import ${javaPackage}.${javaClassName};`;
    const initCall = `${javaClassName}.init(this);`;
    let contents = cfg.modResults.contents;

    if (!contents.includes(importStatement)) {
      contents = contents.replace(
        /^(package\s+[\w.]+;\s*)/m,
        `$1\n${importStatement}\n`
      );
    }

    if (!contents.includes(initCall)) {
      const superPattern = /super\.onCreate\(\)\s*;?/;
      if (superPattern.test(contents)) {
        contents = contents.replace(superPattern, (match) => `${match}\n    ${initCall}`);
      } else {
        console.warn(
          'WebEngageExpoPlugin: super.onCreate() not found. Init code not injected.'
        );
      }
    }

    cfg.modResults.contents = contents;
    return cfg;
  });

  config = withMainApplication(config, (cfg) => {
    const projectRoot = cfg.modRequest.projectRoot;
    const sourceFile = path.resolve(projectRoot, javaFilePath);

    const destRoot = path.join(
      projectRoot,
      'android',
      'app',
      'src',
      'main',
      'java',
      ...javaPackage.split('.')
    );
    const destFile = path.join(destRoot, `${javaClassName}.java`);

    if (!fs.existsSync(sourceFile)) {
      throw new Error(`WebEngageExpoPlugin: Missing file at ${sourceFile}`);
    }

    if (!fs.existsSync(destRoot)) {
      fs.mkdirSync(destRoot, { recursive: true });
    }

    let fileContent = fs.readFileSync(sourceFile, 'utf8');
    fileContent = fileContent.replace(
      /^package\s+.*;/m,
      `package ${javaPackage};`
    );

    fs.writeFileSync(destFile, fileContent, 'utf8');

    return cfg;
  });

  return config;
};

module.exports = createRunOncePlugin(
  expoWebEngagePlugin,
  'WebEngageExpoPlugin',
  PLUGIN_VERSION
);