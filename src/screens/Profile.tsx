//John Briggs, 2021
import React, {useState} from 'react';
import { View } from 'react-native';
import { MainStackParamList } from '../types/navigation';
import { StackScreenProps } from '@react-navigation/stack';

import * as colors from "../components/Colors";
import {
  Layout,
  Button,
  Text,
  TopNav,
  Section,
  SectionContent,
  TextInput,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import CredentialContext, {useCred} from '../components/CredContext'

export default function ({
	navigation,
}: StackScreenProps<MainStackParamList, 'MainTabs'>) {
  const { isDarkmode, setTheme } = useTheme();
  const [name, setName] = useState<string>("");
  const [description, setDesc] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const {cred, setCred} = useCred();

  function get_response(data){
    let t_info = data.text.toString()
    if (t_info == "Success"){
      setSuccess(true);
      setError(false);
    }else{
      setSuccess(false);
      setError(true);
    }
    //setInfo(JSON.stringify(data));
  }
  function upload(){
    const requestOptions = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({email: cred.email,password: cred.password, trackName: name, trackDesc: description })
          };
          fetch('https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/application-0-nayek/service/pa_webhook/incoming_webhook/uploadTrack?secret=TestDebug123', requestOptions)
              .then(response => response.json())
              .then(data => get_response(data));
  }
  function grabName(){
    if(cred.name && cred.name != ""){
      return cred.name.replace(/['"]+/g, '')
    }else{
      return "Jack"
    }

  }
	return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: isDarkmode ? colors.neutralDark : colors.neutralLight,
      }}
    >
      <View
      style={{
        flex: 3,
        paddingHorizontal: 20,
        backgroundColor: isDarkmode ? colors.neutral2Dark : colors.neutralLight,
      }}>
      <View
				style={{paddingTop: 25, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
				<Text>Hello {grabName()}!</Text>
        <Button
              style={{ color: themeColor.danger }}
              text="Logout"
              size="sm"
              onPress={() => {
                navigation.navigate("Login");
              }} outline/>
			</View>
        <TextInput
          containerStyle={{ marginTop: 15, backgroundColor: isDarkmode ? colors.neutral2Dark : colors.neutralLight}}
          placeholder="Track Title"
          value={name}
          autoCapitalize="none"
          autoCompleteType="off"
          autoCorrect={false}
          keyboardType="email-address"
          onChangeText={(text) => setName(text)}
        />

        <TextInput
          containerStyle={{ marginTop: 15, backgroundColor: isDarkmode ? colors.neutral2Dark : colors.neutralLight }}
          placeholder="Track Description"
          value={description}
          autoCapitalize="none"
          autoCompleteType="off"
          autoCorrect={false}
          onChangeText={(text) => setDesc(text)}
        />
        
        <Button text="Upload" onPress={() => {upload();}} 
        style={{marginTop: 20, fontFamily: "Ubuntu_400Regular"}} status="primary" size="md" color={isDarkmode ? colors.primaryDark : colors.primaryLight} outline/>
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20,
            justifyContent: "center",
          }}>
        {success ?
          <Text size="md" style={{ color: themeColor.success }}>Upload Successful!</Text>
          : <Text></Text>}
        {error ?
          <Text size="md" style={{ color: themeColor.error }}>Upload encountered an issue</Text>
          : <Text></Text>}
        </View>
      </View>
		</View>
	);
}
