import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {Container} from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import HomeScreen from "./Home";
import SettingsScreen from "./Settings";
import VehicleScreen from './Vehicle';
import LocationScreen from './Location';
import BookingScreen from './Booking';
import HistoryScreen from './History';
import TyreScreen from './Tyre';
import NotificationScreen from './Notification';




import SideBar from '../components/SideBar';
import { faHome, faToolbox, faCar, faSearchLocation, faTicketAlt, faHistory, faCog, faUserCog, faCogs, faBell, faLock, faQuestionCircle, faRegistered, faPhone} from '@fortawesome/free-solid-svg-icons';


const Drawer = createDrawerNavigator();

export default function Main() {
  return (
         
      <Drawer.Navigator drawerContent={props => <SideBar {...props} />}>

        <Drawer.Screen 
        name="Booking" 
        component={BookingScreen}
        options={{
          drawerLabel: 'Booking',
          drawerIcon: ({tintColor}) => <FontAwesomeIcon icon={faPhone} style={{color:tintColor}}></FontAwesomeIcon>
        }} 
        />
        <Drawer.Screen 
        name="Profile" 
        component={HomeScreen}
        options={{
          drawerLabel: 'My Profile',
          drawerIcon: ({tintColor}) => <FontAwesomeIcon icon={faHome} style={{color:tintColor}}></FontAwesomeIcon>
        }} 
        />

        <Drawer.Screen 
        name="Notification" 
        component={NotificationScreen}
        options={{
          drawerLabel: 'Notifications',
          drawerIcon: ({tintColor}) => <FontAwesomeIcon icon={faBell} style={{color:tintColor}}></FontAwesomeIcon>
        }} 
        />

        <Drawer.Screen 
        name="Vehicle" 
        component={VehicleScreen}
        options={{
          drawerLabel: 'My Vehicle',
          drawerIcon: ({tintColor}) => <FontAwesomeIcon icon={faCar} style={{color:tintColor}}></FontAwesomeIcon>
        }} 
        />

        <Drawer.Screen 
        name="Location" 
        component={LocationScreen}
        options={{
          drawerLabel: 'My Location',
          drawerIcon: ({tintColor}) => <FontAwesomeIcon icon={faSearchLocation} style={{color:tintColor}}></FontAwesomeIcon>
        }} 
        />

        <Drawer.Screen 
        name="Order" 
        component={HistoryScreen}
        options={{
          drawerLabel: 'My Order History',
          drawerIcon: ({tintColor}) => <FontAwesomeIcon icon={faHistory} style={{color:tintColor}}></FontAwesomeIcon>
        }} 
        />

        <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          drawerLabel: 'Change Password',
          drawerIcon: ({tintColor}) => <FontAwesomeIcon icon={faLock} style={{color:tintColor}}></FontAwesomeIcon>
        }} 
        />

        <Drawer.Screen 
        name="Help" 
        component={SettingsScreen}
        options={{
          drawerLabel: 'Help and Feedback',
          drawerIcon: ({tintColor}) => <FontAwesomeIcon icon={faQuestionCircle} style={{color:tintColor}}></FontAwesomeIcon>
        }} 
        />

        <Drawer.Screen 
        name="Terms" 
        component={SettingsScreen}
        options={{
          drawerLabel: 'Terms and Policy',
          drawerIcon: ({tintColor}) => <FontAwesomeIcon icon={faRegistered} style={{color:tintColor}}></FontAwesomeIcon>
        }} 
        />

       </Drawer.Navigator>

       

     
       
  );
}

