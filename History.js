import React,{useState,useEffect} from "react";
import { Image,ImageBackground,Keyboard,TouchableOpacity,Dimensions,Alert} from "react-native";
import {Container,Content,View,Text,Root, Card, CardItem,Segment, Left, Item, Label,Input, Button, Icon,ActionSheet,Toast, Body, Right,Picker} from 'native-base';
import MyHeader from './MyHeader';
import {Divider} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import {serverAddr,myApiKey} from '../App';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Geolocation from '@react-native-community/geolocation';
import { faCar, faEdit, faTrash, faTrashAlt, faPlusCircle, faTimes,faPhone,faGlobe,faUserCircle, faAddressCard,faHome, faLocationArrow, faMapMarked, faMapMarker, faMapMarkerAlt, faMapPin, faMapSigns, faClock, faList, faCheckCircle, faRemoveFormat, faClosedCaptioning, faWindowClose, faTasks, faPlaceOfWorship, faFlagCheckered, faFrownOpen, faFrown, faTag, faMobile, faCalendar } from "@fortawesome/free-solid-svg-icons";
import Modal from 'react-native-modal';
import PlacesInput from 'react-native-places-input';

const History = props => {
  const [myInfo,setMyInfo]=useState('');
  const [segmentNumber, setSegmentNumber] = useState(1);
  const [transactionDetails,setTransactionDetails]=useState([]);
  const [tabName,setTabName]=useState('All');
  const [tabDesc,setTabDesc]=useState('All orders listed datewise, starting from recent.');
  const [tabIcon,setTabIcon]=useState(faAddressCard);
  const [tabStatus,setTabStatus]=useState('all');
  const [showModel,setShowModel]=useState(false);
  const [selectedTransaction,setSelectedTransaction]=useState({
    'gname':'',
    'gdetails':{'gaddress':''},
    'cname':'',
    'cmobile':'',
    'clocation':'',
    'cmake':'',
    'cmodel':'',
    'services':[],
    'timestamp':''
  });
  var mySelServices = []
  const myTransaction=[];
  var month = new Array();
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";
  
  useEffect(() => {
    AsyncStorage.getItem('LoggedIn')
      .then((token) => {
        token = JSON.parse(token);
        setMyInfo(token);
        var user= new FormData();
        user.append("cid",token.ID);
        user.append("status","all");
        fetch(serverAddr + '/getTransactionByStatus.php', {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          body: user
        })
          .then((response) => response.json())
          .then((responseJson) => {
              setTransactionDetails(responseJson);
          })
      });
  },[]);

  viewGarage =(val)=>{
    setSelectedTransaction(val);
    setShowModel(true);
  }

  transactionDetails.forEach(function (details,i) {
    if(tabStatus=="all"||tabStatus==details.status&&details.servicename!="")
    {
      myTransaction.push(
        <Card>
          <CardItem>
            <Left>
              <View style={{alignItems:'center',width:50}}>
              <FontAwesomeIcon style={{color: details.status=='p'?"#ffaa00":(details.status=='a'?"blue":(details.status=='f'?"green":"red"))}} icon={faTag} />
              <Text style={{fontSize:8,paddingTop:5,fontWeight:'bold',color: details.status=='p'?"#ffaa00":(details.status=='a'?"blue":(details.status=='f'?"green":"red"))}}>{details.status=='p'?"Pending":(details.status=='a'?"Active":(details.status=='f'?"Finished":"Cancelled"))}</Text>
              </View>
              <Body style={{borderColor:'red',borderLeftWidth:1,paddingLeft:10}}>
                <Text style={{fontSize:12,fontWeight:'bold',color: details.status=='p'?"#a93900":(details.status=='a'?"blue":(details.status=='f'?"green":"red"))}}>{details.servicename}</Text>
                <Text style={{fontSize:10,fontWeight:'bold',color:'red'}}>Booked on {month[parseInt(details.timestamp.split(' ')[0].split('-')[1])-1]} {details.timestamp.split(' ')[0].split('-')[2]},{details.timestamp.split(' ')[0].split('-')[0]}</Text>
                <Text style={{fontSize:10,color:'gray',fontWeight:'bold'}}>Garage : {details.gname}</Text>
                <Text style={{fontSize:10,color:'gray',fontWeight:'bold'}}>Vehicle : {details.cmake}, {details.cmodel}</Text>
                <Text style={{fontSize:10,fontWeight:'bold'}}>Bill Amount : {details.totPrice} AED</Text>
              </Body>
              <TouchableOpacity onPress={()=>viewGarage(details)}>
              <View style={{borderWidth:2,borderColor:'green',padding:10,borderRadius:5,color:'white'}}>
                <Text style={{color:'green',fontWeight:'bold',fontSize:12}}>VIEW</Text>
              </View>
              </TouchableOpacity>
              
            </Left>
          </CardItem>
        </Card>
      )
    }
  })


  selectedTransaction.services.forEach(function (details, i) {
    mySelServices.push(
      <View>
        <View style={{ flexDirection: 'row', padding: 10 }}>
          <Text style={{ color: 'black', width: '10%', fontWeight: 'bold', fontSize: 10 }}>{i + 1}</Text>
          <Text style={{ color: 'black', width: '70%', fontWeight: 'bold', fontSize: 10 }}>{details.sname}</Text>
          <Text style={{ color: 'black', width: '20%', fontWeight: 'bold', fontSize: 10 }}>{details.sprice - details.sprice * details.soffer / 100} AED</Text>
        </View>
        <Divider />
      </View>
    )
  })

  setSegmentFunc=(val)=>{
    setSegmentNumber(val)
    var tname='';
    switch(val)
    {
      case 1: setTabName('All');
        setTabIcon(faAddressCard);
        setTabDesc('All orders listed datewise, starting from recent.');
        setTabStatus('all');
        break;
      case 2: setTabName('Pending');
        setTabIcon(faClock);
        setTabDesc('These orders are waiting to be accepted by the garages');
        setTabStatus('p');
        break;
      case 3: setTabName('Active');
        setTabIcon(faFlagCheckered);
        setTabDesc('These orders are accepted by garage and waiting for the work to be done');
        setTabStatus('a');
        break;
      case 4: setTabName('Finished');
        setTabIcon(faCheckCircle);
        setTabDesc('History of old sucessfull orders');
        setTabStatus('f');
        break;
      case 5: setTabName('Cancelled');
        setTabIcon(faFrownOpen);
        setTabDesc('Transaction which got cancelled by the customer or by the garage. Technical issue also may lead to a cancellation of your order.');
        setTabStatus('c');
        break;
    }
  }

  closeModel =() =>{
    setShowModel(false);
  }

  return (
    <Root>
      <Container>
      <MyHeader navigation={props.navigation} title="history" tabName="Transactions" />
      <Segment >
            <Button style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }} first active={segmentNumber == 1} onPress={() => setSegmentFunc(1)}>
              <Text style={{ fontWeight: 'bold',fontSize:12}}>All </Text>
            </Button>
            <Button active={segmentNumber == 2} onPress={() => setSegmentFunc(2)}>
              <Text style={{ fontWeight: 'bold',fontSize:12}}>Pending</Text>
            </Button>
            <Button active={segmentNumber == 3} onPress={() => setSegmentFunc(3)}>
              <Text style={{ fontWeight: 'bold',fontSize:12}}>Active</Text>
            </Button>
            <Button active={segmentNumber == 4} onPress={() => setSegmentFunc(4)}>
              <Text style={{ fontWeight: 'bold',fontSize:12}}>Finished</Text>
            </Button>
            <Button style={{ borderTopRightRadius: 5, borderBottomRightRadius: 5 }} last active={segmentNumber == 5} onPress={() => setSegmentFunc(5)}>
              <Text style={{ fontWeight: 'bold',fontSize:12}}>Cancelled</Text>
            </Button>
          </Segment>
        
        <Content>
          <View style={{paddingTop:20,paddingBottom:10,paddingLeft:20,paddingRight:20,flexDirection:'row'}}>
            <FontAwesomeIcon icon={tabIcon} size={20} style={{marginRight:10,color:'teal',alignSelf:'center'}} />
            <View style={{borderWidth:1,borderColor:'red',marginRight:10}}></View>
            <View>
              <Text style={{fontSize:20,fontWeight:'bold',color:'blue'}}>{tabName} Orders</Text>
              <Text note style={{fontSize:10,paddingTop:5,fontWeight:'bold'}}>{tabDesc}</Text>
            </View>
            
          </View>
          <Divider style={{width:'90%',alignSelf:'center'}} />
          <View style={{paddingLeft:20,paddingRight:20}}>
            {myTransaction}
          </View>
          <View>
            <Modal animationOut='slideOutUp' animationIn='slideInDown' avoidKeyboard={true}  isVisible={showModel}>
              <View style={{ flex: 1 }} style={{ backgroundColor: 'white', padding: 20 ,borderRadius:10}}>
                <TouchableOpacity onPress={() => closeModel()}>
                  <FontAwesomeIcon style={{ alignSelf: 'flex-end', color: 'red' }} icon={faTimes} />
                </TouchableOpacity>
              
 
                <View style={{marginTop:10}}>
                    <Text style={{ fontWeight: 'bold', letterSpacing:1, fontSize:14, padding:5,backgroundColor:'green',color:'white'}}>Purchase Details: </Text>
                      <Divider />
                      <View style={{ flexDirection: 'row', padding: 5 }}>
                        <Text style={{ width: '10%', fontWeight: 'bold', fontSize: 14 }}>No</Text>
                        <Text style={{ width: '70%', fontWeight: 'bold', fontSize: 14 }}>Item</Text>
                        <Text style={{ width: '20%', fontWeight: 'bold', fontSize: 14 }}>Price <Text style={{ fontSize: 7 }}>{'\n'}(After Discount)</Text></Text>
                      </View>
                      <Divider style={{backgroundColor:'black'}} />
                      {mySelServices} 
                      <View style={{ flexDirection: 'row', padding: 5 }}>
                      <Text style={{ width: '50%', fontWeight: 'bold', fontSize: 11,color:'#555555' }}></Text>
                        <Text style={{ textAlign: 'right', width: '20%', fontWeight: 'bold', fontSize: 14 }}>Total :</Text>
                        <Text style={{ width: '10%', fontWeight: 'bold', fontSize: 14 }}></Text>
                        <Text style={{ width: '20%', fontWeight: 'bold', fontSize: 14 ,color:'crimson'}}>{selectedTransaction.totPrice} AED</Text>
                      </View>
                     </View>

                {/* <Divider style={{backgroundColor:'red',marginBottom:20,marginTop:20,paddingTop:2}} /> */}

                <View style={{marginTop:10}}>
                    <Text style={{ fontWeight: 'bold', letterSpacing: 1, fontSize:14,padding:5,backgroundColor:'green',color:'white'}}>Garage Details: </Text>
                      <Divider />
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 2 }}>
                        <FontAwesomeIcon style={{ color: 'black', fontSize: 13 }} icon={faHome} />
                        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 13, margin: 1, paddingLeft: 5, paddingRight:10 }}>{selectedTransaction.gname.toUpperCase()}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 2 }}>
                        <FontAwesomeIcon style={{ color: 'black', fontSize: 13 }} icon={faMobile} />
                        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 13, margin: 1, paddingLeft: 5 }}>{selectedTransaction.gmobile}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 2 }}>
                        <FontAwesomeIcon style={{ color: 'black', fontSize: 13 }} icon={faMapPin} />
                        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 13, margin: 1, paddingLeft: 5 }}>Garage Location : {selectedTransaction.gdetails.gaddress}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 2 }}>
                        <FontAwesomeIcon style={{ color: 'black', fontSize: 13 }} icon={faCalendar} />
                        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 13, margin: 1, paddingLeft: 5 }}>Booking date : <Text style={{color:'crimson',fontSize:12,fontWeight:'bold'}}>{month[parseInt(selectedTransaction.timestamp.split(' ')[0].split('-')[1])-1]} {selectedTransaction.timestamp.split(' ')[0].split('-')[2]},{selectedTransaction.timestamp.split(' ')[0].split('-')[0]}</Text></Text>
                      </View>
                  </View>

                  {/* <Divider style={{backgroundColor:'red',marginBottom:20,marginTop:20,paddingTop:2}} /> */}

                <View style={{marginTop:10}}>
                    <Text style={{ fontWeight: 'bold', letterSpacing:1, fontSize:14,padding:5,backgroundColor:'green',color:'white'}}>Customer Details: </Text>
                    <Divider />
                    <View style={{ flexDirection: 'row' ,alignItems:'center',justifyContent:'flex-start',padding:2}}>
                        <FontAwesomeIcon style={{ color: 'black' ,fontSize:13}} icon={faUserCircle} />
                        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 13, margin: 1, paddingLeft: 5 }}>{selectedTransaction.cname.toUpperCase()}</Text>
                      </View>
                      <View style={{ flexDirection: 'row' ,alignItems:'center',justifyContent:'flex-start',padding:2}}>
                        <FontAwesomeIcon style={{ color: 'black' ,fontSize:13}} icon={faMobile} />
                        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 13, margin: 1, paddingLeft: 5 }}>{selectedTransaction.cmobile}</Text>
                      </View>
                      <View style={{ flexDirection: 'row' ,alignItems:'center',justifyContent:'flex-start',padding:2}}>
                        <FontAwesomeIcon style={{ color: 'black' ,fontSize:13}} icon={faGlobe} />
                        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 13, margin: 1, paddingLeft: 5 }}>Booking Location : {selectedTransaction.clocation}</Text>
                      </View>
                      <View style={{ flexDirection: 'row' ,alignItems:'center',justifyContent:'flex-start',padding:2}}>
                        <FontAwesomeIcon style={{ color: 'black' ,fontSize:13}} icon={faCar} />
                  <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 13, margin: 1, paddingLeft: 5 }}>Vehicle : {selectedTransaction.cmake}, {selectedTransaction.cmodel}</Text>
                      </View>
                  </View>
                 
                  

              </View>
            </Modal>
          </View>
        </Content>
      </Container>
    </Root>
  );
};

export default History;