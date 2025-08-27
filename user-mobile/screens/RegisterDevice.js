import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerDevice } from '../services/api'; // correct usage

const RegisterDevice = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { uuid, model, os } = route.params;
  const [location, setLocation] = useState('');
  const [imei, setImei] = useState('');
  const handleRegister = async () => {
  try {
    const token = await AsyncStorage.getItem('token');

    const payload = {
      uuid,
      imei,
      model,
      os,
      location,
    };

    const response = await registerDevice(token, payload);

    // ✅ Save deviceToken only if it exists in response
    if (response.deviceToken) {
      await AsyncStorage.setItem('deviceToken', response.deviceToken);
    }

    Alert.alert('Success', response.message || 'Device registered successfully', [
      {
        text: 'OK',
        onPress: () => navigation.replace('Drawer'),
      },
    ]);
  } catch (error) {
    console.log('Device registration error:', error?.response?.data || error.message);
    Alert.alert('Registration Failed', error?.response?.data?.message || 'An error occurred');
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Register Your Device</Text>

      <Text style={styles.label}>UUID</Text>
      <TextInput style={styles.input} value={uuid} editable={false} />

      <Text style={styles.label}>IMEI</Text>
      <TextInput style={styles.input} value={imei} placeholder="Enter your sim slot 1 imei"  onChangeText={setImei}  editable={true} />
      <Text style={styles.label}>Model</Text>
      <TextInput style={styles.input} value={model} editable={false} />

      <Text style={styles.label}>Operating System</Text>
      <TextInput style={styles.input} value={os} editable={false} />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Enter your location"
      />

      <Button title="Register Device" color="#014421" onPress={handleRegister} />
    </ScrollView>
  );
};

export default RegisterDevice;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f1fdf1',
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#014421',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#014421',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
});
