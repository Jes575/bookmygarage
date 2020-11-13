import React from "react";
import {TouchableOpacity, View, Image, Dimensions,Platform} from 'react-native'
import { Header, Icon } from "react-native-elements";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';


//import HamburgerMenu from "./HamburgerMenu";
import { faBars,faHome } from "@fortawesome/free-solid-svg-icons";

const MyHeader = props => {
  return (
    <View >
      <Image
        style={{height:'100%',position: 'absolute', top: 0, left: 0,width:Dimensions.get('screen').width,backgroundColor:'black',opacity:0.9}}
        source={require('../images/menuBack.jpg')}
      />
    <Header
    placement="center"
    leftComponent={<TouchableOpacity onPress={()=>props.navigation.toggleDrawer()}>
        <FontAwesomeIcon style={{color:'white'}} icon={faBars} size={25}></FontAwesomeIcon>
    </TouchableOpacity>}
    centerComponent={{
      text: props.tabName,
      style: { color:'#fff', fontWeight: "bold", fontSize:18,letterSpacing:1,fontFamily:'Ubuntu-Bold' }
    }}
    rightComponent={{icon:props.title, color:'white',size:25}}
    statusBarProps={{ barStyle: "light-content",backgroundColor:'teal'}}
    containerStyle={{backgroundColor:'transparent',marginTop:Platform.OS === 'ios' ? 0 : -20}}
  />
  </View>
  );
};

export default MyHeader;