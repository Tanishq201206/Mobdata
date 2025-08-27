import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import { setNewPassword } from '../services/api';

const SetNewPasswordScreen = ({ route, navigation }) => {
  const { username } = route.params;
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      const payload = {
        username,
        otp,
        newPassword: password,
      };

      const response = await setNewPassword(payload);

      if (response.status === 200||response.data.message === 'Password has been reset successfully.') {
        Alert.alert('Success', 'Password has been reset successfully.',[
          {
            text: 'OK',
            onPress: () => navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            }),
          },
        ]);
        navigation.navigate('Login'); // Go back to login screen
      }
    } catch (error) {
      const message =
        error.response?.data || 'Something went wrong while resetting the password';
      Alert.alert('Error', message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Set New Password</Text>
      <TextInput
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Enter New Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Submit" onPress={handleSubmit} color="#014421" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  heading: {
    fontSize: 20,
    marginBottom: 30,
    textAlign: 'center',
    color: '#014421',
    fontWeight: 'bold',
  },
});

export default SetNewPasswordScreen;