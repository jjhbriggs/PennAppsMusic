//John Briggs, 2021
import React, {useState, useEffect, useRef} from "react";
import { View, Linking, TouchableHighlight, StyleSheet, Text, Image, Dimensions } from "react-native";
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
import { Entypo, Ionicons, MaterialIcons, FontAwesome, MaterialCommunityIcons, FontAwesome5, EvilIcons } from '@expo/vector-icons'; 
import * as colors from "../components/Colors";
import * as Animatable from 'react-native-animatable'
import { Audio, AVPlaybackStatus } from 'expo-av'
import vinyl from '../../assets/images/vinyl.jpg';
import defaultpfp from '../../assets/images/defaultpfp.jpeg';
import CircularSlider from '../components/CircularSlider';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import CredentialContext, {useCred} from '../components/CredContext'
export var state = { 
  historySelected: false,
  forYouSelected: true,
  queueSelected: false,
};

export function setSelected(selectName: string) {
  state.historySelected = false;
  state.forYouSelected = false;
  state.queueSelected = false;
  switch(selectName) {
    case 'history':
      return state.historySelected = true;
    case 'forYou':
      return state.forYouSelected = true;
    case 'queue':
      return state.queueSelected = true;
    default:
      return;
  }
}

export function textStyle(selectName: string, isDarkmode: boolean) {
  switch(selectName) {
    case 'history':
      return state.historySelected ? colors.primaryDark : isDarkmode ? colors.neutralLight : colors.neutralDark;
    case 'forYou':
      return state.forYouSelected ? colors.primaryDark : isDarkmode ? colors.neutralLight : colors.neutralDark;
    case 'queue':
      return state.queueSelected ? colors.primaryDark : isDarkmode ? colors.neutralLight : colors.neutralDark;
    default:
      return colors.neutralLight;
  }
}

//todo
//add cooldown between button presses so that it doesnt crash
const audio = {
  filename: 'My Awesome Audio',
  uri:
  require('../../assets/sounds/hello.mp3'),
    // 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
};
const song1 = {
    name: 'Sample Track',
    details: 'The first sample track, from sample album #1',
    uri:
    require('../../assets/sounds/hello.mp3'),
}
const song2 = {
    name: 'Sample Track #2',
    details: 'The second sample track, from sample album #1',
    uri:
    require('../../assets/sounds/sample2.mp3'),
}
const song3 =  {
    name: 'Sample Track #3',
    details: 'The third sample track, from sample album #1',
    uri:
    require('../../assets/sounds/sample3.mp3'),
}

var disableAutoSlider = false;
var disableAutoNext = false; //used to prvent appearance of lagging slider when it temporarily sets it behind the refreshed drag state
var trackIndex = 0;
function millisToMinutesAndSeconds(millis:number) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  if(isNaN(millis)){
    return "0:00";
  }
  return (
    seconds == 60 ?
    (minutes+1) + ":00" :
    minutes + ":" + (seconds < 10 ? "0" : "") + seconds
  );
}
// fetch('https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/application-0-nayek/service/pa_webhook/incoming_webhook/getTracks?secret=TestDebug123', requestOptions)
//               .then(response => response.json())
//               .then(data => propogateSongs(data));

export default function ({
  navigation,
}: StackScreenProps<MainStackParamList, "MainTabs">) {
  const { isDarkmode, setTheme } = useTheme();

  //const [trackIndex, setTrack] = useState(0);

  const [slider1,setState1] = useState(0);
  const num = 0;
  //const [paused, setPaused] = useState(false);
  //const togglePaused = () => setPaused(paused => !paused);
  const [liked, setLiked] = useState(false);
  const toggleLiked = () => setLiked(liked => !liked);
  const [added, setAdded] = useState(false);
  const toggleAdded = () => setAdded(added => !added);

  const AnimatedIcon = Animatable.createAnimatableComponent(Ionicons)
  //<any | null>
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackObject, setPlaybackObject] = useState<any | null>(null);
  const [playbackStatus, setPlaybackStatus] = useState<any | null>(null);

  const [uiplayTimer, setUPT] = useState("0:00");
  const [uiplayTimerTot, setUPTT] = useState("0:00");
  const [track_list, setTrackList] = useState([]);
  const {cred, setCred} = useCred();

  function propogateSongs(data){
    let tmp = []
    for(const track of data.tracks){
        if(!track.name){
          break;
        }
        tmp.push({name: track.name, details: track.description, uri: require('../../assets/sounds/hello.mp3')})
      }
      setTrackList(tmp);
  }
  function importSongs(){
    const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({email: cred.email,password: cred.password})
            };
    fetch('https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/application-0-nayek/service/pa_webhook/incoming_webhook/getTracks?secret=TestDebug123', requestOptions)
                .then(response => response.json())
                .then(data => propogateSongs(data));
  }

  const onPlaybackStatusUpdate = (playbackStatus:any) => {
    setUPTT(millisToMinutesAndSeconds(playbackStatus.durationMillis));
    if(!disableAutoSlider && !disableAutoNext){
      const sliderUpdateNum = playbackStatus.positionMillis / playbackStatus.durationMillis * 360;
      if(isNaN(sliderUpdateNum)){
        setState1(0);
      }else{
        setState1(sliderUpdateNum);
      }
      
      setUPT(millisToMinutesAndSeconds(playbackStatus.positionMillis));
      if(playbackStatus.positionMillis >= playbackStatus.durationMillis && !isNaN(playbackStatus.positionMillis) && !isNaN(playbackStatus.durationMillis)){
        _advanceTrack();
        return;
      }
    }else if(!disableAutoSlider){
      disableAutoNext = false;
    }
    
    //disableAutoSlider = true;
    //playbackObject.setPositionAsync(millis)
  }
  useEffect(() => {
    importSongs();
    if (playbackObject === null) {
      setPlaybackObject(new Audio.Sound());
    }
  }, []);

  const handleAudioPlayPause = async () => {
    try{
      if (playbackObject !== null && playbackStatus === null) {
        console.log("loading");
        const status = await playbackObject.loadAsync(
          //{ uri: audio.uri },
          track_list[trackIndex].uri, 
          { shouldPlay: true }
        );
        playbackObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        setIsPlaying(true);
        return setPlaybackStatus(status);
      }

      // It will pause our audio
      if (playbackStatus.isPlaying) {
        console.log("pause");
        const status = await playbackObject.pauseAsync();
        setIsPlaying(false);
        return setPlaybackStatus(status);
      }

      // It will resume our audio
      if (!playbackStatus.isPlaying) {
        console.log("play");
        const status = await playbackObject.playAsync();
        console.log(status);
        setIsPlaying(true);
        return setPlaybackStatus(status);
      }
    }catch{
      console.log("catching unhandled call");
    }
  };
  const _handleSliderDrag = () => {
    try{
      disableAutoSlider = true;
      disableAutoNext = true;
      playbackObject.pauseAsync();
      setUPT(millisToMinutesAndSeconds(slider1 / 360 * playbackStatus.durationMillis));
    }catch{
      console.log("catching unhandled call");
    }
  }
  const _handleSliderRelease = () => {
    try{
      disableAutoSlider = false;
      const slidedTime = slider1 / 360 * playbackStatus.durationMillis;
      playbackObject.setPositionAsync(slidedTime);
      console.log("released");
      playbackObject.playAsync();
    }catch{
      console.log("catching unhandled call");
    }
  }
  const _advanceTrack = async () => {
    try{
      playbackObject.stopAsync();
      let status = await playbackObject.unloadAsync();
      if(trackIndex+1 == track_list.length){
        trackIndex = 0;
      }else{
        trackIndex = trackIndex+1;
      }
      status = await playbackObject.loadAsync(
        track_list[trackIndex].uri, 
        { shouldPlay: true }
      );
      console.log("next");
      playbackObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      setIsPlaying(true);
      return setPlaybackStatus(status);   
    }catch{
      console.log("catching unhandled call");
    } 
  }
  const _backTrack = async () => {
    try{
      playbackObject.stopAsync();
      let status = await playbackObject.unloadAsync();
      console.log("back");
      if(trackIndex == 0){
        trackIndex = track_list.length-1;
      }else{
        trackIndex = trackIndex-1;
      }
      status = await playbackObject.loadAsync(
        track_list[trackIndex].uri, 
        { shouldPlay: true }
      );
      playbackObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      setIsPlaying(true);
      return setPlaybackStatus(status);
    }catch{
      console.log("catching unhandled call");
    }
  }
  
  function onSwipeLeft(gestureState) {
    _backTrack();
  }

  function onSwipeRight(gestureState) {
    _advanceTrack();
  }
  const gestureConfig = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };
  const seekBarProps = { // make sure all required component's inputs/Props keys&types match
    width: Dimensions.get('screen').width*0.70,
    height: Dimensions.get('screen').width*0.70,
    meterColor: colors.primaryDark,
    textColor: 'transparent',
    value: slider1,
    onValueChange: (value: number)=>setState1(value),
    sliderUpdate: _handleSliderDrag,
    sliderRelease: _handleSliderRelease,
  }

  //heart animation
  const AnimationRef = useRef<any>(null); //<any> to hide compiler warnings...should probably find actual type
  function animatedPress(){
    if(AnimationRef) {
      if(liked){
        AnimationRef.current?.jello(); //flash/swing/tada/bounceIn on jello/zoomIn/swing off pulse for other sublte effects
      }
      else{
        AnimationRef.current?.bounceIn();
      }
    }
  }
  //added animation
  const AnimationRefAdd = useRef<any>(null); //<any> to hide compiler warnings...should probably find actual type
  function animatedPressAdd(){
    if(AnimationRefAdd) {
      if(added){
        AnimationRefAdd.current?.pulse(); //flash/swing/tada/bounceIn on jello/zoomIn/swing off pulse for other sublte effects
      }
      else{
        AnimationRefAdd.current?.pulse();
      }
    }
  }
  if(track_list.length > 0){
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
            <TouchableHighlight underlayColor="transparent" onPress={() => {navigation.navigate('QueueScreen'); setSelected('queue')}}>
                <View style={styles.buttonContainer}>
                    <MaterialIcons name="queue-music" size={27} color={textStyle('queue', isDarkmode)}>
                    </MaterialIcons>
                    <Text style={{color: textStyle('queue', isDarkmode), fontFamily: 'Ubuntu_400Regular'}}>Up Next</Text>
                </View>
            </TouchableHighlight>
        </View>
      <GestureRecognizer
        onSwipeLeft={(state) => onSwipeLeft(state)}
        onSwipeRight={(state) => onSwipeRight(state)}
        config={gestureConfig} style={{
          flex: 8,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isDarkmode ? colors.neutralDark : colors.neutralLight,
        }}>

        <View style={styles.container}>
          {/* justify content not needed but looks ok if i forget to flex */}
          <View style={{ flex: 8, justifyContent: 'space-around'}}> 
            <View>
              <View style={styles.artist}>
                <View style={styles.artist1box}>
                  <Image 
                      style={styles.artistpfp}
                      resizeMode={"cover"}
                      source={ defaultpfp }
                    />
                </View>
                <View style={styles.artist2box}>
                  <Text style={{fontSize: 14, fontWeight: "bold", color: isDarkmode ? colors.neutralLight : colors.neutralDark, fontFamily: 'Ubuntu_400Regular'}}>Artist Name</Text>
                  <Text style={{fontSize: 12, fontWeight: "bold", color: isDarkmode ? colors.neutralLight : colors.neutralDark, fontFamily: 'Ubuntu_400Regular'}}>Artist Details - Genres - Etc</Text>
                </View>
                <View style={styles.artist3box}>
                  <EvilIcons name="plus" size={40} color={isDarkmode ? colors.neutralLight : colors.neutralDark} />
                </View>
                
              </View>
            </View>
            <View style={styles.centerControl}>
              <View style={styles.imageContainer} >
                <Image 
                  style={[styles.image, {borderColor: isDarkmode ? themeColor.white200 : "#2B2E3B"}]}
                  resizeMode={"cover"}
                  source={ vinyl }
                  
                />
              </View>
              <View style={styles.slider1}>
                <CircularSlider {...seekBarProps} />
              </View>
              <View style={styles.songDetailsbox}>
                <Text style={{fontSize: 12, color: isDarkmode ? colors.accentDark : colors.accentLight, fontFamily: 'Ubuntu_400Regular'}}> {uiplayTimer} / {uiplayTimerTot} </Text>
                <Text style={{fontSize: 18, fontWeight: "bold", color: isDarkmode ? colors.neutralLight : colors.neutralDark, fontFamily: 'Ubuntu_400Regular'}}> {track_list[trackIndex]  ? track_list[trackIndex].name : null} </Text>
                <Text style={{fontSize: 14, color: isDarkmode ? colors.neutralLight : colors.neutralDark, fontFamily: 'Ubuntu_400Regular'}}> {track_list[trackIndex] ? track_list[trackIndex].details : null} </Text>
              </View>
            </View>

              
              <View style={styles.playbackControls}>
                <TouchableHighlight  underlayColor="transparent" onPress={() => {_backTrack();}}> 
                <Ionicons style={styles.iconPad} name="play-skip-back" size={40} color={isDarkmode ? colors.neutralLight : colors.neutralDark} />
                </TouchableHighlight>
                {/* negative margin to remove hidden padding in icon */}
                <TouchableHighlight style={{ marginRight: -5 }} underlayColor="transparent" onPress={() => {handleAudioPlayPause();}}> 
                  {isPlaying ? <Ionicons style={styles.iconPad} name="pause-circle" size={85} color={isDarkmode ? colors.neutralLight : colors.neutralDark} /> 
                  : <Ionicons style={styles.iconPad} name="play-circle" size={85} color={isDarkmode ? colors.neutralLight : colors.neutralDark} />}
                </TouchableHighlight>
                
                <TouchableHighlight  underlayColor="transparent" onPress={() => {_advanceTrack();}}> 
                <Ionicons style={styles.iconPad} name="play-skip-forward" size={40} color={isDarkmode ? colors.neutralLight : colors.neutralDark} />
                </TouchableHighlight>
              </View>
              <View style={styles.socialBar}>
                <View style={styles.tabPair}>
                  <TouchableHighlight style={{ marginRight: -5 }} underlayColor="transparent" onPress={() => { toggleAdded(); animatedPressAdd();}}> 
                    <Animatable.View ref={AnimationRefAdd}>
                      {added ? <MaterialCommunityIcons style={styles.iconPadL} name="music-box-outline" size={40} color={isDarkmode ? colors.primaryLight : colors.primaryDark} />
                      : <MaterialCommunityIcons style={styles.iconPadL} name="plus-box-outline" size={40} color={isDarkmode ? colors.neutralLight : colors.neutralDark} />}
                    </Animatable.View>
                  </TouchableHighlight>
                  {added ? <Text style={[styles.subText, {color: isDarkmode ? colors.primaryDark : colors.primaryLight, fontFamily: 'Ubuntu_400Regular'}]}>Added</Text>
                    : <Text style={[styles.subText, {color: isDarkmode ? colors.neutralLight : colors.neutralDark, fontFamily: 'Ubuntu_400Regular'}]}>Add</Text>}
                  
                </View>
                <View style={styles.tabPair}>
                <TouchableHighlight style={{ marginRight: -5 }} underlayColor="transparent" onPress={() => { toggleLiked(); animatedPress();}}> 
                  <Animatable.View ref={AnimationRef}>
                    {liked ? <FontAwesome style={styles.iconPadL} name="heart-o" size={40} color={isDarkmode ? colors.primaryDark : colors.primaryLight} /> 
                    : <FontAwesome style={styles.iconPadL} name="heart-o" size={40} color={isDarkmode ? colors.neutralLight : colors.neutralDark} />}
                  </Animatable.View>
                </TouchableHighlight>
                
                  {liked ? <Text style={[styles.subText, {color: isDarkmode ? colors.primaryDark : colors.primaryLight, fontFamily: 'Ubuntu_400Regular'}]}>Liked</Text> 
                    : <Text style={[styles.subText, {color: isDarkmode ? colors.neutralLight : colors.neutralDark, fontFamily: 'Ubuntu_400Regular'}]}>Like</Text>}
                </View>
                <View style={styles.tabPair}>
                <MaterialCommunityIcons style={styles.iconPadL} name="comment-text-outline" size={40} color={isDarkmode ? colors.neutralLight : colors.neutralDark} />
                  <Text style={[styles.subText, {color: isDarkmode ? colors.neutralLight : colors.neutralDark, fontFamily: 'Ubuntu_400Regular'}]}>Comment</Text>
                </View>
                <View style={styles.tabPair}>
                  <Ionicons style={styles.iconPadL} name="share-social-outline" size={40} color={isDarkmode ? colors.neutralLight : colors.neutralDark} />
                  <Text style={[styles.subText, {color: isDarkmode ? colors.neutralLight : colors.neutralDark, fontFamily: 'Ubuntu_400Regular'}]}>Share</Text>

                </View>
                
              </View>

          </View>
        </View>
      </GestureRecognizer>
    </Layout>
  );
  }else{
    return (
        null
      ); 
  }
}
// <View style={{
  //     flex: 8,
  //     alignItems: "center",
  //     justifyContent: "center",
  //     backgroundColor: isDarkmode ? colors.neutralDark : colors.neutralLight,
  //   }}>
export const styles = StyleSheet.create({
    head: {
      flex: 1,
      marginTop: 0,
      alignItems: 'center',
      justifyContent: 'space-around',
      width: "auto",
      flexDirection: "row",
    },
    buttonContainer: {
      width: 100,
      height: 50,
      flexDirection: "column",
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    slider1: {
        // position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        alignSelf:'center',
        top: 0,
    },
    centerControl: {
        justifyContent: 'flex-start',
        backgroundColor: 'transparent',
        flex: 5,
    },
    imageContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignSelf:'center',
        marginTop: 22,
    },
    artist: {
        borderColor: colors.accentLight,
        borderWidth: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf:'center',
        width: '80%',
        height: 50,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        // top:Dimensions.get('screen').height *0.0124,
    },
    artistpfp: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    artist1box: {
        flex: 1,
        backgroundColor: 'transparent',
        marginLeft: 10,
    },
    artist2box: {
        flex: 4,
        backgroundColor: 'transparent',
        alignItems: 'center',
        flexDirection: 'column',
    },
    artist3box: {
        flex: 1,
        backgroundColor: 'transparent',
        marginRight: 0,
    },
    songDetailsbox: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf:'center',
        flex: 1,
    },
    playbackControls: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf:'center',
        flexDirection: 'row',
        backgroundColor: 'transparent',
        flex: 2.25,
    },
    socialBar: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf:'center',
        flexDirection: 'row',
        flex: 1.5,
        backgroundColor: 'transparent',
    },
    tabPair: {
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    iconPad: {
        padding: 10,
    },
    iconPadL: {
        paddingLeft: 20, 
        paddingRight: 20,
    },
    subText: {
        fontSize: 12,
    },
    image: {
        width: Dimensions.get('screen').width * 0.59,
        height: Dimensions.get('screen').width * 0.59,
        borderRadius: Dimensions.get('screen').width *0.30,
        borderWidth: 1
    },
});