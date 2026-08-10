import { Platform } from "react-native";

export const IS_ANDROID = Platform.OS === "android";

export const platformPick = (iosValue, androidValue) =>
  (IS_ANDROID ? androidValue : iosValue);
