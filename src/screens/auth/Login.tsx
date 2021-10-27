//John Briggs, 2021
import React, { useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { MainStackParamList } from "../../types/navigation";
import { StackScreenProps } from "@react-navigation/stack";
import {
  Layout,
  TextInput,
  Text,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import * as colors from "../../components/Colors";

import { Button } from 'react-native-rapi-ui';
import {useCred} from '../../components/CredContext'

export default function ({
  navigation,
}: StackScreenProps<MainStackParamList, "SecondScreen">) {
  const { isDarkmode, setTheme } = useTheme();
  const {cred, setCred} = useCred();
  const [loading, setLoading] = useState<boolean>(false);
  const [login_error, setLE] = useState<boolean>(false);

  function login_redirect(content){
    let name = JSON.stringify(content[0].user.name) 
    if (name != ""){
      setCred({email: cred.email, password: cred.password, name: name})
      navigation.navigate("MainTabs");
    }else{
      setLE(true);
    }
  }
  function login() {
    const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email: cred.email,password: cred.password})
        };
        fetch('https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/application-0-nayek/service/pa_webhook/incoming_webhook/webhook0?secret=TestDebug123', requestOptions)
            .then(response => response.json())
            .then(data => login_redirect(data));
  }
  return (
    <View style={{
          flex: 1,
          justifyContent: "flex-start",
          backgroundColor: isDarkmode ? colors.neutral2Dark : colors.neutralLight,
        }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isDarkmode ? colors.neutral2Dark : colors.neutralLight,
          marginTop: 125,
        }}
      >
        <Image
          resizeMode="contain"
          style={{
            height: 220,
            width: 220,
          }}
          source={isDarkmode ? require("../../../assets/images/logoDarka.png") : require("../../../assets/images/logoLight.png")}
        />
      </View>
      <View
        style={{
          flex: 3,
          paddingHorizontal: 20,
          backgroundColor: isDarkmode ? colors.neutral2Dark : colors.neutralLight,
        }}>
          
        <TextInput
          containerStyle={{ marginTop: 15, backgroundColor: isDarkmode ? colors.neutral2Dark : colors.neutralLight}}
          placeholder="Enter your email"
          value={cred.email}
          autoCapitalize="none"
          autoCompleteType="off"
          autoCorrect={false}
          keyboardType="email-address"
          onChangeText={(text) => setCred({email:text, password: cred.password})}
        />

        <TextInput
          containerStyle={{ marginTop: 15, backgroundColor: isDarkmode ? colors.neutral2Dark : colors.neutralLight }}
          placeholder="Enter your password"
          value={cred.password}
          autoCapitalize="none"
          autoCompleteType="off"
          autoCorrect={false}
          secureTextEntry={true}
          onChangeText={(text) => setCred({email:cred.email, password: text})}
        />
        
        <Button text="Login" onPress={() => {login();}} 
        style={{marginTop: 20, fontFamily: "Ubuntu_400Regular"}} status="primary" size="md" color={isDarkmode ? colors.primaryDark : colors.primaryLight} outline/>
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20,
            justifyContent: "center",
          }}>
        {login_error ?
          <Text size="md" style={{ color: themeColor.danger }}>There was a problem signing you in...</Text>
          : <Text></Text>}
        </View>
      </View>
    </View>
);
}
