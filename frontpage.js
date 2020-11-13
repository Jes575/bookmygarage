import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, Platform, ImageBackground, Dimensions, ActivityIndicator, StatusBar} from 'react-native';


const styles=StyleSheet.create({
    white: {
        color: 'white',
       fontFamily: Platform.OS=="ios"? 'Ubuntu-Bold' : 'Ubuntu-Bold.ttf',
        fontSize:15,
        fontWeight:'bold',
        letterSpacing:7
    },
    myback: {
        //backgroundColor: 'teal',
        alignItems:'center',
        justifyContent:'center',
        flex:1,
    }
})

export default class frontpage extends Component{
  render() {
    return (
        <View style={styles.myback}>
          <ImageBackground source={require('../images/mainBack4.jpeg')} style={{width:Dimensions.get('screen').width,height:Dimensions.get('screen').height,alignItems:'center',justifyContent:'center',flex:1}}>
              <Image source={require('../images/car2.jpg')} style={{width:120,height:120,borderRadius:20,borderColor:'white',borderWidth:5}}/>
              <Text style={styles.white}> {"\n\n"} BOOKMYGARAGE.AE {"\n\n"}</Text>
              <ActivityIndicator />
              <StatusBar barStyle="default" hidden={true} />
          </ImageBackground>
        </View>
    )
  }
}
