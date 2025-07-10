import { ConfigPlugin } from "@expo/config-plugins";
import { WebEngagePluginProps } from "../types/types";

import { withWebEngageIos } from "./withWebEngageIos";
import { validatePluginProps } from "../support/helpers";

const withWebEngage: ConfigPlugin<WebEngagePluginProps> = (config, props) => {
  // if props are undefined, throw error
  if (!props) {
    throw new Error(
      'You are trying to use the WebEngage plugin without any props. Property "mode" is required. Please see https://github.com/WebEngage/WebEngage-expo-plugin for more info.'
    );
  }

  validatePluginProps(props);

  config = withWebEngageIos(config, props);

  return config;
};

export default withWebEngage;
