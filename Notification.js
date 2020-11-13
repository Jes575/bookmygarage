import React from "react";
import { View, Text } from "react-native";
import MyHeader from './MyHeader';

const Notification = props => {
  return (
    <View>
      <MyHeader navigation={props.navigation} title="notifications-active" tabName="Notifications" />
      <Text>This is Profile Screen</Text>
    </View>
  );
};

export default Notification;