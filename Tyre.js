import React, {useState,useEffect,Component} from "react";
import { View, Dimensions, Image, FlatList,BackHandler,Alert,TextInput} from "react-native";
import { Container, Header, Content, Picker, Form,Toast, Card,CardItem, Text, Icon, Button , Left, Body,Right, Root, Segment} from "native-base";
import {Divider} from 'react-native-elements';
import MyHeader from './MyHeader';
import {serverAddr} from '../App';
import {myApiKey} from '../App';
import PlacesInput from 'react-native-places-input';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearchLocation } from "@fortawesome/free-solid-svg-icons";
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import GarageScreen from './Garages';
import SelectServiceScreen from './SelectService';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TyreScreen from './Tyre';

const Tyre = (props,{navigation}) => {
const [selectedMake, setMakeSelected] = useState(0);
  const [selectedModel, setModelSelected] = useState(0);
  const [selectedService, setServiceSelected] = useState(0);
  const [carMake, setCarMake] = useState([]);
  const [carModel, setCarModel] = useState([]);
  const [carService, setCarService] = useState([]);
  const [myLoc, setMyLoc] = useState(0);
  const [geoLat, setGeoLat] = useState(0);
  const [geoLong, setGeoLong] = useState(0);
  const [formatedAddr, setFormatedAddr] = useState(0);
  const [toggleLoc, setToggleLoc] = useState(0);
  const [redirect, setRedirect] = useState(0);
  const [segmentNumber, setSegmentNumber] = useState(1);



 

 let carMakeItems= carMake.map( (s, i) => {
      return <Picker.Item key={s} value={s} label={s} />
    });


  let carModelItems= carModel.map( (s, i) => {
      return <Picker.Item key={s} value={s} label={s} />
    });
  

   let carServiceItems= carService.map( (s, i) => {
      return <Picker.Item key={s} value={s} label={s} />
    });


return(
      <Root style={{padding:0,margin:0}}>
      <Container>
      <MyHeader navigation={props.navigation} title="perm-contact-calendar" tabName="Booking">

    </MyHeader>


<Segment>
<Button style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }} last active={segmentNumber == 2} onPress={() => navigation.navigate('Booking')}>
              <Text style={{ fontWeight: 'bold',fontSize:12}}>Book Service </Text>
            </Button>
  <Button style={{ borderTopRightRadius: 5, borderBottomRightRadius: 5 }} first active={segmentNumber == 1} onPress={() =>setSegmentFunc(1)}>
              <Text style={{ fontWeight: 'bold',fontSize:12}}>Tyre Service </Text>
            </Button>
</Segment>

{/* Width , Height, Rim */}
    <View style={{marginLeft:20,marginRight:30}}>
 {/* Tyre Width */}
      <View style={{marginTop:20}}>
        <View style={{flexDirection:'row'}}> 
          <Icon name="car" style={{fontSize:15}}></Icon>    
          <Text style={{fontWeight:'bold',fontSize:12}}>{"  "}Tyre Width: </Text>
        </View>

        <Picker
          mode="dropdown"
          style={{ width:"110%" }}
          itemTextStyle={{fontWeight:'bold',fontSize:14}}
          placeholderStyle={{fontSize:12}}
          textStyle={{fontSize:14,fontWeight:'bold'}}
          onValueChange={(value)=>onMakeValueChange(value)}
          placeholder={"Select one"}
        >
          <Picker.Item label="Select Make" value="" />
          {carMakeItems}
        </Picker>
        <Divider />
        </View>

        {/* Tyre Height */}
      <View style={{marginTop:30}}>
        <View style={{flexDirection:'row'}}> 
          <Icon name="car" style={{fontSize:15}}></Icon>    
          <Text style={{fontSize:12,fontWeight:'bold'}}>{"  "}Tyre Height: </Text>
        </View>

      <Picker
          mode="dropdown"
          style={{ width: '110%'}}
          itemTextStyle={{fontWeight:'bold',fontSize:14}}
          placeholderStyle={{fontSize:12}}
          textStyle={{fontSize:14,fontWeight:'bold'}}
          selectedValue={selectedMake}
          onValueChange={(value)=>onMakeValueChange(value)}
          placeholder={"Select one"}
        >
          <Picker.Item label="Select Make" value="" />
          {carMakeItems}
        </Picker>
        <Divider />
        </View>


        {/* Tyre Rim */}
      <View style={{marginTop:30}}>
        <View style={{flexDirection:'row'}}> 
          <Icon name="md-settings" style={{fontSize:15}}></Icon>    
          <Text style={{fontSize:12,fontWeight:'bold'}}>{"  "}Tyre Rim: </Text>
        </View>

        <Picker
          mode="dropdown"
          style={{ width: '110%'}}
          itemTextStyle={{fontWeight:'bold',fontSize:14}}
          placeholderStyle={{fontSize:12}}
          textStyle={{fontSize:14,fontWeight:'bold'}}
          selectedValue={selectedMake}
          onValueChange={(value)=>onMakeValueChange(value)}
          placeholder={"Select one"}
        >
          <Picker.Item label="Select Make" value="" />
          {carMakeItems}
        </Picker>
        <Divider />
        </View>

        {/* Find Garge Button */}
      <View style={{marginTop:40}}>
        
          <Button primary block style={{alignItems:'center'}} onPress={(navigation)=>{onFindGaragePress(navigation)}}>
            <Icon name="ios-bus" style={{fontWeight:'bold'}}></Icon>
            <Text style={{fontWeight:'bold'}}>Find Garages</Text>
          </Button>
        
      </View>
        </View>
      </Container>
      </Root>
    )
};

export default Tyre;