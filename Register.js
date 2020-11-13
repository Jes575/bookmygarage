import React, {useState,useEffect, Component} from "react";
import { View, Dimensions, Image, FlatList,BackHandler,Alert } from "react-native";
import { Container, Header, Content,Item,Label,Input, Picker, Form,Toast,Title,Subtitle, Card,CardItem, Text, Icon, Left, Body,Right, Root,Button} from "native-base";
import {signOutScreen, myName, imageURL} from '../App';

export default class Register extends Component {

    userRegister = async() =>{

        const user= new FormData();

        user.append("full_Name", full_Name);
        user.append("mobile", mobile);
        user.append("email", email);
        user.append("address", address);

        data.append("role", "customer");

        await fetch(serverAddr+'/updateCustDetails.php',{
        method:'post',
         headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
    },
    body:data,
    })
    }

    render() {

        return (
        <Container>
            <Header style={{ backgroundColor: 'teal',flex:0}}>
            <Right style={{flexDirection:'row'}}>
                     <Button transparent onPress={() =>signOutScreen() }
                            style={{paddingRight:20}}>
                        <Icon style={{color:'white',paddingLeft:10}} name='arrow-back'/> 
                    </Button>
                    <Body style={{alignItems:'flex-start',paddingRight:20,flexDirection:'row'}}>
                        <Icon style={{color:'white',paddingRight:50}} name='md-contact' />
                    <View style={{alignItems:'flex-start',paddingLeft:10}}>
                    <Title style={{    }}><Text style={{fontWeight: 'bold', fontSize:15,color:'white'}}>NEW USER REGISTRATION</Text></Title>
                    <Subtitle style={{ color: 'white', fontWeight: 'bold' }}>Book My Garage</Subtitle>
                    </View>
                    
                    </Body>
                </Right>
            </Header>
            <Content style={{marginTop:20}}>
                <Item floatingLabel style={{ width: '90%', alignSelf: 'center', margin: 5 }}>
                    <Label style={{ fontWeight: 'bold', fontSize: 14 }}>Full Name : <Text style={{ color: 'red' }}>*</Text></Label>
                    <Icon style={{ color: 'teal', fontSize: 18 }} name="ios-contact" />
                  
                </Item>

                 <Item floatingLabel style={{ width: '90%', alignSelf: 'center', margin: 5 }}>
                    <Label style={{ fontWeight: 'bold', fontSize: 14 }}>Email : <Text style={{ color: 'red' }}>*</Text></Label>
                    <Icon style={{ color: 'teal', fontSize: 18 }} name="ios-contact" />
                  
                </Item>

                <Item floatingLabel style={{ width: '90%', alignSelf: 'center', margin: 5 }}>
                    <Label style={{ fontWeight: 'bold', fontSize: 14 }}>Mobile : <Text style={{ color: 'red' }}>*</Text></Label>
                    <Icon style={{ color: 'teal', fontSize: 18 }} name="ios-contact" />
                  
                </Item>

                <Item floatingLabel style={{ width: '90%', alignSelf: 'center', margin: 5 }}>
                    <Label style={{ fontWeight: 'bold', fontSize: 14 }}>Password : <Text style={{ color: 'red' }}>*</Text></Label>
                    <Icon style={{ color: 'teal', fontSize: 18 }} name="md-lock" />
                <Input secureTextEntry={true}  />
                </Item>

                <Item floatingLabel style={{ width: '90%', alignSelf: 'center', margin: 5 }}>
                    <Label style={{ fontWeight: 'bold', fontSize: 14 }}>Repeat Password : <Text style={{ color: 'red' }}>*</Text></Label>
                    <Icon style={{ color: 'teal', fontSize: 18 }} name="md-lock" />
                    <Input secureTextEntry={true}  />
                </Item>
               
                <Item floatingLabel style={{ width:'90%',alignSelf: 'center', margin: 5 }}>
                    <Label style={{ fontWeight: 'bold', fontSize: 14 }}>Address : <Text style={{ color: 'red' }}>*</Text></Label>
                    <Icon style={{ color: 'teal', fontSize: 18 }} name="md-pin" />
                </Item>
                
                <Button onPress={()=>this.userRegister()}
                style={{width:200, borderRadius:25,justifyContent:'center',alignSelf:'center',color:'#26a69a',marginTop:50}}>   
                <Text style={{color:'#ffffff'}}>REGISTER</Text>
                </Button>
            </Content>
        </Container>


        );


    }


}