import React,{useState,useEffect} from "react";
import { Image,ImageBackground,Keyboard } from "react-native";
import {Container,Content,View,Text,Root, Card, CardItem, Left, Item, Label,Input, Button, Icon,ActionSheet,Toast} from 'native-base';
import MyHeader from './MyHeader';
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory'
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEdit, faCalendar, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import {imageURL} from '../App';
import { TouchableOpacity } from "react-native-gesture-handler";
import ImagePicker from 'react-native-image-picker';
import {serverAddr} from '../App';
import RNFetchBlob from 'rn-fetch-blob';

const Home = props => {
  var BUTTONS = ["Take a Photo", "Choose a Photo", "Cancel"];
  const [name,setName]=useState('');
  const [mobile,setMobile]=useState('');
  const [email,setEmail]=useState('');
  const [address,setAddress]=useState('');
  const [loginid,setLoginid]=useState('');
  const [profilePic,setProfilePic]=useState('https://lh3.googleusercontent.com/proxy/n8jGduw4T4aJ3ygBgCzT23vXDgLj4RPEIXLBcOlKlH7-gxrq49SXhnyJDtOfL-N-0SjrhB1aQJPPfZC3TUD35bPU1NYakcHSkPSz_paUfhyPNUjJfr_cntv6K7m9mSu8thzt2d8RAsAF9rzWL1AYraEsDxca5x5sY6HeT4LpRm-P18PwHucLysCROtLDb8U4O_S8wpTuZG8oOg');
  const [profilrPicIndex,setprofilePicIndex]=useState('');
  const [myInfo,setMyInfo]=useState({});
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [uploadedImageData, setUploadedImageData] = useState(false);
  useEffect(()=>{
    AsyncStorage.getItem('LoggedIn')
            .then((token) => { 
               token=JSON.parse(token);
               if(!isNaN(token.image)&&token.image!="")
                    token.image=imageURL+token.image+".jpg";
                setName(token.name.toUpperCase());
                setMobile(token.mobile);
                setEmail(token.email);
                setAddress(token.address);
                setLoginid(token.loginid);
               token.image!=""?setProfilePic(token.image):null;
              setMyInfo(token)
        });
        const keyboardDidShowListener = Keyboard.addListener(
          'keyboardDidShow',
          () => {
            setKeyboardVisible(true); // or some other action
          }
        );
        const keyboardDidHideListener = Keyboard.addListener(
          'keyboardDidHide',
          () => {
            setKeyboardVisible(false); // or some other action
          }
        );
    
        return () => {
          keyboardDidHideListener.remove();
          keyboardDidShowListener.remove();
        };
  },[]);
  
  chooseImage = () => {
    let options = {
      title: 'Select Image',
      
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      //console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        //const source = { uri: response.uri };
        //console.log('response', JSON.stringify(response.uri));
        setProfilePic(response.uri);
        setUploadedImageData(response.data);
        //alert(JSON.stringify(response.uri));
        console.log(response.data);
      }
    });
  }

  launchCamera = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, (response) => {
     // console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        //const source = { uri: response.uri };
        //console.log('response', JSON.stringify(response));
        setProfilePic(response.uri);
        setUploadedImageData(response.data);
        console.log(responce.data);
      }
    });

  }

  validite=() =>{
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if(!name||name.replace(/ /g, "").length == 0)
    {
      Toast.show({
        text: "Please enter your name.",
        duration: 5000,
        buttonText: "Okey",
        buttonStyle: {backgroundColor: '#992222',color:'#fff',borderRadius:5,opacity:0.7},
        type : "danger",
        textStyle:{fontWeight:'bold'}
        
      })
    }
    else if(!mobile||mobile.replace(/ /g, "").length == 0)
    {
      Toast.show({
        text: "Please enter your mobile number.",
        duration: 5000,
        buttonText: "Okey",
        buttonStyle: {backgroundColor: '#992222',color:'#fff',borderRadius:5,opacity:0.7},
        type : "danger",
        textStyle:{fontWeight:'bold'}
      })
    }
    else if(!email||email.replace(/ /g, "").length == 0)
    {
      Toast.show({
        text: "Please enter your Email address.",
        duration: 5000,
        buttonText: "Okey",
        buttonStyle: {backgroundColor: '#992222',color:'#fff',borderRadius:5,opacity:0.7},
        type : "danger",
        textStyle:{fontWeight:'bold'}
      })
    }
    else if(mobile.length<10)
    {
      Toast.show({
        text: "Invalid mobile number.",
        duration: 5000,
        buttonText: "Okey",
        buttonStyle: { backgroundColor: '#992222', color: '#fff', borderRadius: 5, opacity: 0.7 },
        type : "danger",
        textStyle:{fontWeight:'bold'}
      })
    }
    else if(reg.test(email)== false)
    {
      Toast.show({
        text: "Invalid Email address.",
        duration: 5000,
        buttonText: "Okey",
        buttonStyle: { backgroundColor: '#992222', color: '#fff', borderRadius: 5, opacity: 0.7 },
        type : "danger",
        textStyle:{fontWeight:'bold'}
      })
    }
    else {
      const user = new FormData();
      user.append("cid", myInfo.ID);
      user.append("mobile", mobile);
      user.append("role", "customer");
      fetch(serverAddr + '/checkMobileEmail.php', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: user
      })
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson==1)
            {
              Toast.show({
                text: "This mobile number is already registered.",
                duration: 5000,
                buttonText: "Okey",
                buttonStyle: { backgroundColor: '#992222', color: '#fff', borderRadius: 5, opacity: 0.7 },
                type : "danger",
                textStyle:{fontWeight:'bold'}
              })
            }
            else{
              const user = new FormData();
               user.append("id", myInfo.ID);
               user.append("loginid", myInfo.loginid);
               user.append("role", "customer");
               user.append("name", name);
               user.append("mobile", mobile);
               user.append("email", email);
               user.append("address", address);
              //user.append("image", profilePic);
              //alert(myInfo.ID+"2. "+myInfo.loginid+"3. "+profilePic);
              fetch(serverAddr + '/updateCustDetails.php', {
                method: 'post',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'multipart/form-data',
                },
                body: user
              })
                .then((response) => response.json())
                .then((responseJson) => {
                  Toast.show({
                    text: "Details uploaded successfully",
                    duration: 5000,
                    buttonText: "Okey",
                    type : "success",
                    textStyle:{fontWeight:'bold'}
                    
                  })
                  AsyncStorage.setItem('LoggedIn',JSON.stringify(responseJson));
                  if(!isNaN(responseJson.image)&&responseJson.image!="")
                    responseJson.image=imageURL+responseJson.image+".jpg";
                setName(responseJson.name.toUpperCase());
                setMobile(responseJson.mobile);
                setEmail(responseJson.email);
                setAddress(responseJson.address);
                setLoginid(responseJson.loginid);
               responseJson.image!=""?setProfilePic(responseJson.image):null;
              setMyInfo(responseJson)
                });
              // RNFetchBlob.fetch('POST', serverAddr + '/updateCustDetails.php', {
              //   Authorization : "Bearer access-token",
              //   otherHeader : "foo",
              //   'Content-Type' : 'multipart/form-data',
              // }, [
              //   { name : 'image', filename : 'image.png', type:'image/png', data: uploadedImageData},
              // ]).then((resp) => {
              //   // ...
              //   console.log(resp);
              // }).catch((err) => {
              //   // ...
              // })
            }
        })
    }
  }

  return (
    <Root>
    <Container >
      <MyHeader  navigation={props.navigation} title="home" tabName="Profile" />
      <Content >
        <View style={{flex:1,margin:0,padding:10,backgroundColor:'teal',alignItems:'center'}}>
        <Image source={{uri:profilePic}} 
        style={{width:100,height:100,borderRadius:50,borderWidth:3,borderColor:'#fff',margin:10}}
        />
                {/* <Button iconLeft bordered style={{borderColor:'teal'}} onPress={()=>chooseImage()}>
                <FontAwesomeIcon icon={faEdit} style={{marginLeft:20,color:'white'}} />
                  <Text style={{fontSize:12,fontWeight:'bold',color:'white'}}>Change</Text>
                </Button> */}
        </View>
        <View style={{flex:1,padding:10}}>
            <Item floatingLabel>
              <Label style={{fontSize:10,fontWeight:'bold'}}>Name :</Label>
              <Input autoCapitalize='characters'  returnKeyType="done" onChangeText={(value)=>{setName(value)}} value={name} style={{fontWeight:'bold',fontSize:12}} />
            </Item>
            <Item floatingLabel style={{marginTop:10}}>
              <Label style={{fontSize:10,fontWeight:'bold'}}>Mobile :</Label>
              <Input returnKeyType="done" onChangeText={(value)=>setMobile(value)} value={mobile} keyboardType={Platform.OS == "android" ? "numeric" : "number-pad"} style={{fontWeight:'bold',fontSize:12}} />
            </Item>
            <Item floatingLabel style={{marginTop:10}}>
              <Label style={{fontSize:10,fontWeight:'bold'}}>Email :</Label>
              <Input returnKeyType="done" disabled={loginid=="none"}  onChangeText={(value)=>setEmail(value)} value={email} keyboardType='email-address' textContentType='emailAddress' autoCapitalize='none' style={{fontWeight:'bold',fontSize:12}} />
            </Item>
            <Item floatingLabel style={{marginTop:10}}>
              <Label style={{fontSize:10,fontWeight:'bold'}}>Address :</Label>
              <Input onChangeText={(value)=>setAddress(value)} value={address} multiline={true} style={{fontWeight:'bold',fontSize:12}} />
            </Item>
        </View>
        {/* <Card style={{flex:1,borderColor:'teal',paddingBottom:20,borderRadius:20}}>
          <CardItem style={{flex:1,flexDirection:'column',justifyContent:'center',backgroundColor:'teal',borderTopLeftRadius:20,borderTopRightRadius:20}}>
                <Image source={{uri:profilePic}} 
                style={{width:100,height:100,borderRadius:50,borderWidth:3,borderColor:'#fff',margin:20}}
                />
                <Button iconLeft bordered light
                // onPress={() =>
                //   ActionSheet.show(
                //     {
                //       options: BUTTONS,
                //       cancelButtonIndex: 2,
                //       title: "Change Profile Picture"
                //     },
                //     buttonIndex => {
                //       setprofilePicIndex(buttonIndex);
                //       if(buttonIndex==1)
                //         {
                //           alert('hello');
                //           chooseImage()
                //         }
                //     }
                //   )}
                onPress={()=>chooseImage()}
                >
                  <FontAwesomeIcon icon={faEdit} style={{marginLeft:20,color:'white'}} />
                  <Text style={{fontSize:12,fontWeight:'bold',color:'white'}}>Change</Text>
                </Button>
          </CardItem>
          <CardItem style={{marginLeft:10,marginRight:10,marginTop:10}}>
            <Left>
            <Item floatingLabel>
              <Label style={{fontSize:10,fontWeight:'bold'}}>Name :</Label>
              <Input autoCapitalize='characters'  returnKeyType="done" onChangeText={(value)=>{setName(value)}} value={name} style={{fontWeight:'bold',fontSize:12}} />
            </Item>
            </Left>
          </CardItem>
          <CardItem >
            <Item stackedLabel>
              <Label style={{fontSize:10,fontWeight:'bold'}}>Mobile :</Label>
              <Input returnKeyType="done" onChangeText={(value)=>setMobile(value)} value={mobile} keyboardType={Platform.OS == "android" ? "numeric" : "number-pad"} style={{fontWeight:'bold',fontSize:12}} />
              
            </Item>
          </CardItem>
          <CardItem style={{marginLeft:10,marginRight:10}}>
            <Left>
            <Item floatingLabel>
              <Label style={{fontSize:10,fontWeight:'bold'}}>Email :</Label>
              <Input returnKeyType="done" disabled={true} onChangeText={(value)=>setEmail(value)} value={email} keyboardType='email-address' textContentType='emailAddress' autoCapitalize='none' style={{fontWeight:'bold',fontSize:12}} />
            </Item>
            </Left>
          </CardItem>
          <CardItem style={{marginLeft:10,marginRight:10,marginTop:10}}>
            <Left>
            <Item floatingLabel>
              <Label style={{fontSize:10,fontWeight:'bold'}}>Address :</Label>
              <Input onChangeText={(value)=>setAddress(value)} value={address} multiline={true} style={{fontWeight:'bold',fontSize:12}} />
            </Item>
            </Left>
          </CardItem>
        </Card> */}

        <View style={{padding:60}}>

        </View>
       </Content>
    </Container>
    {!isKeyboardVisible?
      <Button block onPress={()=>validite()} style={{ backgroundColor: 'teal', borderRadius: 5, width: '95%',height:60, alignSelf: 'center', position: 'absolute', bottom: '5%' }}>
          <FontAwesomeIcon style={{color:'white'}} icon={faPaperPlane} />
          <Text style={{ fontWeight: 'bold',fontSize:14}}>UPDATE</Text>
        </Button>
        :null }
    </Root>
  );
};

export default Home;