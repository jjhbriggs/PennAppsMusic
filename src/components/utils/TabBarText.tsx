//John Briggs, 2021
import React from "react";
import { Text, themeColor, useTheme } from "react-native-rapi-ui";
import * as colors from "../Colors";
export default ({ title, focused }: { title: string; focused: boolean }) => {
  const { isDarkmode } = useTheme();
  return (
    <Text
      fontWeight="bold"
      style={{
        marginBottom: 5,
        color: focused
          ? isDarkmode ? colors.primaryLight : colors.primaryDark
          : isDarkmode ? colors.neutralLight : colors.neutralDark,
        fontSize: 10,
      }}
    >
      {title}
    </Text>
  );
};
