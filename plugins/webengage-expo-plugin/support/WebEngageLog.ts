export class WebEngageLog {
  static log(str: string) {
    console.log(`\twebengage-expo-plugin: ${str}`);
  }

  static error(str: string) {
    console.error(`\twebengage-expo-plugin: ${str}`);
  }
}
