//John Briggs, 2021
import React, {useState, useRef} from "react";
import { View, Linking, TouchableHighlight, StyleSheet, Text, Image, ImageURISource } from "react-native";
import { MainStackParamList } from "../types/navigation";
import { StackScreenProps } from "@react-navigation/stack";
import AppLoading from 'expo-app-loading';
import {
  Layout,
  Button,
  TopNav,
  Section,
  SectionContent,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { Ionicons, FontAwesome, FontAwesome5, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as colors from "../components/Colors";
import {state, setSelected, textStyle, styles} from "./Home"
import defaultpfp from '../../assets/images/defaultpfp.jpeg';
import * as Animatable from 'react-native-animatable'
export default function ({
  navigation,
}: StackScreenProps<MainStackParamList, "HistoryScreen">) {
  const { isDarkmode, setTheme } = useTheme();

  const AnimationRef = useRef<any>(null); //<any> to hide compiler warnings...should probably find actual type
  function animatedPress(){
    if(AnimationRef) {
      AnimationRef.current?.pulse();
    }
  }
  const populateSavedNumbers = (arg:number) => {
    let arr = [];
    for(let i = 0; i < arg; i++){
      arr.push(<View key={i}>{renderTrackPanel(i.toString(), defaultpfp, "Sample Song", "Sample Artist", true, true)}</View>)
    }
    return arr
  }

  const renderTrackPanel = (id:string, image:ImageURISource, name:string, artist:string, added:boolean, liked:boolean) => {
    return (
      <View style={styles.artist}>
        <View style={styles.artist1box}>
          <Image 
              style={styles.artistpfp}
              resizeMode={"cover"}
              source={ image }
            />
        </View>
        
        <View style={styles.artist2box}>
          <Text style={{fontSize: 14, fontWeight: "bold", color: isDarkmode ? colors.neutralLight : colors.neutralDark}}>{name}</Text>
          <Text style={{fontSize: 12, fontWeight: "bold", color: isDarkmode ? colors.neutralLight : colors.neutralDark}}>{artist}</Text>
        </View>
        <View style={[styles.artist3box, {marginRight:-12}]}>
          <TouchableHighlight underlayColor="transparent" onPress={() => {animatedPress();}}> 
            <Animatable.View ref={AnimationRef}>
              {liked ? <FontAwesome name="heart-o" size={25} color={isDarkmode ? colors.neutralLight : colors.neutralDark}/>
              : <FontAwesome name="heart" size={25} color={isDarkmode ? colors.neutralLight : colors.neutralDark} />}
            </Animatable.View>
           </TouchableHighlight>
        </View>
        <View style={[styles.artist3box, {marginRight:-4}]}>
          <TouchableHighlight underlayColor="transparent" onPress={() => {animatedPress();}}> 
            <Animatable.View ref={AnimationRef}>
              {added ? <MaterialCommunityIcons  name="plus-box-outline" size={35} color={isDarkmode ? colors.neutralLight : colors.neutralDark} />
              : <MaterialCommunityIcons name="music-box-outline" size={35} color={isDarkmode ? colors.neutralLight : colors.neutralDark} />}
            </Animatable.View>
           </TouchableHighlight>
        </View>
        <View style={[styles.artist3box, {marginRight:0}]}>
          <TouchableHighlight underlayColor="transparent" onPress={() => {animatedPress();}}> 
            <Animatable.View ref={AnimationRef}>
              {false ? <MaterialIcons  name="playlist-add-check" size={35} color={isDarkmode ? colors.neutralLight : colors.neutralDark} />
              : <MaterialIcons  name="playlist-add" size={35} color={isDarkmode ? colors.neutralLight : colors.neutralDark} />}
            </Animatable.View>
           </TouchableHighlight>
        </View>
      </View>

    );
  }

  return (
    <Layout>
        <View style={[styles.head, {backgroundColor: isDarkmode ? colors.neutralDark : colors.neutralLight}]}>
            <TouchableHighlight underlayColor="transparent" onPress={() => {navigation.navigate('HistoryScreen'); setSelected('history')}}>
                <View style={styles.buttonContainer}>
                    <FontAwesome5 name="history" size={20} style={{color: textStyle('history', isDarkmode)}}>
                    </FontAwesome5>
                    <Text style={{color: textStyle('history', isDarkmode), fontFamily: 'Ubuntu_400Regular'}}>History</Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight underlayColor="transparent" onPress={() => {navigation.navigate('MainTabs'); setSelected('forYou')}}>
              <View style={styles.buttonContainer}>
                <Text style={{color: textStyle('forYou', isDarkmode), fontSize: 25, fontFamily: 'Ubuntu_700Bold'}}>For You</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight underlayColor="transparent" onPress={() => {navigation.navigate('QueueScreen'); setSelected('Queue')}}>
                <View style={styles.buttonContainer}>
                    <MaterialIcons name="queue-music" size={27} color={textStyle('queue', isDarkmode)}>
                    </MaterialIcons>
                    <Text style={{color: textStyle('queue', isDarkmode), fontFamily: 'Ubuntu_400Regular'}}>Up Next</Text>
                </View>
            </TouchableHighlight>
        </View>

      
      <View style={{
          flex: 8,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isDarkmode ? colors.neutralDark : colors.neutralLight,
        }}>
        {populateSavedNumbers(10)}
      </View>
    </Layout>
  );
}