//John Briggs, 2021
import React, { useContext } from "react";

import { NavigationContainer } from "@react-navigation/native";

import Main from "./MainStack";
import Loading from "../screens/utils/Loading";

export default () => {
  return (
    <NavigationContainer>
      {<Main />}
    </NavigationContainer>
  );
};
