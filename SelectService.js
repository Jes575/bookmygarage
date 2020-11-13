import React, { useState, useEffect,useRef,createRef } from "react";
import { Dimensions, Image, Platform,Switch, TextInput, KeyboardAvoidingView, FlatList, StatusBar, TouchableOpacity,BackHandler,Linking,ActivityIndicator,Keyboard } from "react-native";
import { Container, Header, Title,Textarea, Subtitle, Content, Input, DatePicker, Toast, Root, Item, Form, Badge, Card, CardItem, View, Text, Icon, Button, Left, Body, Right, Thumbnail, Spinner, Picker, Footer, FooterTab, Segment, ListItem, CheckBox, Label } from "native-base";
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Divider, Tooltip } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { serverAddr,imageURL,URLRoot } from '../App'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEnvelope, faPhoneAlt, faPhoneSlash, faPhone, faPhoneSquare, faPhoneVolume, faBlenderPhone,faCalendar, faUserCircle, faGlobe, faCarCrash, faCarAlt, faHome, faMapPin, faLocationArrow, faCar,faQuestionCircle, faCalendarCheck, faCalendarDay, faCalendarAlt, faComment, faCommentAlt, faCommentMedical, faComments, faPaperPlane, faMale, faPersonBooth, faMobile, faMapMarked } from "@fortawesome/free-solid-svg-icons";
import StarRating from 'react-native-star-rating';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';


const SelectService = ({ route, navigation }) => {
  const { id } = route.params;
  const { make } = route.params;
  const { model } = route.params;
  const { service } = route.params;
  const { formatedAddr } = route.params;
  const { gdetails } = route.params;
  const { geoLat } = route.params;
  const { geoLong } = route.params;
  const { props } = route.params;

  const [segmentNumber, setSegmentNumber] = useState(1);
  const [secSegmentNumber, setSecSegmentNumber] = useState(1);
  const [tabNumber, setTabNumber] = useState(1);
  const [mapDetails, setMapDetails] = useState([]);
  const [commentDetails, setCommentDetails] = useState([]);
  const [colorItems, setColorItems] = useState([]);
  const [selectedServicesName, setSelectedServicesName] = useState([]);
  const [selectedServicesPrice, setSelectedServicesPrice] = useState([]);
  const [selectedServicesOffers, setSelectedServicesOffers] = useState([]);
  const [selectedServicesMid, setSelectedServicesMid] = useState([]);
  const [value, onChangeText] = React.useState('Useless Placeholder');
  const [name1, setName] = useState("");
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [isCad, setCad] = useState(false);
  const [isDo, setDo] = useState(false);
  const [commentFlag, setCommentFlag] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [totalSav, setTotalSav] = useState(0);
  const [cdate, setCDate] = useState(new Date(new Date().setDate(new Date().getDate()-1)));
  const [tempCDate, setTempCDate] = useState(new Date());
  const [myInfo, setMyInfo] = useState({});
  const [enableDateLabel, setEnableDateLabel] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [navigateTo, setNavigateTo] = useState('Garage');
  const [latDelta, setLatDelta] = useState(2);
  const [longDelta, setLongDelta] = useState(0.0001);
  const [scrollComp, setScrollComp] = useState([]);
  const [unavailable, setUnavailable] = useState({});
  const [postStars, setPostStars] = useState(3);
  const [feedback, setFeedback] = useState('');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const myInput = useRef();
  const scrollView=useRef();
  var myServices = []
  var myComments = []
  var mySelServices = []
  var tempCost = [];
  var colorList = [];
  var tempID = "";
  var tempName = "";
  var tempArr = [];
  var mycal=[];
  
  useEffect(() => {
    var tempService = service.split("(");
    var newService = tempService[0];
    //setDate(cdate.getDate()-1);
    //setTempCDate(setTempCDate.getDate()-1);
    const user = new FormData();
    user.append("id", id);
    fetch(serverAddr + '/getGarageDetailsByIDBooking.php', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: user
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setMapDetails(responseJson);
        responseJson.forEach(function (details) {
          if (details.sname == newService) {
            setColorItems(colorItems.concat(details.ID + "/" + details.sname + "/" + details.price + "/" + details.offers + "/" + (details.price - details.price * details.offers / 100)));
            setTotalCost(prev => prev + (details.price - details.price * details.offers / 100));
            setTotalSav(prev => prev + (details.price * details.offers / 100));
            setSelectedServicesMid(selectedServicesMid.concat(details.ID));
      setSelectedServicesName(selectedServicesName.concat(details.sname));
      setSelectedServicesPrice(selectedServicesPrice.concat(details.price));
      setSelectedServicesOffers(selectedServicesOffers.concat(details.offers));
          }
        })
      });

      AsyncStorage.getItem('LoggedIn')
            .then((token) => { 
               token=JSON.parse(token);
               if(!isNaN(token.image))
                    token.image=imageURL+token.image+".jpg";
              setMyInfo(token)
               //console.log("********* = "+myInfo.mobile);
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

  }, [])

  const handleInputChange = (e) => {
    console.log(e);
    setName(e);
  }
  
  const toggleSwitch = () => setCad(previousState => !previousState);

  const toggleSwitchDo = () => setDo(previousState => !previousState);

  const handleChange = (id, name, price, offers) => {
    var cost = 0;
    cost = price - price * offers / 100;
    if (colorItems.indexOf(id + "/" + name + "/" + price + "/" + offers + "/" + cost) != -1) {

      setColorItems(colorItems.filter(item => (item !== id + "/" + name + "/" + price + "/" + offers + "/" + cost)));
      tempArr.pop(id);
      setTotalCost(prev => prev - cost)
      setTotalSav(prev => prev - (price * offers / 100));
      setSelectedServicesMid(selectedServicesMid.filter(item=>(item!==id)));
      setSelectedServicesName(selectedServicesName.filter(item=>(item!==name)));
      setSelectedServicesPrice(selectedServicesPrice.filter(item=>(item!==price)));
      setSelectedServicesOffers(selectedServicesOffers.filter(item=>(item!==offers)));

    }
    else {
      setColorItems(colorItems.concat(id + "/" + name + "/" + price + "/" + offers + "/" + cost));
      tempArr.push();
      setTotalCost(prev => prev + cost)
      setTotalSav(prev => prev + (price * offers / 100));
      setSelectedServicesMid(selectedServicesMid.concat(id));
      setSelectedServicesName(selectedServicesName.concat(name));
      setSelectedServicesPrice(selectedServicesPrice.concat(price));
      setSelectedServicesOffers(selectedServicesOffers.concat(offers));

    }

  }

  const postComment=()=>{
    const user = new FormData();
    user.append("gid", id);
    user.append("trid", 0);
    user.append("cid", myInfo.ID);
    user.append("rating", postStars);
    user.append("feedback", feedback);
  fetch(serverAddr + '/postUpdateFeedback.php', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: user
  })
    .then((response) => response.json())
    .then((responseJson) => {
      gdetails['rating']=responseJson['rating'];
        setTabFunc(3);
        setFeedback('');
        setPostStars(3);
        myInput.current._root.blur();
        //console.log(responseJson);
    })
  }

  const onStarRatingPress =(rating)=>{
    setPostStars(rating);
  }

  const changeDate = (mydate) => {
    setEnableDateLabel(true);
    setCDate(mydate);
    console.log(cdate);
  }

  const setSegmentFunc= (val) => {
    setSegmentNumber(val);
    //scrollComp._root.scrollToPosition(0, 0);
  }

  const focusInput = () =>{
    myInput.current.focus();
  }

  const setTabFunc= (val)=>{
    setTabNumber(val);
    if(val==3)
    {
      const user = new FormData();
      user.append("gid", id);
      fetch(serverAddr + '/getFeedbackByGid.php', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: user
      })
        .then((response) => response.json())
        .then((responseJson) => {
          // for(var i=0;i<responseJson.length;i++)
          // {
          //   if(!isNaN(responseJson[i].image))
          //   responseJson[i].image=imageURL+responseJson[i].image+".jpg";
          // }
            setCommentDetails(responseJson);
           // console.log(responseJson);
            //console.log(/^\d+$/.test(responseJson.image));
            
        })
    }
    if(val==4)
    {
      const user = new FormData();
      user.append("gid", id);
      fetch(serverAddr + '/getUnavailable.php', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: user
      })
        .then((response) => response.json())
        .then((responseJson) => {
            setUnavailable(responseJson);
        })
    }

  }

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join('-');
}

  const validate =() => {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    var formatedCdate=formatDate(cdate);
    if(colorItems.length<=0)
    {
      setSegmentNumber(1);
      Toast.show({
        text: "Please PICK some service.",
        duration: 5000,
        buttonText: "Okey",
        buttonStyle: {backgroundColor: '#992222',color:'#fff',borderRadius:5,opacity:0.7},
        type : "danger",
        textStyle:{fontWeight:'bold'}
      })
    }
    else if(!name1||name1.replace(/ /g, "").length == 0)
    {
      setSegmentNumber(2);
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
      setSegmentNumber(2);
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
      setSegmentNumber(2);
      Toast.show({
        text: "Please enter your Email address.",
        duration: 5000,
        buttonText: "Okey",
        buttonStyle: {backgroundColor: '#992222',color:'#fff',borderRadius:5,opacity:0.7},
        type : "danger",
        textStyle:{fontWeight:'bold'}
      })
    }
    else if(cdate.toString().substr(4, 12) == (new Date(new Date().setDate(new Date().getDate()-1))).toString().substr(4, 12))
    {
      setSegmentNumber(2);
      Toast.show({
        text: "Please choose booking date.",
        duration: 5000,
        buttonText: "Okey",
        buttonStyle: {backgroundColor: '#992222',color:'#fff',borderRadius:5,opacity:0.7},
        type : "danger",
        textStyle:{fontWeight:'bold'}
      })
    }
    else if(mobile.length<10)
    {
      setSegmentNumber(2);
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
      setSegmentNumber(2);
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
      user.append("gid", id);
      user.append("date", formatedCdate);
      fetch(serverAddr + '/checkBookingDate.php', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: user
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          if(responseJson==1)
          {
            setSegmentNumber(2);
            Toast.show({
              text: "Garage is unavailable on "+cdate.toString().substr(4, 12)+". Select some other date.",
              duration: 10000,
              buttonText: "Okey",
              buttonStyle: { backgroundColor: '#992222', color: '#fff', borderRadius: 5, opacity: 0.7 },
              type: "danger",
              textStyle: { fontWeight: 'bold',fontSize:12 }
            })
          }
          else
          {
            const user = new FormData();
            user.append("cid", myInfo.ID);
            user.append("gid", gdetails.ID);
            user.append("cname", myInfo.name);
            user.append("gname", gdetails.gname);
            user.append("cmobile", myInfo.mobile);
            user.append("gmobile", gdetails.omobile);
            user.append("glandline", gdetails.landline);
            user.append("cmake", make);
            user.append("cmodel", model);
            user.append("clocation", formatedAddr+"*"+geoLat+","+geoLong+"*");
            user.append("bname", name1);
            user.append("bmobile", mobile);
            user.append("bemail", email);
            user.append("bnote", note);
            user.append("bdate", formatedCdate);
            user.append("selectedServicesName", selectedServicesName.toString());
            user.append("selectedServicesPrice", selectedServicesPrice.toString());
            user.append("selectedServicesOffers", selectedServicesOffers.toString());
            user.append("selectedServicesMid", selectedServicesMid.toString());
            user.append("cad", isCad);
            user.append("do", isDo);
            fetch(serverAddr + '/postTransaction.php', {
              method: 'post',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
              },
              body: user
            })
              .then((response) => response.json())
              .then((responseJson) => {
                setIsFinished(true);
                setNavigateTo('Booking');
                BackHandler.addEventListener('hardwareBackPress', () => navigation.navigate(navigateTo));
              });
          }
        });
    }
    
  }


  mapDetails.forEach(function (details) {
    myServices.push(
      <Card style={{ zIndex: -1 }}>
        <CardItem style={{ zIndex: -1, backgroundColor: colorItems.indexOf(details.ID + "/" + details.sname + "/" + details.price + "/" + details.offers + "/" + (details.price - details.price * details.offers / 100)) != -1 ? '#00203F' : 'white' }}>
          <Left style={{ zIndex: -1 }}>
            <Icon style={{ color: colorItems.indexOf(details.ID + "/" + details.sname + "/" + details.price + "/" + details.offers + "/" + (details.price - details.price * details.offers / 100)) != -1 ? '#66ff66' : 'red',borderRadius:25,borderColor:'yellow',padding:5 }} name="bus" />
            <Body>
              <Text style={{ fontWeight: 'bold', fontSize: 14, color: colorItems.indexOf(details.ID + "/" + details.sname + "/" + details.price + "/" + details.offers + "/" + (details.price - details.price * details.offers / 100)) != -1 ? 'white' : 'black' }}>{details.sname}</Text>
              {details.offers > 0 ?
                <Text style={{ fontSize: 12, color: colorItems.indexOf(details.ID + "/" + details.sname + "/" + details.price + "/" + details.offers + "/" + (details.price - details.price * details.offers / 100)) != -1 ? '#8DCFB1' : 'black' }}>Actual price :<Text style={{ textDecorationLine: 'line-through', fontSize: 12, color: colorItems.indexOf(details.ID + "/" + details.sname + "/" + details.price + "/" + details.offers + "/" + (details.price - details.price * details.offers / 100)) != -1 ? '#8DCFB1' : 'black' }}>{details.price} AED</Text></Text>
                : null}
              <Text style={{ fontWeight: 'bold', fontSize: 12 }}><Text style={{ fontSize: 12, color: colorItems.indexOf(details.ID + "/" + details.sname + "/" + details.price + "/" + details.offers + "/" + (details.price - details.price * details.offers / 100)) != -1 ? '#ADEFD1' : 'black' }}>Now</Text> <Text style={{ fontSize: 16, fontWeight: 'bold', color: colorItems.indexOf(details.ID + "/" + details.sname + "/" + details.price + "/" + details.offers + "/" + (details.price - details.price * details.offers / 100)) != -1 ? 'yellow' : 'blue' }}>{details.price - details.price * details.offers / 100} AED</Text> {details.offers > 0 ? <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 12 }}>[{details.offers}% Off]</Text> : null}</Text>
            </Body>
            <Button style={{ borderRadius: 5 }} success={colorItems.indexOf(details.ID + "/" + details.sname + "/" + details.price + "/" + details.offers + "/" + (details.price - details.price * details.offers / 100)) == -1} danger={colorItems.indexOf(details.ID + "/" + details.sname + "/" + details.price + "/" + details.offers + "/" + (details.price - details.price * details.offers / 100)) != -1} onPress={() => handleChange(details.ID, details.sname, details.price, details.offers)}>
              <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                {colorItems.indexOf(details.ID + "/" + details.sname + "/" + details.price + "/" + details.offers + "/" + (details.price - details.price * details.offers / 100)) != -1 ? "DROP" : "PICK"}
              </Text>
            </Button>
          </Left>
        </CardItem>
      </Card>
    )
  })

  commentDetails.forEach(function (details) {
    myComments.push(
      <Card style={{ zIndex: -1 }}>
        <CardItem>
          <Left>
          <Thumbnail source={require('../images/person1.jpg')} />
          <Body>
            <View style={{flexDirection:'row'}}>
            <Text style={{textTransform:'capitalize',fontWeight:'bold',fontSize:14}}>{details.cname}</Text>
            <Text style={{paddingLeft:10,fontSize:12}}>({details.grating}/5)</Text>
            </View>
            <StarRating
                      disabled={false}
                    maxStars={5}
                    rating={parseFloat(details.grating)}
                    starSize={10}
                    containerStyle={{width:Dimensions.get('screen').width*0.15}} 
                    fullStarColor={'crimson'}
                    emptyStarColor={'crimson'}/>
            
            <Text note style={{fontSize:12,paddingTop:5}}>{details.gfeedback}</Text>
          </Body>
          </Left>
        </CardItem>
      </Card>
    )
  })

  colorItems.forEach(function (details, i) {
    var d = details.split('/');
    mySelServices.push(
      <View>
        <View style={{ flexDirection: 'row', padding: 10 }}>
          <Text style={{ color: '#555555', width: '10%', fontWeight: 'bold', fontSize: 10 }}>{i + 1}</Text>
          <Text style={{ color: '#555555', width: '70%', fontWeight: 'bold', fontSize: 10 }}>{d[1]}</Text>
          <Text style={{ color: '#555555', width: '20%', fontWeight: 'bold', fontSize: 10 }}>{d[2] - d[2] * d[3] / 100} AED</Text>
        </View>
        <Divider />
      </View>
    )
  })

  const ServiceSegment = () => {
    return (
      <View>
        <Card style={{ position: 'relative', flex: 1, zIndex: -1 }}>
          <CardItem style={{ backgroundColor: '#ff414e', zIndex: -1 }}>
            <Left style={{ zIndex: -1 }}>
              <Icon style={{ color: 'white' }} name="md-checkmark-circle-outline"></Icon>
              <Body style={{ zIndex: -1 }}>
                <Text style={{ fontWeight: 'bold', color: 'yellow', zIndex: -1 }}>Select Available Services</Text>
                {colorItems.length != 0 ?
                  <Text>
                    <Text style={{ fontWeight: 'bold', color: 'white' }}>Item Selected : {colorItems.length} {"           "}</Text>
                    <Text style={{ fontWeight: 'bold', color: 'white' }}>Total : {totalCost} AED</Text>
                  </Text>
                  : null}
              </Body>
            </Left>

          </CardItem>
        </Card>
        {myServices}
        <View style={{ padding: 20 }}>
          <Text style={{ color: 'white' }}>A</Text>
        </View>
      </View>
    )
  }

  // const InfoSegment =()=>{
  //   return(
  //    )
  // }


  return (
    
    <Root>
      
      <Container>
        <StatusBar backgroundColor="teal" barStyle='light-content' />
        <Header hasSegment={false} style={{ backgroundColor: 'teal', height: 80 }}
        >
          <Left>
            <Button transparent onPress={() => navigation.navigate(navigateTo)}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title style={{ fontWeight: 'bold', color: 'white', textTransform: 'uppercase',  fontSize: 16 }}><Icon name="car" style={{ fontSize: 18, color: 'white' }}></Icon>  {gdetails.gname}</Title>
            <StarRating
                      disabled={false}
                    maxStars={5}
                    rating={parseFloat(gdetails.rating)}
                    starSize={12}
                    containerStyle={{margin:0,width:Dimensions.get('screen').width*0.25}} 
                    fullStarColor={'gold'}
                    emptyStarColor={'gold'}
                    />
            {/* <Subtitle style={{ color: 'white', fontWeight: 'bold' }}>
              <Icon name="home" style={{ fontSize: 15, color: 'white' }}></Icon>  
              BOOK MY GARAGE</Subtitle> */}
          </Body>
          <Right>
            <Button transparent onPress={() => props.navigation.toggleDrawer()}>
              <Icon name='menu' />
            </Button>
          </Right>
        </Header>
             
              {tabNumber==2&&!(isFinished)?
        <View style={{flex:1000}}>
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <MapView style={{position:'absolute',top:0,left:0,right:0,bottom:0}}
        initialRegion={{
            latitude: parseFloat(geoLat),
            longitude: parseFloat(geoLong),
            latitudeDelta: 0.4,
            longitudeDelta: 0.001,
        
                }}
                showsUserLocation={true}
                followUserLocation={true}
                zoomEnabled={true}
                ScrollEnabled={true}
                showsBuildings={true}
                zoomControlEnabled={true}
              >
                <MapView.Marker
              coordinate={{latitude: parseFloat(geoLat), longitude: parseFloat(geoLong)}}
              title='Your Location'
              description={formatedAddr}
            />
            <MapView.Marker
              coordinate={{latitude: parseFloat(gdetails.location.split(',')[0]), longitude: parseFloat(gdetails.location.split(',')[1])}}
              title={gdetails.gname}
              description={gdetails.gaddress}
              style={{height:10,width:10}}
            />
              <MapViewDirections
                origin={{latitude: parseFloat(geoLat), longitude: parseFloat(geoLong)}}
                destination={gdetails.location}
                apikey='AIzaSyAO05QCAiYweEOHTnZjQfWd--hF0WNsrzQ'
                strokeWidth={5}
          strokeColor="green"
              />
              
          </MapView>
          </View>
          <View >
            <Button block>
              <FontAwesomeIcon style={{color:'white'}} icon={faMapPin} />
              <Text style={{fontWeight:'bold'}}>NAVIGATE</Text></Button>
          </View>
        </View>
        :null}
        {tabNumber == 1 && !(isFinished) ?
          <Segment style={{ backgroundColor: Platform.OS == "android" ? 'teal' : Footer.backgroundColor }}>
            <Button style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }} first active={segmentNumber == 1} onPress={() => setSegmentNumber(1)}>
              <Icon name="md-today"></Icon>
              <Text style={{ fontWeight: 'bold', paddingLeft: 0 }}>Services </Text>
            </Button>
            <Button active={segmentNumber == 2} onPress={() => setSegmentNumber(2)}>
              <Icon name="md-person"></Icon>
              <Text style={{ fontWeight: 'bold', paddingLeft: 0 }}>Info</Text>
            </Button>
            <Button style={{ borderTopRightRadius: 5, borderBottomRightRadius: 5 }} last active={segmentNumber == 3} onPress={() => setSegmentNumber(3)}>
              <Icon name="md-checkmark-circle-outline"></Icon>
              <Text style={{ fontWeight: 'bold', paddingLeft: 0 }}>Checkout</Text>
            </Button>
          </Segment>
          : null}


        <Content ref={scrollView}>
          {tabNumber == 1 && segmentNumber == 1 && !(isFinished) ?
            //servive Tab
            <ServiceSegment />

            : tabNumber == 1 && segmentNumber == 2 && !(isFinished)?
              // Info Tab
              <View>
                <Text style={{ fontWeight: 'bold', letterSpacing: 1, padding: 10 }}>Customer Details</Text>
                <Divider width="80%" style={{ marginLeft: 10, backgroundColor: 'crimson' }} />

                <Item floatingLabel style={{ width: '90%', alignSelf: 'center', margin: 5 }}>
                  <Label style={{ fontWeight: 'bold', fontSize: 14 }}>Your Name : <Text style={{ color: 'red' }}>*</Text></Label>
                  <Icon style={{ color: 'blue', fontSize: 14 }} name="ios-contact" />
                  <Input key='name' value={name1} onChangeText={text => setName(text)} style={{ fontWeight: 'bold', fontSize: 12 }} />
                </Item>

                <Item floatingLabel style={{ width: '90%', alignSelf: 'center', margin: 5 }}>
                  <Label style={{ fontWeight: 'bold', fontSize: 14 }}>Your Mobile Number : <Text style={{ color: 'red' }}>*</Text></Label>
                  <Icon style={{ color: 'blue', fontSize: 14 }} name="ios-call" />
                  <Input key='mobile' value={mobile} onChangeText={text => setMobile(text)} keyboardType={Platform.OS == "android" ? "numeric" : "number-pad"} style={{ fontWeight: 'bold', fontSize: 12 }} />
                </Item>
                <Item floatingLabel style={{ width: '90%', alignSelf: 'center', margin: 5 }}>
                  <Label style={{ fontWeight: 'bold', fontSize: 14 }}>Your Email : <Text style={{ color: 'red' }}>*</Text></Label>
                  <Icon style={{ color: 'blue', fontSize: 14 }} name="ios-at" />
                  <Input key='email' value={email} textContentType='emailAddress' autoCapitalize='none' onChangeText={text => setEmail(text)} keyboardType='email-address' style={{ fontWeight: 'bold', fontSize: 12 }} />
                </Item>
                <Item floatingLabel style={{ width: '90%', alignSelf: 'center', margin: 5 }}>
                  <Label style={{ fontWeight: 'bold', fontSize: 14 }}>Key Note for Garage : <Text style={{ fontSize: 10 }}>(not more than 100 words)</Text></Label>
                  <Icon style={{ color: 'blue', fontSize: 14 }} name="ios-book" />
                  <Input key='note' multiline={true} value={note} onChangeText={text => setNote(text)} style={{ fontWeight: 'bold', fontSize: 12 }} />
                </Item>

                <Text style={{ fontWeight: 'bold', letterSpacing: 1, padding: 10, paddingTop: 20 }}>Booking Details</Text>
                <Divider width="80%" style={{ marginLeft: 10, marginBottom: 10, backgroundColor: 'crimson' }} />
                <View style={{ marginLeft: 20, flexDirection: 'row' }}>
                  <Label style={{ marginTop: 10, fontWeight: 'bold', fontSize: 14, color: '#777' }}>Booking Date :</Label>
                  <DatePicker
                    minimumDate={new Date()}
                    locale={"en"}
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={"fade"}
                    androidMode={"default"}
                    placeHolderText="Select Booking Date."
                    textStyle={{ color: "green", fontWeight: 'bold', fontSize: 14 }}
                    placeHolderTextStyle={{ color: "#d3d3d3", fontWeight: 'bold' }}
                    onDateChange={setCDate}
                    disabled={false}
                    animationType="slide"
                    shouldCloseOnSelect={false}
                  />

                </View>
                
              
                <Text style={{ fontWeight: 'bold', letterSpacing: 1, padding: 10, paddingTop: 20 }}>Extra Services</Text>
                <Divider width="80%" style={{ marginLeft: 10, marginBottom: 10, backgroundColor: 'crimson' }} />
                <View style={{flexDirection:'row', marginLeft:20,alignItems:'center',justifyContent:'flex-start'}}>
                  <Text style={{fontWeight:'bold', fontSize:14,color: '#777',paddingRight:20}}>Collect and deliver :</Text>
                  <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isCad ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isCad}
                    disabled={isDo} />
                  <View style={{ marginLeft: 20 }}>
                    <Tooltip width={200} height={100} popover={<Text style={{ fontSize: 12, color: 'white', fontWeight: 'bold' }}>This garage provide an extra service to collect and deliver customer's vehicles (Before and after the service). Tick if you need this service.</Text>}>
                      <FontAwesomeIcon style={{color:'#006600'}} icon={faQuestionCircle} />
                    </Tooltip>
                  </View>
                  
                </View>
                <View style={{flexDirection:'row',paddingTop:10, marginLeft:20,alignItems:'center',justifyContent:'flex-start'}}>
                  <Text style={{fontWeight:'bold', fontSize:14,color: '#777',paddingRight:20}}>Custom Drop Off    :</Text>
                  <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isDo ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitchDo}
                    value={isDo} 
                    disabled={isCad}/>
                    <View style={{ marginLeft: 20 }}>
                    <Tooltip width={200} height={100} popover={<Text style={{ fontSize: 12, color: 'white', fontWeight: 'bold' }}>This garage provide an extra service to drop customers to their destination, when their vehicle got breakdown, Tick if you need this service.</Text>}>
                      <FontAwesomeIcon style={{color:'#006600'}} icon={faQuestionCircle} />
                    </Tooltip>
                  </View>
                </View>
                <View style={{padding:50}}></View>
              </View>

              : tabNumber == 1 && segmentNumber == 3 && !(isFinished) ?
                // Checkout Tab
                <View >
                  {/* Customer Deatils */}
                  {name1&&mobile&&email?
                  <View style={{ padding: 10 }}>
                    <Text style={{ fontWeight: 'bold', letterSpacing:1, fontSize:14}}>Customer Details: </Text>
                    <View style={{ padding: 10, borderWidth: 2, borderColor: '#777', marginTop: 5, borderRadius: 5 }}>
                    <View style={{ flexDirection: 'row' ,alignItems:'center',justifyContent:'flex-start',padding:2}}>
                        <FontAwesomeIcon style={{ color: '#555555' ,fontSize:13}} icon={faUserCircle} />
                        <Text style={{ color: '#555555', fontWeight: 'bold', fontSize: 13, margin: 1, paddingLeft: 5 }}>Name : {name1.toUpperCase()}</Text>
                      </View>
                      <View style={{ flexDirection: 'row' ,alignItems:'center',justifyContent:'flex-start',padding:2}}>
                        <FontAwesomeIcon style={{ color: '#555555' ,fontSize:13}} icon={faPhone} />
                        <Text style={{ color: '#555555', fontWeight: 'bold', fontSize: 13, margin: 1, paddingLeft: 5 }}>Mobile : {mobile}</Text>
                      </View>
                      <View style={{ flexDirection: 'row' ,alignItems:'center',justifyContent:'flex-start',padding:2}}>
                        <FontAwesomeIcon style={{ color: '#555555' ,fontSize:13}} icon={faEnvelope} />
                        <Text style={{ color: '#555555', fontWeight: 'bold', fontSize: 13, margin: 1, paddingLeft: 5 }}>Email : {email}</Text>
                      </View>
                      <View style={{ flexDirection: 'row' ,alignItems:'center',justifyContent:'flex-start',padding:2}}>
                        <FontAwesomeIcon style={{ color: '#555555' ,fontSize:13}} icon={faGlobe} />
                        <Text style={{ color: '#555555', fontWeight: 'bold', fontSize: 13, margin: 1, paddingLeft: 5 }}>Location : {formatedAddr}</Text>
                      </View>
                      <View style={{ flexDirection: 'row' ,alignItems:'center',justifyContent:'flex-start',padding:2}}>
                        <FontAwesomeIcon style={{ color: '#555555' ,fontSize:13}} icon={faCar} />
                  <Text style={{ color: '#555555', fontWeight: 'bold', fontSize: 13, margin: 1, paddingLeft: 5 }}>Vehicle : {make}, {model}</Text>
                      </View>
                    </View>
                  </View>
                  : null }

                    {/* Garage Deatils */}
                  <View style={{ padding: 10 }}>
                    <Text style={{ fontWeight: 'bold', letterSpacing: 1, fontSize:14}}>Garage Details: </Text>
                    <View style={{ padding: 10, borderWidth: 2, borderColor: '#777', marginTop: 5, borderRadius: 5 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 2 }}>
                        <FontAwesomeIcon style={{ color: '#555555', fontSize: 13 }} icon={faHome} />
                        <Text style={{ color: '#555555', fontWeight: 'bold', fontSize: 13, margin: 1, paddingLeft: 5, paddingRight:10 }}>{gdetails.gname.toUpperCase()}</Text>
                        <StarRating
                      disabled={false}
                    maxStars={5}
                    rating={parseFloat(gdetails.rating)}
                    starSize={10}
                    containerStyle={{margin:0,width:Dimensions.get('screen').width*0.25}} 
                    fullStarColor={'red'}
                    emptyStarColor={'red'}
                    />
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 2 }}>
                        <FontAwesomeIcon style={{ color: '#555555', fontSize: 13 }} icon={faMapPin} />
                        <Text style={{ color: '#555555', fontWeight: 'bold', fontSize: 13, margin: 1, paddingLeft: 5 }}>Location : {gdetails.gaddress}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 2 }}>
                        <FontAwesomeIcon style={{ color: '#555555', fontSize: 13 }} icon={faCalendarCheck} />
                        <Text style={{ color: '#555555', fontWeight: 'bold', fontSize: 13, margin: 1, paddingLeft: 5 }}>Booking Date : {cdate.toString().substr(4, 12)}</Text>
                      </View>
                    </View>
                  </View>

                    {/* Booking Deatils */}
                  {colorItems.length>0?
                  <View style={{ padding: 10 }}>
                    <Text style={{ fontWeight: 'bold', letterSpacing:1, fontSize:14}}>Purchase Details: </Text>
                    <View style={{ padding: 10, borderWidth: 2, borderColor: '#777', marginTop: 5, borderRadius: 5 }}>
                      <View style={{ flexDirection: 'row', padding: 5 }}>
                        <Text style={{ width: '10%', fontWeight: 'bold', fontSize: 14 }}>No</Text>
                        <Text style={{ width: '70%', fontWeight: 'bold', fontSize: 14 }}>Item</Text>
                        <Text style={{ width: '20%', fontWeight: 'bold', fontSize: 14 }}>Price <Text style={{ fontSize: 7 }}>{'\n'}(After Discount)</Text></Text>
                      </View>
                      <Divider style={{ borderWidth: 1 }} />
                      {mySelServices}
                      <View style={{ flexDirection: 'row', padding: 5 }}>
                      <Text style={{ width: '50%', fontWeight: 'bold', fontSize: 11,color:'#555555' }}>You Saved : {totalSav} AED</Text>
                        <Text style={{ textAlign: 'right', width: '20%', fontWeight: 'bold', fontSize: 14 }}>Total :</Text>
                        <Text style={{ width: '10%', fontWeight: 'bold', fontSize: 14 }}></Text>
                        <Text style={{ width: '20%', fontWeight: 'bold', fontSize: 14 }}>{totalCost} AED</Text>
                      </View>
                    </View>
                    <View style={{padding:50}}></View>
                  </View>
                  : null }

                </View>
                : isFinished?
                <View >
                  
                  <Card>
                    <CardItem>
                    <Image source={require('../images/success2.gif')} style={{height: 200, width: null, flex: 1}}/>
                    </CardItem>
                    <CardItem>
                      <Body style={{alignItems:'center'}}>
                        <Text style={{textAlign:'center',fontSize:30}}>SUCCESS</Text>
                        <Text style={{fontSize:12,fontWeight:'bold',paddingTop:10}}>You have successfully booked a service on <Text style={{color:'crimson',fontSize:14}}>{cdate.toString().substr(4, 12)}</Text></Text>
                        <View style={{alignItems:'flex-start',paddingTop:10}}>
                        <Text style={{fontSize:10,fontWeight:'bold',color:'#522',paddingTop:5}}>1. We will be contacting the garage, on your behalf.</Text>
                        <Text style={{fontSize:10,fontWeight:'bold',color:'#522',paddingTop:5}}>2. Soon the garage accept your request, you will be receiving an alert.</Text>
                        <Text style={{fontSize:10,fontWeight:'bold',color:'#522',paddingTop:5}}>3. Payment to be made only after the work done by the garage.</Text>
                        <Text style={{fontSize:10,fontWeight:'bold',color:'#522',paddingTop:5}}>4. Payment will be made directly to the garage.</Text>
                        </View>
                          <Button style={{margin:20}} onPress={() => navigation.navigate(navigateTo)}>
                            <Left style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <FontAwesomeIcon icon={faHome} style={{marginRight:10,color:'white'}}/>
                            <Text style={{fontWeight:'bold',fontSize:14,color:'white'}}>GOTO MAIN</Text>
                            </Left>
                            
                            
                          </Button>
                      </Body>
                    </CardItem>
                  </Card>
                  
                </View>
                :null}

          {tabNumber == 3 && !(isFinished) ?
            <View>
              <View style={{flexDirection:'row',paddingLeft:20,paddingTop:20}}>
                  <FontAwesomeIcon style={{alignSelf:'center',color:'green'}} icon={faHome} size={40} />
                  <View>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', paddingTop: 10,paddingBottom:5,paddingLeft:20 }}>{gdetails.gname}   ( <Text style={{ fontSize: 16, color: 'crimson' }}>{parseFloat(gdetails.rating).toFixed(1)}</Text> <Text style={{fontSize:10,fontWeight:'bold'}}>OUT OF 5</Text> )</Text>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={parseFloat(gdetails.rating)}
                  starSize={12}
                  containerStyle={{ paddingBottom: 20,paddingLeft:20, width: Dimensions.get('screen').width * 0.25 }}
                  fullStarColor={'crimson'}
                  emptyStarColor={'crimson'}
                />
                  </View>
                </View>
              <Divider style={{backgroundColor:'crimson'}} />
              {myComments}
              <Card>
                <CardItem>
                  <Left>
                    <Body>
                    {/* <Textarea style={{margin:10,fontWeight:'bold',fontSize:12}} rowSpan={3} bordered placeholder="Write your comments . . ." /> */}
                    <View style={{flexDirection:'row',paddingBottom:10,paddingLeft:10}}>
                    <Text style={{fontSize:12,color:'crimson',fontWeight:'bold',marginRight:20}}>Rate Garage : </Text>
                    <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={postStars}
                  starSize={15}
                  containerStyle={{  width: Dimensions.get('screen').width * 0.25 }}
                  fullStarColor={'green'}
                  emptyStarColor={'green'}
                  selectedStar={(rating) => onStarRatingPress(rating)}
                />
                </View>
                      <Item  >
                        <Input ref={myInput} onChangeText={text => setFeedback(text)} value={feedback} placeholder="Write your comments . . ."  multiline={true} style={{fontWeight:'bold',fontSize:12,padding:10}} />
                      </Item>
                    </Body>
                    <Button onPress={()=>postComment()} iconLeft>
                      <FontAwesomeIcon style={{color:'white',marginLeft:10}} icon={faPaperPlane} />
                      <Text style={{fontWeight:'bold',fontSize:12}}>POST</Text>
                    </Button>                  
                  </Left>
                  
                </CardItem>
              </Card>
              <View >
                <Text style={{ paddingTop:40,textAlign:'center'}}></Text>
              </View>
            </View>
            : null}

            {tabNumber==4 && !(isFinished)? 
            <Segment style={{ backgroundColor: Platform.OS == "android" ? 'teal' : Footer.backgroundColor }}>
            <Button style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }} first active={secSegmentNumber == 1} onPress={() => setSecSegmentNumber(1)}>
              <Icon name="md-today"></Icon>
              <Text style={{ fontWeight: 'bold', paddingLeft: 0 }}>Information </Text>
            </Button>
            <Button active={secSegmentNumber == 2} onPress={() => setSecSegmentNumber(2)}>
              <Icon name="ios-calendar"></Icon>
              <Text style={{ fontWeight: 'bold', paddingLeft: 0 }}>Availability</Text>
            </Button>
          </Segment>
        :null }

        {tabNumber == 4 && secSegmentNumber==1 && !(isFinished) ?
        <View style={{padding:5}}>
            <Card>
              <CardItem>
                <Left>
                  <FontAwesomeIcon icon={faHome} size={40} />
                  <Body>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', paddingTop: 10,paddingBottom:5,paddingLeft:20 }}>{gdetails.gname}   ( <Text style={{ fontSize: 16, color: 'crimson' }}>{parseFloat(gdetails.rating).toFixed(1)}</Text> <Text style={{fontSize:10,fontWeight:'bold'}}>OUT OF 5</Text> )</Text>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={parseFloat(gdetails.rating)}
                  starSize={12}
                  containerStyle={{ paddingBottom: 20,paddingLeft:20, width: Dimensions.get('screen').width * 0.25 }}
                  fullStarColor={'crimson'}
                  emptyStarColor={'crimson'}
                />
                  </Body>
                </Left>
              </CardItem>
              <CardItem cardBody>
                
              <Image source={{uri: URLRoot+gdetails.image}} onLoadEnd={()=>{setIsImageLoaded(true)}} style={{height: 200, width: null, flex: 1}}/>    
              </CardItem>
            <CardItem>
                  <Left>
                    <FontAwesomeIcon  size={13} icon={faUserCircle} />
                    <Body>
                      <Text style={{ fontWeight: 'bold', fontSize: 12,textTransform:'capitalize' }}>Owner : <Text style={{color:'#555',fontWeight:'bold',fontSize:12}}>{gdetails.oname}</Text></Text>
                    </Body>
                  </Left>
            </CardItem>
            <CardItem>
                <Left>
                    <FontAwesomeIcon  size={13} icon={faMobile} />
                    <Body>
                      <Text style={{  fontWeight: 'bold', fontSize: 12 }}>Mobile : <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#222288' }} onPress={() => { Linking.openURL('tel:' + gdetails.omobile); }}>{gdetails.omobile}</Text></Text>
                    </Body>
                  </Left>
                  <Left>
                    <FontAwesomeIcon  size={13} icon={faPhoneVolume} />
                    <Body>
                      <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Landline : <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#222288' }} onPress={() => { Linking.openURL('tel:' + gdetails.landline); }}>{gdetails.landline}</Text></Text>
                    </Body>
                  </Left>
            </CardItem>
            <CardItem>
            <Left>
                    <FontAwesomeIcon  size={13} icon={faEnvelope} />
                    <Body>
                      <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Email : <Text style={{color:'#555',fontWeight:'bold',fontSize:12}}>{gdetails.oemail}</Text></Text>
                    </Body>
                  </Left>
            </CardItem>
            
           
           <CardItem>
                  <Left>
                    <FontAwesomeIcon  size={13} icon={faGlobe} />
                    <Body>
                      <Text style={{ fontWeight: 'bold', fontSize: 12,textTransform:'capitalize' }}>Website : <Text style={{color:'#555',fontWeight:'bold',fontSize:12}}>{gdetails.website}</Text></Text>
                    </Body>
                  </Left>
            </CardItem>
            <CardItem>
                  <Left>
                    <FontAwesomeIcon  size={13} icon={faMapMarked} />
                    <Body>
                      <Text style={{ fontWeight: 'bold', fontSize: 12,textTransform:'capitalize' }}>Address : <Text style={{color:'#555',fontWeight:'bold',fontSize:12}}>{gdetails.gaddress}</Text></Text>
                    </Body>
                  </Left>
            </CardItem>
            </Card>
        </View>
        :null }

        {tabNumber == 4 && secSegmentNumber==2 && !(isFinished) ?
        <View>
        <View style={{paddingLeft:20,paddingRight:20,paddingTop:10}}>
          <Text style={{fontWeight:'bold',paddingBottom:5}}>Opening Hours</Text>
          <Divider style={{backgroundColor:'red'}} />
          <View style={{flexDirection:'row',paddingTop:10,paddingBottom:10}}>
            <Left style={{flexDirection:'row'}}>
              <FontAwesomeIcon size={13} icon={faCalendarAlt} style={{marginRight:10}} />
              <Text style={{fontWeight:'bold',fontSize:13}}>Monday</Text>
             </Left>
             <Body style={{alignItems:'flex-start'}}>
             <Text style={{fontWeight:'bold',fontSize:13,paddingLeft:10}}>: {gdetails.mon=="closed"?'Closed':new Date('1970-01-01T'+gdetails.mon.split(':')[0]+':'+gdetails.mon.split(':')[1]+':00'+'Z').toLocaleTimeString({},{timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'})+' - '+new Date('1970-01-01T'+gdetails.mon.split(':')[2]+':'+gdetails.mon.split(':')[3]+':00'+'Z').toLocaleTimeString({},{timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'})}</Text>
             </Body>
          </View>
          <Divider />

          <View style={{flexDirection:'row',paddingTop:10,paddingBottom:10}}>
            <Left style={{flexDirection:'row'}}>
              <FontAwesomeIcon size={13} icon={faCalendarAlt} style={{marginRight:10}} />
              <Text style={{fontWeight:'bold',fontSize:13}}>Tuesday </Text>
             </Left>
             <Body style={{alignItems:'flex-start'}}>
             <Text style={{fontWeight:'bold',fontSize:13,paddingLeft:10}}>: {gdetails.tue=="closed"?'Closed':new Date('1970-01-01T'+gdetails.tue.split(':')[0]+':'+gdetails.tue.split(':')[1]+':00'+'Z').toLocaleTimeString({},{timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'})+' - '+new Date('1970-01-01T'+gdetails.tue.split(':')[2]+':'+gdetails.tue.split(':')[3]+':00'+'Z').toLocaleTimeString({},{timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'})}</Text>
             </Body>
          </View>
          <Divider />

          <View style={{flexDirection:'row',paddingTop:10,paddingBottom:10}}>
            <Left style={{flexDirection:'row'}}>
              <FontAwesomeIcon size={13} icon={faCalendarAlt} style={{marginRight:10}} />
              <Text style={{fontWeight:'bold',fontSize:13}}>Wednesday </Text>
             </Left>
             <Body style={{alignItems:'flex-start'}}>
             <Text style={{fontWeight:'bold',fontSize:13,paddingLeft:10}}>: {gdetails.wed=="closed"?'Closed':new Date('1970-01-01T'+gdetails.wed.split(':')[0]+':'+gdetails.wed.split(':')[1]+':00'+'Z').toLocaleTimeString({},{timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'})+' - '+new Date('1970-01-01T'+gdetails.wed.split(':')[2]+':'+gdetails.wed.split(':')[3]+':00'+'Z').toLocaleTimeString({},{timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'})}</Text>
             </Body>
          </View>
          <Divider />

          <View style={{flexDirection:'row',paddingTop:10,paddingBottom:10}}>
            <Left style={{flexDirection:'row'}}>
              <FontAwesomeIcon size={13} icon={faCalendarAlt} style={{marginRight:10}} />
              <Text style={{fontWeight:'bold',fontSize:13}}>Thurday </Text>
             </Left>
             <Body style={{alignItems:'flex-start'}}>
             <Text style={{fontWeight:'bold',fontSize:13,paddingLeft:10}}>: {gdetails.thu=="closed"?'Closed':new Date('1970-01-01T'+gdetails.thu.split(':')[0]+':'+gdetails.thu.split(':')[1]+':00'+'Z').toLocaleTimeString({},{timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'})+' - '+new Date('1970-01-01T'+gdetails.thu.split(':')[2]+':'+gdetails.thu.split(':')[3]+':00'+'Z').toLocaleTimeString({},{timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'})}</Text>
             </Body>
          </View>
          <Divider />

          <View style={{flexDirection:'row',paddingTop:10,paddingBottom:10}}>
            <Left style={{flexDirection:'row'}}>
              <FontAwesomeIcon size={13} icon={faCalendarAlt} style={{marginRight:10}} />
              <Text style={{fontWeight:'bold',fontSize:13}}>Friday </Text>
             </Left>
             <Body style={{alignItems:'flex-start'}}>
             <Text style={{fontWeight:'bold',fontSize:13,paddingLeft:10}}>: {gdetails.fri=="closed"?'Closed':new Date('1970-01-01T'+gdetails.fri.split(':')[0]+':'+gdetails.fri.split(':')[1]+':00'+'Z').toLocaleTimeString({},{timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'})+' - '+new Date('1970-01-01T'+gdetails.fri.split(':')[2]+':'+gdetails.fri.split(':')[3]+':00'+'Z').toLocaleTimeString({},{timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'})}</Text>
             </Body>
          </View>
          <Divider />

          <View style={{flexDirection:'row',paddingTop:10,paddingBottom:10}}>
            <Left style={{flexDirection:'row'}}>
              <FontAwesomeIcon size={13} icon={faCalendarAlt} style={{marginRight:10}} />
              <Text style={{fontWeight:'bold',fontSize:13}}>Saturday </Text>
             </Left>
             <Body style={{alignItems:'flex-start'}}>
             <Text style={{fontWeight:'bold',fontSize:13,paddingLeft:10}}>: {gdetails.sat=="closed"?'Closed':new Date('1970-01-01T'+gdetails.sat.split(':')[0]+':'+gdetails.sat.split(':')[1]+':00'+'Z').toLocaleTimeString({},{timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'})+' - '+new Date('1970-01-01T'+gdetails.sat.split(':')[2]+':'+gdetails.sat.split(':')[3]+':00'+'Z').toLocaleTimeString({},{timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'})}</Text>
             </Body>
          </View>
          <Divider />

          <View style={{flexDirection:'row',paddingTop:10,paddingBottom:10}}>
            <Left style={{flexDirection:'row'}}>
              <FontAwesomeIcon size={13} icon={faCalendarAlt} style={{marginRight:10}} />
              <Text style={{fontWeight:'bold',fontSize:13}}>Sunday </Text>
             </Left>
             <Body style={{alignItems:'flex-start'}}>
             <Text style={{fontWeight:'bold',fontSize:13,paddingLeft:10}}>: {gdetails.sun=="closed"?'Closed':new Date('1970-01-01T'+gdetails.sun.split(':')[0]+':'+gdetails.sun.split(':')[1]+':00'+'Z').toLocaleTimeString({},{timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'})+' - '+new Date('1970-01-01T'+gdetails.sun.split(':')[2]+':'+gdetails.sun.split(':')[3]+':00'+'Z').toLocaleTimeString({},{timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'})}</Text>
             </Body>
          </View>
          <Divider />
        </View>
        <View style={{paddingLeft:20,paddingRight:20,paddingTop:30}}>
          <View style={{flexDirection:'row'}}>
        <Text style={{fontWeight:'bold',paddingBottom:5}}>Availability Calender</Text>
        <View style={{width:20,height:20,backgroundColor:'crimson',borderRadius:10,marginLeft:30}}></View>
        <Text> - Unavailable</Text>
        </View>
          <Divider style={{backgroundColor:'red'}} />
          <Calendar current={new Date()} 
          markedDates={unavailable}
          />
        </View>
        </View>
        :null }

        </Content>
        {!(isFinished)&&!(isKeyboardVisible) ?
        <Footer style={{ backgroundColor: Platform.OS == "android" ? 'teal' : Footer.backgroundColor }}>
          <FooterTab style={{ backgroundColor: Platform.OS == "android" ? 'teal' : Footer.backgroundColor }}>
            <Button vertical onPress={() => setTabFunc(1)} active={tabNumber == 1} style={{ backgroundColor: Platform.OS == "android" ? 'teal' : Footer.backgroundColor, color: 'white' }}>
              <Icon name="md-bookmarks" />
              <Text style={{ fontWeight: 'bold',fontSize:11}}>BOOKING</Text>
            </Button>
            <Button vertical onPress={() => setTabFunc(2)} active={tabNumber == 2} style={{ backgroundColor: Platform.OS == "android" ? 'teal' : Footer.backgroundColor, color: 'white' }}>
              <Icon name="ios-pin" />
              <Text style={{ fontWeight: 'bold',fontSize:11}}>LOCATION</Text>
            </Button>
            <Button vertical onPress={() => setTabFunc(3)} active={tabNumber == 3} style={{ backgroundColor: Platform.OS == "android" ? 'teal' : Footer.backgroundColor, color: 'white' }}>
              <Icon name="ios-star-half" />
              <Text style={{ fontWeight: 'bold',fontSize:11 }}>COMMENTS</Text>
            </Button>
            <Button vertical onPress={() => setTabFunc(4)} active={tabNumber == 4} style={{ backgroundColor: Platform.OS == "android" ? 'teal' : Footer.backgroundColor, color: 'white' }}>
              <Icon name="home" />
              <Text style={{ fontWeight: 'bold',fontSize:11}}>ABOUT US</Text>
            </Button>
          </FooterTab>
        </Footer>
      :null }
      </Container>

      {/* Booking-Select Service */}
      {tabNumber==1&&segmentNumber == 1 && colorItems.length > 0 && !(isFinished) ?
        <Button block onPress={() => {setSegmentFunc(2);scrollView.current._root.scrollToPosition(0,0);}} style={{ backgroundColor: 'rgba(3,50,200,0.9)', borderRadius: 5, width: '95%', alignSelf: 'center', position: 'absolute', bottom: '11%' }}>
          <Text style={{ fontWeight: 'bold' }}>PROCEED</Text>
        </Button>
        : null}

        {/* booking- my info */}
      {tabNumber==1&&segmentNumber == 2 && name1 && mobile && email && cdate.toString().substr(4, 12) != (new Date(new Date().setDate(new Date().getDate()-1))).toString().substr(4, 12) && !(isFinished) ?
        <Button block onPress={() => {setSegmentFunc(3);scrollView.current._root.scrollToPosition(0,0)}} style={{ backgroundColor: 'rgba(3,50,200,0.9)', borderRadius: 5, width: '95%', alignSelf: 'center', position: 'absolute', bottom: '11%' }}>
          <Text style={{ fontWeight: 'bold' }}>PROCEED</Text>
        </Button>
        : null}

        {/* booking - checkout */}
        {tabNumber==1&&segmentNumber == 3 && !(isFinished) ?
        <Button block onPress={() => validate()} style={{ backgroundColor: 'rgba(3,50,200,0.9)', borderRadius: 5, width: '95%', alignSelf: 'center', position: 'absolute', bottom: '11%' }}>
          <Text style={{ fontWeight: 'bold' }}>PLACE ORDER</Text>
        </Button>
        :null}
        {tabNumber==3 && !(isFinished) && !(isKeyboardVisible) ?
        <Button block onPress={()=>{scrollView.current._root.scrollToEnd()}} style={{ backgroundColor: 'rgba(53,50,200,0.9)', borderRadius: 5, width: '95%', alignSelf: 'center', position: 'absolute', bottom: '11%' }}>
          <FontAwesomeIcon style={{color:'white'}} icon={faComment} />
          <Text style={{ fontWeight: 'bold',fontSize:14}}>WRITE COMMENTS</Text>
        </Button>
        :null}
    </Root>
    
  )
}
export default SelectService;