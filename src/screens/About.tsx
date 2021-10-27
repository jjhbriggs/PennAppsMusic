//John Briggs, 2021
import React from 'react';
import { View } from 'react-native';
import { MainStackParamList } from '../types/navigation';
import { StackScreenProps } from '@react-navigation/stack';
import {
  Layout,
  Button,
  Text,
  TopNav,
  Section,
  SectionContent,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import * as colors from "../components/Colors";

export default function ({
	navigation,
}: StackScreenProps<MainStackParamList, 'MainTabs'>) {
  const { isDarkmode, setTheme } = useTheme();
	return (
		<Layout>
    <TopNav
        middleContent="Debug Tools"
        rightContent={
          <Ionicons
            name={isDarkmode ? "sunny" : "moon"}
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        rightAction={() => {
          if (isDarkmode) {
            setTheme("light");
          } else {
            setTheme("dark");
          }
        }}
      />
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Text style={{fontSize: 12}}>This is a debug page to assist with development.</Text>
        <Text style={{fontSize: 12}}>John Briggs. PennApps 2021</Text>
			</View>
      <View style={{
          flex: 8,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isDarkmode ? colors.neutralDark : colors.neutralLight,
        }}>
        <Section>
          <SectionContent>
            <Button
              status="danger"
              text="Logout"
              onPress={() => {
                navigation.navigate("Login");
              }}
            />
          </SectionContent>
        </Section>
      </View>
		</Layout>
	);
}
