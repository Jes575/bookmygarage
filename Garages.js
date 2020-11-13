import React, {useState,useEffect} from "react";
import { View, Dimensions, Image, FlatList} from "react-native";
import { Container, Header,Title,Subtitle, Content, Item, Form, Card,CardItem, Text, Icon, Button , Left, Body,Right, Thumbnail, Spinner,Picker} from "native-base";
import {serverAddr} from '../App';
import {onlyServerAddr} from '../App';
import {myApiKey} from '../App';
import StarRating from 'react-native-star-rating';



const Garages =({route, navigation}) =>{
    const [garageDetails, setGarageDetails] = useState([]);
    const [selectedSort, setSelectedSort] = useState(0);
    const [changeSort, setChangeSort] = useState(0);
    const [loadingDone, setLoadingDone] = useState(0);
    //const [myDetails, setMyDetails] = useState([]);
    const { make } = route.params;
    const { model } = route.params;
    const { service } = route.params;
    const { geoLat } = route.params;
    const { geoLong } = route.params;
    const { props } = route.params;
    const { formatedAddr } = route.params;

    var getDistance=(p1lat,p1lng,p2lat,p2lng)=>{
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = (p2lat - p1lat)* Math.PI / 180;
                var dLong = (p2lng - p1lng)*Math.PI / 180;
                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos( Math.PI / 180*(p1lat)) * Math.cos( Math.PI / 180*(p2lat)) *
                    Math.sin(dLong / 2) * Math.sin(dLong / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c;
                return d; 
    }

    const onSortValueChange=(value)=>{
      setSelectedSort(value);
      setChangeSort(false);
      if(value=="Rating")
      garageDetails.sort(function(a, b){
        return a.rating < b.rating;
      });
      if(value=="Distance")
      garageDetails.sort(function(a, b){
        return parseFloat(a.distance) > parseFloat(b.distance);
      });
      if(value=="Garage")
      garageDetails.sort(function(a, b){
        return a.gname.toLowerCase() > b.gname.toLowerCase();
      });


    }

    useEffect(() => {
        setLoadingDone(false);
        const user= new FormData();
          user.append("service", service);
          user.append("geoLat", geoLat);
          user.append("geoLong", geoLong);
          fetch(serverAddr+'/getGaragedetailsBestMatches.php',{
            method:'post',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
          },
          body:user
          })
          .then((response) => response.json())
          .then((responseJson) => {
            for(var i=0;i<Object.keys(responseJson).length;i++ )
            {
              var dist=parseFloat(getDistance(geoLat,geoLong,responseJson[i].lat,responseJson[i].lng)).toFixed(2);
              responseJson[i].distance=dist;
            }
            setSelectedSort('Distance')
            setLoadingDone(true);
            responseJson.sort(function(a, b){
              return parseFloat(a.distance) > parseFloat(b.distance);
            })
            setGarageDetails(responseJson);
            // console.log(garageDetails);
          });
    
        setChangeSort(false);
          
          
        }, [])

        var myDetails=[];
    garageDetails.forEach(function(details){ 
      var units=" Meters";
      var dist=parseFloat(details.distance);
      if(dist>1000)
      {
      dist = (dist/1000).toFixed(2);
      units= " KM";
      }
        
        myDetails.push(
            <Card>
            <CardItem style={{shadowColor:'red',backgroundColor:'#fff5d7'}}>
                <Left>
                    <Thumbnail large style={{borderColor:'#ff5e6c',borderWidth:2}} source={{uri:onlyServerAddr+details.image}} />
                
                <Body>
                    <Text style={{fontSize:12,textTransform:'uppercase',fontWeight:'bold',color:'#31000e'}}>
                        {details.gname}
                    </Text>
                    <Text note style={{fontWeight:'bold',fontSize:9,color:'#71101e'}}>{details.gaddress}</Text>
                    <Text note style={{fontWeight:'bold',fontSize:12,color:'green'}}>Distance : {dist} {units} </Text>
                    <StarRating
                      disabled={false}
                    maxStars={5}
                    rating={parseFloat(details.rating)}
                    starSize={12}
                    containerStyle={{margin:0,width:Dimensions.get('screen').width*0.25}}
                    
                    fullStarColor={'red'}
                    
                    />
                </Body>
                <Right>
                    <Button onPress={()=>navigation.navigate('SelectService',{'id':details.ID,'make':make,'model':model,'service':service,'formatedAddr':formatedAddr,'gdetails':details,'geoLat':geoLat,'geoLong':geoLong,'props':props})} style={{backgroundColor:'#ff414e',borderRadius:3}}>
                        <Text style={{fontSize:12,fontWeight:'bold'}}>VIEW</Text>
                    </Button>
                </Right>
                </Left>
                
            </CardItem>
        </Card>
        )
    })

    return(
        <Container style={{backgroundColor:'#dddddd'}}>
        <Header style={{backgroundColor:'teal'}}>
        <Left>
            <Button transparent onPress={()=>navigation.navigate('Booking')}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title style={{fontWeight:'bold',color:'white'}}>GARAGES</Title>
            <Subtitle style={{color:'white',fontWeight:'bold'}}>Book My Garage</Subtitle>
          </Body>
          <Right>
          <Button transparent onPress={()=>props.navigation.toggleDrawer()}>
              <Icon name='menu' />
            </Button>
              </Right>
        </Header>
        
        {Object.keys(garageDetails).length!=0?
        <Card>
          <CardItem style={{backgroundColor:'#ff414e'}}>
            
              {!(changeSort)?
              <Left>
              <Icon name="bus" style={{color:'#41ff4e',fontSize:25}}>{"  "}</Icon>
              <Body>
                <Text style={{color:'#ffff00',fontWeight:'bold'}}>{Object.keys(garageDetails).length} Garages Found</Text>
                <Text style={{fontSize:12,fontWeight:'bold',color:'white'}}>Sorted on : {selectedSort}</Text>
                <Text style={{fontSize:12,fontWeight:'bold',color:'white'}}>Your Location : {formatedAddr}</Text>
              </Body>
              <Button  style={{borderRadius:5,backgroundColor:'white'}} onPress={()=>setChangeSort(true)}>
                <Text style={{color:'#ff414e',fontWeight:'bold',fontSize:12}}>SORT</Text>
              </Button>
              </Left>
              :
              <Left>
                <Text style={{fontSize:12,fontWeight:'bold',color:'#ffff00'}}>SORT BY : </Text>
              <Picker
              mode="dropdown"
              style={{ width: Dimensions.get('screen').width * 0.5}}
              itemTextStyle={{fontWeight:'bold',fontSize:14}}
              placeholderStyle={{fontSize:12}}
              textStyle={{fontSize:14,fontWeight:'bold'}}
              selectedValue={selectedSort}
              onValueChange={(value)=>onSortValueChange(value)}
              placeholder={"Select one"} >
                <Picker.Item label="Sort By :" value="" /> 
                <Picker.Item label="Distance" value="Distance" />
                <Picker.Item label="Ratings" value="Rating" />
                <Picker.Item label="Alphabatically" value="Garage" />
              </Picker>
              </Left>
        }
            
              
            
          </CardItem>
          </Card>
        : null
        }
        
        {Object.keys(garageDetails).length==0?
        (!loadingDone)?
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <Text style={{textAlign:'center',fontWeight:'bold',fontSize:12}}>Searching Garages . . .</Text>
        <Spinner />
      </View>
      :
      <Card>
        <CardItem backgroundColor="yellow">
          <Left>
            <Icon name="ios-close-circle"></Icon>
            <Body>
              <Text>Sorry! No Garage found nearby.</Text>
            </Body>
          </Left>
          <Right>
            <Button danger onPress={()=>navigation.navigate('Booking')}>
                <Text>Go Back</Text>
            </Button>
          </Right>
        </CardItem>
      </Card>
      :
      myDetails  
      }
      </Container>
    )
}

export default Garages;