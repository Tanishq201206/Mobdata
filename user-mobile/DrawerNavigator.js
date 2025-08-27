import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import HomeScreen from './screens/HomeScreen';
import MySubmissionsScreen from './screens/MySubmissionsScreen';
import AboutUs from './screens/AboutUs';
import ContactUs from './screens/ContactUs';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('deviceId');
    await AsyncStorage.removeItem('deviceToken');

    // Reset stack and navigate to Login
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="🔓 Logout"
        onPress={() =>
          Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', onPress: handleLogout },
          ])
        }
      />
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: '#014421' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
    <Drawer.Screen name="Home🏠" component={HomeScreen} />
    <Drawer.Screen name="My Submissions📨" component={MySubmissionsScreen} />
    <Drawer.Screen name="About Us🏢" component={AboutUs} />
    <Drawer.Screen name="Contact Us📞" component={ContactUs} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

