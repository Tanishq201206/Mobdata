import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
enableScreens();

import LoginScreen from './screens/LoginScreen';
import VerifyOTPScreen from './screens/VerifyOTPScreen';
import SetNewPasswordScreen from './screens/SetNewPasswordScreen';
import SetupMFAScreen from './screens/SetupMFAScreen';
import RegisterDevice from './screens/RegisterDevice';
import DrawerNavigator from './DrawerNavigator';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
        <Stack.Screen name="SetNewPassword" component={SetNewPasswordScreen} />
        <Stack.Screen name="SetupMFA" component={SetupMFAScreen} />
        <Stack.Screen name="RegisterDevice" component={RegisterDevice} />

        {/* 👇 Make DrawerNavigator full-screen and responsible for its own headers */}
        <Stack.Screen
          name="Drawer"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
