import React,{Component} from 'react';
import {View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Navigator} from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {faUserCircle,faUserAlt,faBars, faAddressBook, faUserClock} from '@fortawesome/free-solid-svg-icons';

import { NavigationContainer} from 'react-navigation'
import { createDrawerNavigator} from 'react-navigation-drawer'

const styles= StyleSheet.create ({
    vstyle : {
        flex:1,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: 'yellow'
    },
    part1 : {
        alignItems:'flex-end',
        //justifyContent:'flex-end',
        backgroundColor: 'teal',
        color:'white',
        padding:20,
        height: Dimensions.get('screen').height/6,
        width: Dimensions.get('screen').width,
        flexDirection:'row'
    },
    part2 : {
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: 'white',
        height: 5*Dimensions.get('screen').height/6,
        width: Dimensions.get('screen').width
    }


})
const ht= Dimensions.get('screen').height;
//const Drawer= createDrawerNavigator();
export default class home1 extends Component {
    render() {
        return (
            <View style={styles.vstyle}>
                <View style={styles.part1}>
                    <View style={{flexDirection:'row',width:Dimensions.get('screen').width*0.8}}>
                        <Image source={require('../images/carLogo3.png')} style={{height:27,width:50,shadowOffset:{width:5,height:10},shadowColor:'white',shadowOpacity:1.0,shadowRadius:5}}></Image>
                        <Text style={{textAlign:'left',paddingLeft:20,paddingBottom:0,color:'white',fontSize:12,fontWeight:'bold',letterSpacing:3,fontFamily:'Ubuntu-Bold'}}>
                            <Text style={{color:'pink',fontSize:20}}>B</Text>
                            OOKMYGARAGE.AE
                        </Text>
                    </View>
                    <View style={{width:Dimensions.get('screen').width*0.2}}>
                        <TouchableOpacity onPress={this.props.navigation.openDrawer}>
                            <FontAwesomeIcon style={{color:'white'}} size={40} icon={faBars}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.part2}>
                    <Text>Sample</Text>
                </View>
            </View>
        )
    }
}