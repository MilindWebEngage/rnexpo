module.exports = {
  expo: {
    name: "MyPOCApp",
    slug: "MyPOCApp",
    version: "1.0.1",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "mypocapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    webEngage: {
      "licenseCode": "~1341056cd",
      "environment": "us",
      "debugMode": true,
      "file": "./plugins/WebEngageExpo.java",
      "packageName": "com.webengage.reactSample",
      "messagingServiceFile": "./webengage/MyFirebaseMessagingService.java"

    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.webEngage.prodSwift"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      googleServicesFile: "./google-services.json",
      package: "com.webengage.reactSample"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      "react-native-edge-to-edge",
      // "./plugins/expo-webengage-core", // 👈 Add this line to include your custom plugin
      // "./plugins/expo-webengage-native-push", // 👈 Add this line to include your custom plugin
      //"./plugins/expo-plugin-ios-push",
      [
        "./plugins/webengage-expo-plugin",
        {
          mode: "development",
        }
      ],

      [
        "./plugins/webengage-expo-ios-core/src/withWebEngage",
        {
          push: {
            mode: "development"
          },
          ios: {
            WEGLicenseCode: "d3a4b5a9",
            WEGLogLevel: "VERBOSE",
            WEGEnvironment: "DEFAULT",
            WEGAutoRegister: true
          }
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "51011d93-9048-43b3-b646-84b05ca02a94"
      }
    }
  }
};
