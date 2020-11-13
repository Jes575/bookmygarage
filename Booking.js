import React, {useState,useEffect} from "react";
import { View, Dimensions, Image, FlatList,BackHandler,Alert} from "react-native";
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



var count=0;

const Booking = (props,{navigation}) => {
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
  

  const getCurrentLoc =()=>{
    Geolocation.getCurrentPosition(
      position => {
        const initialPosition = position;
        setGeoLat(initialPosition.coords.latitude);
        setGeoLong(initialPosition.coords.longitude);
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + initialPosition.coords.latitude + ',' + initialPosition.coords.longitude + '&key=' + myApiKey)
      .then((response) => response.json())
      .then((responseJson) => {
         // console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson.results[0].formatted_address));
          setFormatedAddr(responseJson.results[0].formatted_address);
        })
      },
      error => Alert.alert('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }

  useEffect(() => {
    
    setRedirect(false);
    var newarr=new Array();
    const user= new FormData();
    Geocoder.init(myApiKey);

    setToggleLoc(true);
      user.append("name", "123");
      // debugger;
      try{
      fetch(serverAddr+'/getCarmake.php',{
        method:'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
      },
      body:user
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        var len=Object.keys(responseJson).length;
        for(var i=0;i<len;i++)
        {
            newarr.push(responseJson[i]['make']);
        }  
        setCarMake(newarr);
        
      })
      .catch((e) => {
        console.error(e)
      });
    }
    catch(e)
    {
      console.error(e);
    }

    getCurrentLoc();
    
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
      
      return()=>{
        BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
      }

    }, [])

    handleBackButton = () => {
      Alert.alert(
        "Exit App",
        "Are you sure to exit the application?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK",onPress:()=>BackHandler.exitApp()}
        ],
        { cancelable: false }
      );
      return true;
     } 
    
  const BookingScreen=({navigation})=>{
    let carMakeItems= carMake.map( (s, i) => {
      return <Picker.Item key={s} value={s} label={s} />
    });
  
    let carModelItems= carModel.map( (s, i) => {
      return <Picker.Item key={s} value={s} label={s} />
    });
  
    let carServiceItems= carService.map( (s, i) => {
      return <Picker.Item key={s} value={s} label={s} />
    });
    const onMakeValueChange = (value) => {
      const newSelected=value;
        setMakeSelected(newSelected);
        var newarr=new Array();
      const user= new FormData();
        user.append("make", value);
        fetch(serverAddr+'/getCarModel.php',{
          method:'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
        },
        body:user
        })
        .then((response) => response.json())
        .then((responseJson) => {
          //console.log(responseJson);
         
          var len=Object.keys(responseJson).length;
          for(var i=0;i<len;i++)
          {
              newarr.push(responseJson[i]['model']);
          }
          
          setCarModel(newarr);
          
        });
      
    };
  
    const onSelectGoogleLoc=(value) => {
      setMyLoc(value.result.formatted_address);
      setToggleLoc(!(toggleLoc));
      // console.log("rohan");
      // console.log(value.result.geometry.location);
      setGeoLat(value.result.geometry.location.lat);
      setGeoLong(value.result.geometry.location.lng);
      setFormatedAddr(value.result.formatted_address);
      // Geocoder.from(value)
      //     .then(json => {
      //         var location = json.results[0].geometry.location;
      //         console.log(location);
      //     })
      //     .catch(error => console.warn(error));
      //alert(lat);
      //alert(lng);
    }
  
  
    const onModelValueChange =(value) => {
      const newSelected=value;
      setModelSelected(newSelected);
      var newarr=new Array();
      const user= new FormData();
        user.append("name", "123");
        fetch(serverAddr+'/getServiceDetails.php',{
          method:'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
        },
        body:user
        })
        .then((response) => response.json())
        .then((responseJson) => {
          //console.log(responseJson);
         
          var len=Object.keys(responseJson).length;
          for(var i=0;i<len;i++)
          {
              newarr.push(responseJson[i]['name']+responseJson[i]['ttype']);
          }
          
          setCarService(newarr);
          
        });
      
  
    }
  
    const onServiceValueChange =(value) => {
      const newSelected=value;
      //if(newSelected)
      
      setServiceSelected(newSelected);
      //alert(selectedService);
    }
    const onFindGaragePress =() =>{
      
        if(selectedMake)
        {
          if(selectedModel)
          {
            if(geoLong&&geoLat)
            {
              if(selectedService)
              {
                navigation.navigate('Garage',{'make':selectedMake,'model':selectedModel,'service':selectedService,'geoLat':geoLat,'geoLong':geoLong,'props':props,'formatedAddr':formatedAddr})
              }
              else
              {
                Toast.show({
                  text: "Select Some Service",
                  duration: 5000,
                  buttonText: "Okey",
                  buttonStyle: {backgroundColor: '#992222',color:'#fff',borderRadius:5,opacity:0.7},
                  type : "danger",
                })
              }
            }
            else
            {
              Toast.show({
                text: "Select Location",
                duration: 5000,
                buttonText: "Okey",
                buttonStyle: {backgroundColor: '#992222',color:'#fff',borderRadius:5,opacity:0.7},
                type : "danger",
              })
            }
          }
          else
          {
            Toast.show({
              text: "Select Car Model",
              duration: 5000,
              buttonText: "Okey",
              buttonStyle: {backgroundColor: '#992222',color:'#fff',borderRadius:5,opacity:0.7},
              type : "danger",
            })
          }
        }
        else
        {
          Toast.show({
            text: "Select Car Make",
            duration: 5000,
            buttonText: "Okey",
            buttonStyle: {backgroundColor: '#992222',color:'#fff',borderRadius:5,opacity:0.7},
            type : "danger",
          })
        } 
      
    }
    return(
      <Root style={{padding:0,margin:0}}>
      <Container  >
<MyHeader navigation={props.navigation} title="perm-contact-calendar" tabName="Booking">

</MyHeader>

<Segment>
<Button style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }} first active={segmentNumber == 1} onPress={() => setSegmentFunc(1)}>
              <Text style={{ fontWeight: 'bold',fontSize:12}}>Book Service </Text>
            </Button>
  <Button style={{ borderTopRightRadius: 5, borderBottomRightRadius: 5 }} last active={segmentNumber == 2} onPress={() => navigation.navigate('Tyre')}>
              <Text style={{ fontWeight: 'bold',fontSize:12}}>Tyre Service </Text>
            </Button>
</Segment>
  <Form>
      {/* Location */}
    <View style={{width:'100%'}}>  
       {
        (toggleLoc) ?
       <Card >
         <CardItem style={{backgroundColor:'#303855'}}>
          <Body style={{flexDirection:'row'}}>
            <Icon name="md-locate" style={{fontSize:13,color:'#00ffff',fontWeight:'bold'}}> Location : </Icon>
            <Text style={{fontSize:12,fontWeight:'bold',color:'#00ffff'}}>{formatedAddr}</Text>
          </Body>
          <Right>
            <Button style={{borderTopLeftRadius: 5, borderBottomLeftRadius: 5,width:'50%' }}
             danger onPress={()=>setToggleLoc(!(toggleLoc))}>
              <Text style={{fontSize:10}}>Change</Text>
            </Button>
          </Right>
         </CardItem>
       </Card>
        :
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
            <Button onPress={()=>{getCurrentLoc();setToggleLoc(!(toggleLoc))}} primary style={{flexDirection:'row'}}>
            <Icon name="md-locate" />
            <Text style={{paddingLeft:-5}}>Auto Detect</Text>
            </Button>
            </Left>
            <Right>
            <Button danger style={{flexDirection:'row'}} onPress={()=>setToggleLoc(!(toggleLoc))}>
            <Icon name="ios-close-circle" />
            <Text style={{paddingLeft:-5}}>Cancel</Text>
            </Button>
            </Right>
            </Body>
          </CardItem>
        </Card>
        
        }
      </View>
        
      {/* Make , Model, Service */}
    <View style={{marginLeft:20,marginRight:30}}>
      
      {/* Car Make */}
      <View style={{marginTop:20}}>
        <View style={{flexDirection:'row'}}> 
          <Icon name="car" style={{fontSize:15}}></Icon>    
          <Text style={{fontWeight:'bold',fontSize:12}}>{"  "}Car Make: </Text>
        </View>
        <Picker
          mode="dropdown"
          style={{ width: Dimensions.get('screen').width}}
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
      
      {/* Car Model */}
      <View style={{marginTop:30}}>
        <View style={{flexDirection:'row'}}> 
          <Icon name="car" style={{fontSize:15}}></Icon>    
          <Text style={{fontSize:12,fontWeight:'bold'}}>{"  "}Car Model: </Text>
        </View>
        <Picker
          mode="dropdown"
          style={{ width: Dimensions.get('screen').width}}
          itemTextStyle={{fontWeight:'bold',fontSize:14}}
          placeholderStyle={{fontSize:12}}
          textStyle={{fontSize:14,fontWeight:'bold'}}
          selectedValue={selectedModel}
          onValueChange={(value)=>onModelValueChange(value)}
          placeholder={"Select one"}
        >
          <Picker.Item label="Select Model"  value="" />
        {carModelItems}
        </Picker>
        <Divider />
      </View>

      {/* Car Service */}
      <View style={{marginTop:30}}>
        <View style={{flexDirection:'row'}}> 
          <Icon name="md-settings" style={{fontSize:15}}></Icon>    
          <Text style={{fontSize:12,fontWeight:'bold'}}>{"  "}Service: </Text>
        </View>
        <Picker
          mode="dropdown"
          style={{ width: Dimensions.get('screen').width}}
          itemTextStyle={{fontWeight:'bold',fontSize:14}}
          placeholderStyle={{fontSize:12}}
          textStyle={{fontSize:14,fontWeight:'bold'}}
          selectedValue={selectedService}
          onValueChange={(value)=>onServiceValueChange(value)}
          placeholder={"Select one"}
        >
          <Picker.Item label="Select Service" value="" />
          {carServiceItems}
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
    
    
  </Form>

</Container>
      </Root>
    )
  }


  const Stack = createStackNavigator();
  return (
    
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Booking" component={BookingScreen} />
        <Stack.Screen name="Garage" component={GarageScreen} />
        <Stack.Screen name="SelectService" component={SelectServiceScreen} />
        <Stack.Screen name="Tyre" component={TyreScreen} />
      </Stack.Navigator>
    
  );
};

export default Booking;


