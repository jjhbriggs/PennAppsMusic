//John Briggs, 2021
import React from "react";
import { themeColor, useTheme } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import * as colors from "../Colors";

export default ({ icon, focused }: { icon: any; focused: boolean }) => {
  const { isDarkmode } = useTheme();
  return (
    <Ionicons
      name={icon}
      style={{ marginBottom: -7 }}
      size={24}
      color={
        focused
          ? isDarkmode ? colors.primaryLight : colors.primaryDark
          : isDarkmode ? themeColor.white200 : themeColor.dark200
      }
    />
  );
};


