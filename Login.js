import React, { Component } from 'react';
import {Dimensions, Platform, ImageBackground, Keyboard} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Header, Content, Button,Root, Text, Icon,Toast, View, Form, Item, Label, Input} from 'native-base';
import { faRubleSign } from '@fortawesome/free-solid-svg-icons';
// import {MainScreen} from './Main';
import {serverAddr} from '../App';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
export default class Login extends Component {
  static navigationOption ={
    header : null
  }
  constructor(props)
  {
    super(props)
    this.state={
      username : '',
      password : ''
    }
  }

  componentDidMount(){
    console.log(this.props);
  }

  userLogin = async() =>{
    console.log("log in");
    const {username,password} = this.state;
    Keyboard.dismiss();
   // alert(password);
    const data= new FormData();
    data.append("username", username);
    data.append("password", password);
    data.append("role", "customer");
    await fetch(serverAddr+'/checkLogin.php',{
      method:'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
    },
    body:data,
    })
    .then((response) => response.json())
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
    });
  }
  registerMe=()=>{
    alert('hello');
  }
  render() {
    return (
      <Root>
      <Container>
              <Content>
              <ImageBackground source={require('../images/mainBack.jpg')}  
                   style={{flex: 1, height: null, width: null, resizeMode:'cover'}} >
        
                <View style={{flex:1,justifyContent:'center',height:Dimensions.get('window').height,backgroundColor: 'rgba(0,0,0,0.7)'}}>
                  <Button style={{margin:10,padding:10,alignSelf:'center'}} iconLeft danger>
                    <Icon name='logo-googleplus' />
                    <Text >Google Login</Text>
                  </Button>
                  
                  {/* horizontal Line */}
                  <View 
                  style={{borderBottomColor: 'white',borderBottomWidth: 1,width:Dimensions.get('window').width*0.8,alignSelf:'center'}}/>
                  
                  <Form style={{margin:30,marginTop:60}}>
                    <Text 
                    style={{textAlign:'center',color:'white',letterSpacing:1,fontFamily:Platform.OS=="ios"?'Ubuntu-Bold':'Cairo.ttf',fontWeight:'bold',fontSize:15,letterSpacing:2,color:'yellow'}}>
                      <Icon name='ios-home' style={{color:'white',paddingRight:30,fontSize:15,color:'yellow'}}></Icon>  
                        BookMyGarage.ae
                    </Text>
                    
                    <Item floatingLabel style={{margin:10}}>
                      <Label style={{color:'#fff'}}>
                        Username :
                      </Label>
                      <Input 
                      style={{fontFamily:Platform.OS=="ios"?'Ubuntu-Bold':'Ubuntu Bold',fontWeight:'bold',color:'white'}} 
                      onChangeText={username=> this.setState({username})}
                      value={this.state.username} 
                       />
                    </Item>

                    <Item floatingLabel style={{margin:10}}>
                      <Label style={{color:'#fff'}}>
                        Password :
                      </Label>
                      <Input 
                      secureTextEntry={true} 
                      style={{fontWeight:'bold',color:'white',fontFamily:Platform.OS=="ios"?'Ubuntu-Bold':'Ubuntu Bold'}} 
                      onChangeText={password=> this.setState({password})} 
                      value={this.state.password} 
                      />
                    </Item>

                    <Button primary block
                    style={{padding:10,marginTop:30}} 
                    onPress={()=>this.userLogin()}>
                      <Icon name='md-log-in' />
                      <Text 
                      style={{fontFamily:Platform.OS=="ios"?'Ubuntu-Bold':'Ubuntu Bold',fontWeight:'bold'}}>
                        Login
                      </Text>
                    </Button>

                    <View>
                      <Text 
                      style={{textAlign:'right',color:'#5555ff',fontWeight:'bold',paddingTop:10}}>
                        Forgot Password?
                      </Text>
                    </View>
                    
                    <Button onPress={()=>registerMe()} style={{marginTop:30,alignSelf:'center'}} bordered danger>
                    <Icon name='ios-person-add' />
                      <Text style={{fontFamily:Platform.OS=="ios"?'Ubuntu-Bold':'Ubuntu Bold',fontWeight:'bold'}}>
                        Register New Users
                      </Text>
                    </Button>

                  </Form>
                </View>
                </ImageBackground>
              </Content>
            </Container>
      </Root>
      
    );
  }
}