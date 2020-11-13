import React from "react";
import {Container,Root, Content,Button,Input} from "native-base";
import { View, Text,TextInput, Image} from "react-native";
import MyHeader from './MyHeader';

const Settings = props => { 

  changePassword = async() =>{
    //console.log("log in");
    //const {username,password} = this.state;
    //Keyboard.dismiss();
   // alert(password);
    const data= new FormData();
    data.append("oldpass", oldpass);
    data.append("newpass", newpass);
    
    await fetch(serverAddr+'/updatePasswordCust.php',{
      method:'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
    },
    body:data,
    })
    /*.then((response) => response.json())
    .then(async (responseJson) => {
        if(responseJson==0)
        {
          Toast.show({
            text: "Wrong Username or Password",
            duration: 5000,
            buttonText: "Okey",
            buttonStyle: {backgroundColor: '#992222',color:'#fff',borderRadius:5,opacity:0.7},
            type : "danger",
          })
        }
        else{
          await AsyncStorage.setItem('LoggedIn',responseJson.toString());
          
          this.props.navigation.navigate('Main');

          
          // myNavigation.navigate("MainScreen")
        }
    })
    .catch((error) => {
      console.error(error);
    });*/
  }

  return (

    <Root>
    <Container style={{}}>
      <MyHeader navigation={props.navigation} title="settings" tabName="Change Password"/>

      <Content>
      <Image source={require('../images/reset-password.png')} style={{width:100, height:100, marginLeft:125, marginTop:15}}/>

      <Text style={{fontWeight:'bold',fontSize:14,paddingTop:20, paddingLeft:2, marginLeft:20 ,fontFamily:'DancingScrpt-Medium'}}>Old Password </Text>
      <View style={{flex:1, justifyContent:'center', paddingTop:5,paddingBottom:10, alignItems:'center'}}>
      <TextInput style={{height: 45, width: "80%",borderRadius:25, borderColor: '#26a69a', borderWidth: 2}} placeholder="Old Password" secureTextEntry={true}/>
      </View>

      <Text style={{fontWeight:'bold',fontSize:14, paddingLeft:2, marginLeft:20, fontFamily:'DancingScrpt-Medium'}}>New Password </Text>
      <View style={{flex:1, justifyContent:'center', paddingTop:5,paddingBottom:10,alignItems:'center'}}>
      <TextInput style={{height: 45, width: "80%",borderRadius:25, borderColor: '#26a69a', borderWidth: 2 }} placeholder="New Password" secureTextEntry={true}/>
      </View>

      <Text style={{fontWeight:'bold',fontSize:14, paddingLeft:2, marginLeft:20, fontFamily:'DancingScrpt-Medium'}}>Confirm Password </Text>
      <View style={{flex:1, justifyContent:'center', paddingTop:5,paddingBottom:10,alignItems:'center'}}>
      <TextInput style={{height: 45, width: "80%",borderRadius:25, borderColor: '#26a69a', borderWidth: 2}} placeholder="Confirm Password" secureTextEntry={true}/>
      </View>

      <Button
        style={{width:200, borderRadius:25,justifyContent:'center',alignSelf:'center',color:'#26a69a',marginTop:20}} 
        onPress={()=>this.changePassword()}>   
          <Text style={{color:'#ffffff'}}>SUBMIT</Text>
      </Button>

      </Content>

    </Container>
      </Root>
   
  );
};


export default Settings;