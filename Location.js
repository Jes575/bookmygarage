import React,{useState,useEffect} from "react";
import { Image,ImageBackground,Keyboard,TouchableOpacity,Dimensions,Alert} from "react-native";
import {Container,Content,View,Text,Root, Card, CardItem, Left, Item, Label,Input, Button, Icon,ActionSheet,Toast, Body, Right,Picker} from 'native-base';
import MyHeader from './MyHeader';
import {Divider} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import {serverAddr,myApiKey} from '../App';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Geolocation from '@react-native-community/geolocation';
import { faCar, faEdit, faTrash, faTrashAlt, faPlusCircle, faTimes, faAddressCard, faLocationArrow, faMapMarked, faMapMarker, faMapMarkerAlt, faMapPin, faMapSigns } from "@fortawesome/free-solid-svg-icons";
import Modal from 'react-native-modal';
import PlacesInput from 'react-native-places-input';


const Location = props => {
  const [myInfo,setMyInfo]=useState('');
  const [isLocationFound, setIsLocationFound]=useState(false);
  const [showModel,setShowModel]=useState(false);
  const [myLoc, setMyLoc] = useState(0);
  const [geoLat, setGeoLat] = useState(0);
  const [geoLong, setGeoLong] = useState(0);
  const [formatedAddr, setFormatedAddr] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem('LoggedIn')
      .then((token) => {
        token = JSON.parse(token);
        setMyInfo(token);
        const user = new FormData();
        var loglatarr=token.location.split(',');
        //alert(loglatarr);
        str="";
        if(loglatarr.length==2)
        {
          setIsLocationFound(true);
          fetch("https://maps.googleapis.com/maps/api/geocode/json?latlng="+parseFloat(loglatarr[0])+","+parseFloat(loglatarr[1])+"&key="+myApiKey, {
            method: 'GET'
          })
            .then((response) => response.json())
            .then((responseJson) => { 
              for (var i = 0; i < responseJson.results[0].address_components.length; i++) {
                if (i == 0)
                  str = responseJson.results[0].address_components[i].long_name;
                else
                  str += "," + responseJson.results[0].address_components[i].long_name;
              }
              setFormatedAddr(str);
            })

        }
      });
  },[]);

  const getCurrentLoc =()=>{
    Geolocation.getCurrentPosition(
      position => {
        const initialPosition = position;
        setGeoLat(initialPosition.coords.latitude);
        setGeoLong(initialPosition.coords.longitude);
        setIsLocationFound(true);
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + initialPosition.coords.latitude + ',' + initialPosition.coords.longitude + '&key=' + myApiKey)
      .then((response) => response.json())
      .then((responseJson) => {
         // console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson.results[0].formatted_address));
          setFormatedAddr(responseJson.results[0].formatted_address);
        var user = new FormData();
        user.append("cid", myInfo.ID);
        user.append("lat", initialPosition.coords.latitude);
        user.append("long", initialPosition.coords.longitude);
        fetch(serverAddr + '/postCustlocation.php', {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          body: user
        })
          .then((response) => response.json())
          .then((responseJson) => {
            setShowModel(false);
            AsyncStorage.setItem('LoggedIn',JSON.stringify(responseJson));
          });
        })
      },
      error => Alert.alert('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }

  const onSelectGoogleLoc=(value) => {
    setMyLoc(value.result.formatted_address);
    // console.log("rohan");
    // console.log(value.result.geometry.location);
    setGeoLat(value.result.geometry.location.lat);
    setGeoLong(value.result.geometry.location.lng);
    setFormatedAddr(value.result.formatted_address);
    setIsLocationFound(true);
    var user= new FormData();
    user.append("cid",myInfo.ID);
    user.append("lat",value.result.geometry.location.lat);
    user.append("long",value.result.geometry.location.lng);
    
    fetch(serverAddr + '/postCustlocation.php', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: user
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setShowModel(false);
        AsyncStorage.setItem('LoggedIn',JSON.stringify(responseJson));
      });
  }

  return (
    <Root>
      <Container style={{backgroundColor:'#efefef'}}>
      <MyHeader navigation={props.navigation} title="add-location" tabName="Location" />
      <View style={{paddingTop:20,paddingBottom:10,alignSelf:'center',flexDirection:'row'}}>
        <FontAwesomeIcon icon={faMapMarkerAlt} size={17} style={{marginRight:20,color:'teal',alignSelf:'center'}} />
      <Text style={{fontSize:20,fontWeight:'bold'}}>Location Details</Text>
      </View>
      <Divider style={{backgroundColor:'teal',width:'90%',alignSelf:'center'}} />
      {!isLocationFound?
      <Card>
        <CardItem>
          <Left>
            <View style={{ borderColor: 'blue', borderRightWidth: 1 }}>
              <FontAwesomeIcon icon={faMapMarkerAlt} style={{ margin: 10, padding: 15, color: 'red' }} />
            </View>
            <Body>
              <View>
                <Text style={{ fontWeight: 'bold', fontSize: 14, color:'crimson' }}>Location not added</Text>
                <Text note style={{ fontSize: 12, fontWeight: 'bold' }}>Add your locations for better searching results</Text>
              </View>
            </Body>
          </Left>
        </CardItem>
      </Card>
        :
        <Card>
        <CardItem>
          <Left>
            <View style={{ borderColor: 'blue', borderRightWidth: 1 }}>
              <FontAwesomeIcon icon={faMapMarkerAlt} style={{ margin: 10, padding: 15, color: 'blue' }} />
            </View>
            <Body>
              <View>
                <Text style={{ fontWeight: 'bold', fontSize: 14, color:'blue' }}>Your Location :</Text>
                <Text note style={{ fontSize: 12, fontWeight: 'bold',color:'green',paddingTop:10 }}>{formatedAddr}</Text>
              </View>
            </Body>
          </Left>
        </CardItem>
      </Card>
        }
        <Button danger onPress={()=>setShowModel(true)} style={{ alignSelf: 'center', margin: 20, backgroundColor: 'teal' }}>
          <FontAwesomeIcon icon={faPlusCircle} style={{ marginLeft: 10, color: 'white' }} />
          <Text >{isLocationFound ? "Change Your Location" : "Add New Location"}</Text>
        </Button>
        <Modal animationOut='slideOutUp' animationIn='slideInDown' avoidKeyboard={true}  isVisible={showModel}>
          <View style={{ flex: 1 }} style={{backgroundColor:'white',padding:10}}>
          <TouchableOpacity onPress={()=>setShowModel(false)}>
              <FontAwesomeIcon style={{alignSelf:'flex-end',color:'red'}} icon={faTimes} />
            </TouchableOpacity>
          <Card>
          <CardItem>
            <Body>
            <PlacesInput
          placeHolder={'Search Location'}
          stylesContainer={{
              position: 'relative',
              alignSelf: 'stretch',
              margin: 0,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              shadowOpacity: 0,
              borderColor: '#dedede',
              borderWidth: 1,
              marginBottom: 10
          }}
          stylesList={{
              
              borderColor: '#dedede',
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderBottomWidth: 1,
              left: -1,
              right: -1
          }}
          googleApiKey={'AIzaSyAO05QCAiYweEOHTnZjQfWd--hF0WNsrzQ'}
          onSelect={place => onSelectGoogleLoc(place) }
          queryCountries={['ae']}
          iconResult={<Icon name="md-pin" size={12} color={'red'} style={{fontSize:12}} />}
          iconInput={<Icon name="md-pin" size={12} style={{fontSize:12}} />}
          value={myLoc}
          />
            </Body>
          </CardItem>
          <CardItem>
            <Body style={{flexDirection:'row'}}>
              <Left>
            <Button block onPress={()=>{getCurrentLoc()}} primary style={{flexDirection:'row'}}>
            <Icon name="md-locate" />
            <Text style={{paddingLeft:-5}}>Auto Detect</Text>
            </Button>
            </Left>
            </Body>
          </CardItem>
        </Card>
 
          </View>
        </Modal>
          
      </Container>
    </Root>
    
  );
};

export default Location;