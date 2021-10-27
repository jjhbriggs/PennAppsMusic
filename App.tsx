//John Briggs, 2021
import React, {useState, useEffect, useContext} from "react";
import Navigation from "./src/navigation";
import { ThemeProvider } from "react-native-rapi-ui";
import { useFonts, Inter_900Black, Ubuntu_400Regular, Ubuntu_700Bold } from '@expo-google-fonts/dev';
import AppLoading from 'expo-app-loading';
import { CredentialProvider } from './src/components/CredContext'


export default function App() {
  const images = [
    require("./assets/images/logoDark.png"),
    require("./assets/images/logoLight.png"),
  ];
  let [fontsLoaded] = useFonts({
    Inter_900Black, Ubuntu_400Regular, Ubuntu_700Bold
  });
  const value = {email: '', password: '', name: ''};
  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      
    <CredentialProvider value={value}>
      <ThemeProvider theme="dark" images={images}>
          <Navigation />
      </ThemeProvider>
    </CredentialProvider>
  );
  }
  
}
