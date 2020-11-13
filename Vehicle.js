import React,{useState,useEffect} from "react";
import { Image,ImageBackground,Keyboard,TouchableOpacity,Dimensions,Alert} from "react-native";
import {Container,Content,View,Text,Root, Card, CardItem, Left, Item, Label,Input, Button, Icon,ActionSheet,Toast, Body, Right,Picker} from 'native-base';
import MyHeader from './MyHeader';
import {Divider} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import {serverAddr} from '../App';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCar, faEdit, faTrash, faTrashAlt, faPlusCircle, faTimes, faAddressCard } from "@fortawesome/free-solid-svg-icons";
import Modal from 'react-native-modal';

const Vehicle = props => {
  const [myInfo,setMyInfo]=useState({});
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [carDetails, setCarDetails] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [carMake, setCarMake] = useState([]);
  const [carModel, setCarModel] = useState([]);
  const [selectedMake, setMakeSelected] = useState('');
  const [selectedModel, setModelSelected] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedRegno, setSelectedRegno] = useState('');  
  const [selectedChasis, setSelectedChasis] = useState('');
  const [isedit, setIsEdit] = useState(false);
  const [editID, setEditID] = useState('none');
  const myCars=[];

  let carMakeItems= carMake.map( (s, i) => {
    return <Picker.Item key={s} value={s} label={s} />
  });

  let carModelItems= carModel.map( (s, i) => {
    return <Picker.Item key={s} value={s} label={s} />
  });

  useEffect(() => {
    AsyncStorage.getItem('LoggedIn')
      .then((token) => {
        token = JSON.parse(token);
        setMyInfo(token);
        const user = new FormData();
        user.append("cid", token.ID);
        fetch(serverAddr + '/getCarDetailsbyID.php', {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          body: user
        })
          .then((response) => response.json())
          .then((responseJson) => {
            //console.log(responseJson);
            setCarDetails(responseJson);
          });
      });

    var newarr = new Array();
    const user = new FormData();
    user.append("name", "123");
    fetch(serverAddr + '/getCarmake.php', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: user
    })
      .then((response) => response.json())
      .then((responseJson) => {

        var len = Object.keys(responseJson).length;
        for (var i = 0; i < len; i++) {
          newarr.push(responseJson[i]['make']);
        }
        setCarMake(newarr);

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

  }, []);

  editVehicle=(id,make,model,year,color,regno,chasis)=>{
    setShowModel(true);
    setMakeSelected(make);
    setSelectedYear(year);
    setSelectedColor(color);
    setSelectedRegno(regno);
    setSelectedChasis(chasis);
    setIsEdit(true);
    setEditID(id);
    var newarr=new Array();
    const user= new FormData();
      user.append("make", make);
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
        setTimeout(() => {
          setModelSelected(model);  
        }, 1000);
      });
      
  }

  deleteVehicle=(id)=>{
    Alert.alert(
      'Confirm Delete',
      'Are you sure want to do this ?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'Delete',style:'destructive', onPress: () => {
          var newarr = new Array();
          const user= new FormData();
          user.append("id", id);
          user.append("cid", myInfo.ID);
          fetch(serverAddr + '/delCustCar.php', {
            method: 'post',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
            },
            body: user
          })
            .then((response) => response.json())
            .then((responseJson) => {
              setCarDetails(responseJson);
              Toast.show({
                text: "Vehicle deleted successfully.",
                duration: 5000,
                buttonText: "Okey",
                buttonStyle: {backgroundColor: '#116600',color:'#fff',borderRadius:5,opacity:0.7},
                type : "success",
              })
            })
        }},
      ],
      {cancelable: false},
    );
  }

  carDetails.forEach(function (details) {
    myCars.push(
      <Card>
        <CardItem>
          <Left>
            <View style={{borderColor:'red',borderRightWidth:2}}>
            <FontAwesomeIcon icon={faCar} style={{margin:10,padding:15,color:'blue'}} />
            </View>
            <Body>
              <View>
                <Text style={{fontWeight:'bold',fontSize:14}}>{details.make}, {details.model}, {details.year}</Text>
                <Text style={{fontSize:12}}>Color : {details.color}</Text>
                <Text style={{fontSize:11,fontWeight:'bold'}}>REG NO : {details.regno.toUpperCase()}</Text>
                <Text style={{fontSize:11,fontWeight:'bold'}}>CHASIS : {details.chasis.toUpperCase()}</Text>
              </View>

            </Body>
              <TouchableOpacity onPress={()=>editVehicle(details.ID,details.make,details.model,details.year,details.color,details.regno,details.chasis)} style={{marginRight:10}}>
                <FontAwesomeIcon icon={faEdit} style={{color:'green'}} />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>deleteVehicle(details.ID)}>
                <FontAwesomeIcon icon={faTrashAlt} style={{color:'crimson'}} />
              </TouchableOpacity>
          </Left>
        </CardItem>
      </Card>
      )
  })

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

  closeModel=()=>{
    setShowModel(false);
    setMakeSelected('');
    setModelSelected('');
    setSelectedYear('');
    setSelectedColor('');
    setSelectedRegno('');
    setSelectedChasis('');
    setCarModel([]);
    setIsEdit(false);
    setEditID('none');
  }

  addCar=()=>{
    if(selectedMake=="")
    {
      Toast.show({
        text: "Select Car Make",
        duration: 5000,
        buttonText: "Okey",
        buttonStyle: {backgroundColor: '#992222',color:'#fff',borderRadius:5,opacity:0.7},
        type : "danger",
      })
    }
    else if(selectedModel=="")
    {
      Toast.show({
        text: "Select Car Model",
        duration: 5000,
        buttonText: "Okey",
        buttonStyle: {backgroundColor: '#992222',color:'#fff',borderRadius:5,opacity:0.7},
        type : "danger",
      })
    }
    else if(selectedChasis=="")
    {
      Toast.show({
        text: "Please provide Chasis number",
        duration: 5000,
        buttonText: "Okey",
        buttonStyle: {backgroundColor: '#992222',color:'#fff',borderRadius:5,opacity:0.7},
        type : "danger",
      })
    }
    else {
      const user = new FormData();
      user.append("id", editID);
        user.append("cid", myInfo.ID);
        user.append("make", selectedMake);
        user.append("model", selectedModel);
        user.append("color", selectedColor);
        user.append("year", selectedYear);
        user.append("regno", selectedRegno);
        user.append("chasis", selectedChasis);
        fetch(serverAddr + '/postCarDeatils.php', {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          body: user
        })
          .then((response) => response.json())
          .then((responseJson) => {
            if(responseJson.length==0)
            {
              Toast.show({
                text: "Registration number or Chasis number is already registered !!",
                duration: 5000,
                buttonText: "Okey",
                buttonStyle: {backgroundColor: '#992222',color:'#fff',borderRadius:5,opacity:0.7},
                type : "danger",
              })
            }
            else
            {
              closeModel();
              setCarDetails(responseJson);
              Toast.show({
                text: "Vehicle added successfully.",
                duration: 5000,
                buttonText: "Okey",
                buttonStyle: {backgroundColor: '#116600',color:'#fff',borderRadius:5,opacity:0.7},
                type : "success",
              })
            }
          })
    }
  }

  return (
    <Root>
      <Container style={{backgroundColor:'#efefef'}}>
      <MyHeader navigation={props.navigation} title="directions-car" />
        <Content>
        <View>
            <View style={{ paddingTop: 20, paddingBottom: 10, alignSelf: 'center', flexDirection: 'row' }}>
              <FontAwesomeIcon icon={faCar} size={17} style={{ marginRight: 20, color: 'teal', alignSelf: 'center' }} />
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Vehicle Details</Text>
            </View>
            <Divider style={{ backgroundColor: 'teal', width: '90%', alignSelf: 'center' }} />
          {carDetails.length==0?
            <Card>
              <CardItem>
                <Left>
                  <View style={{ borderColor: 'red', borderRightWidth: 1 }}>
                    <FontAwesomeIcon icon={faCar} style={{ margin: 10, padding: 15, color: 'blue' }} />
                  </View>
                  <Body>
                    <View>
                      <Text style={{ fontWeight: 'bold', fontSize: 14 }}>No Vehicle Found</Text>
                      <Text note style={{ fontSize: 12, fontWeight: 'bold' }}>Add your vehicle for better searching results</Text>
                    </View>
                  </Body>
                </Left>
              </CardItem>
            </Card>
          :myCars}
          <Button danger onPress={()=>setShowModel(true)} style={{alignSelf:'center',margin:20,backgroundColor:'teal'}}>
            <FontAwesomeIcon icon={faPlusCircle} style={{marginLeft:10,color:'white'}} />
            <Text >Add New Vehicle</Text>
          </Button>
          <Modal animationOut='slideOutUp' animationIn='slideInDown' avoidKeyboard={true}  isVisible={showModel}>
          <View style={{ flex: 1 }} style={{backgroundColor:'white',padding:20}}>
            <TouchableOpacity onPress={()=>closeModel()}>
              <FontAwesomeIcon style={{alignSelf:'flex-end',color:'red'}} icon={faTimes} />
            </TouchableOpacity>
                {/* Car Make */}
                <View style={{ marginTop: 20 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Icon name="car" style={{ fontSize: 15 }}></Icon>
                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{"  "}Car Make: <Text style={{color:'red',fontSize:12}}>*</Text></Text>
                  </View>
                  <Picker
                    mode="dropdown"
                    style={{ width: Dimensions.get('screen').width }}
                    itemTextStyle={{ fontWeight: 'bold', fontSize: 14 }}
                    placeholderStyle={{ fontSize: 12 }}
                    textStyle={{ fontSize: 14, fontWeight: 'bold' }}
                    selectedValue={selectedMake}
                    onValueChange={(value) => onMakeValueChange(value)}
                    placeholder={"Select one"}
                  >
                    <Picker.Item label="Select Make" value="" />
                    {carMakeItems}
                  </Picker>
                  <Divider />
                </View>

                {/* Car Model */}
                <View style={{ marginTop: 30 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Icon name="car" style={{ fontSize: 15 }}></Icon>
                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{"  "}Car Model: <Text style={{color:'red',fontSize:12}}>*</Text></Text>
                  </View>
                  <Picker
                    mode="dropdown"
                    style={{ width: Dimensions.get('screen').width }}
                    itemTextStyle={{ fontWeight: 'bold', fontSize: 14 }}
                    placeholderStyle={{ fontSize: 12 }}
                    textStyle={{ fontSize: 14, fontWeight: 'bold' }}
                    selectedValue={selectedModel}
                    onValueChange={(value) => setModelSelected(value)}
                    placeholder={"Select one"}
                  >
                    <Picker.Item label="Select Model" value="" />
                    {carModelItems}
                  </Picker>
        <Divider />
      </View>

              {/* car year, color, regno, chasis */}
              <View>
              <Item style={{marginTop:10}} floatingLabel>
              <Label style={{fontWeight:'bold',fontSize:12}}>Year (Model):</Label>
              <Input keyboardType='number-pad' onChangeText={(value)=>setSelectedYear(value)} value={selectedYear} returnKeyType='done' style={{fontWeight:'bold',fontSize:12}} />
            </Item>
            <Item style={{marginTop:10}} floatingLabel>
              <Label style={{fontWeight:'bold',fontSize:12}}>Color :</Label>
              <Input returnKeyType='done' onChangeText={(value)=>setSelectedColor(value)} value={selectedColor} style={{fontWeight:'bold',fontSize:12}} />
            </Item>
            <Item style={{marginTop:10}} floatingLabel>
              <Label style={{fontWeight:'bold',fontSize:12}}>Registration No:</Label>
              <Input autoCapitalize='characters' returnKeyType='done' onChangeText={(value)=>setSelectedRegno(value)} value={selectedRegno} style={{fontWeight:'bold',fontSize:12}} />
            </Item>
            <Item style={{marginTop:10}} floatingLabel>
              <Label style={{fontWeight:'bold',fontSize:12}}>chasis : <Text style={{color:'red',fontSize:12}}>*</Text></Label>
              <Input autoCapitalize='characters' returnKeyType='done' onChangeText={(value)=>setSelectedChasis(value)} value={selectedChasis} style={{fontWeight:'bold',fontSize:12}} />
            </Item>
              </View>

            <Button onPress={()=>addCar()} block style={{marginTop:10,backgroundColor:'teal'}}>
          <Text style={{textAlign:'center',color:'white',fontWeight:'bold'}}>{isedit?"UPDATE":"SUBMIT"}</Text>
            </Button>

          </View>
        </Modal>
        </View>
        </Content>
      </Container>
    </Root>
    
  );
};

export default Vehicle;