import { NativeModule, requireNativeModule } from "expo";

declare class WebengageExpoIosCoreModule extends NativeModule {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<WebengageExpoIosCoreModule>(
  "WebengageExpoIosCore"
);
