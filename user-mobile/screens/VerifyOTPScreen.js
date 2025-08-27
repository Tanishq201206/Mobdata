import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { verifyOTP, checkDevice, getDeviceByUsername } from '../services/api';

const COLORS = {
  primary: '#014421',     // Royal green
  cardBg: '#f0f4f3',
  inputBorder: '#90C67C',
  textDark: '#062B1F',
};

const VerifyOTPScreen = ({ route, navigation }) => {
  const { username, password } = route.params;
  const [otp, setOtp] = useState('');

  const handleVerifyOTP = async () => {
    try {
      const payload = { username, password, otp };
      const response = await verifyOTP(payload);
      const data = response.data;

      if (data.message === 'Invalid OTP') {
        Alert.alert('Invalid OTP', 'Please check your OTP and try again.');
        return;
      }

      // Save token + username
      if (data.token) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('username', username);
      }

      if (data.message === 'First login. Please change your password.') {
        navigation.navigate('SetNewPassword', { username });
      } else if (data.token) {
        const uuid = await DeviceInfo.getUniqueId();
        const token = data.token;

        const deviceCheck = await checkDevice(uuid, token);

        if (deviceCheck.data.message === 'Device not registered') {
          const model = await DeviceInfo.getModel();
          const os = DeviceInfo.getSystemName() + ' ' + DeviceInfo.getSystemVersion();

          navigation.replace('RegisterDevice', { uuid, model, os });
        } else if (deviceCheck.data.message === 'Device not verified wait for admin to verify') {
          Alert.alert(
            'Device not verified',
            'Please wait for admin to verify your device.',
            [
              {
                text: 'OK',
                onPress: () =>
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  }),
              },
            ]
          );
          navigation.navigate('Login');
        } else {
          try {
            const storedUsername = await AsyncStorage.getItem('username');
            const storedToken = await AsyncStorage.getItem('token');
            const response = await getDeviceByUsername(storedUsername, storedToken);
            const { deviceId, token } = response.data;
            await AsyncStorage.setItem('deviceId', deviceId.toString());
            await AsyncStorage.setItem('deviceToken', token);
          } catch (error) {
            console.error('Error fetching device info:', error);
            Alert.alert('Error', 'Failed to fetch device info');
          }
          navigation.replace('Drawer');
        }
      } else {
        Alert.alert('Unexpected response', JSON.stringify(data));
      }
    } catch (error) {
      console.error('OTP verification error:', error?.response?.data || error.message);
      Alert.alert('Something went wrong while verifying OTP');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header strip */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Verify OTP</Text>
        <Text style={styles.headerEmoji}>📲</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔑 One-Time Password</Text>
        <Text style={styles.helper}>
          Enter the 6-digit code from your Authenticator app.
        </Text>

        <Text style={styles.label}>OTP Code</Text>
        <TextInput
          style={styles.input}
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
          maxLength={6}
          placeholder="Enter OTP"
          placeholderTextColor="#6b6b6b"
        />

        <TouchableOpacity onPress={handleVerifyOTP} style={styles.button}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flexGrow: 1 },
  header: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerEmoji: { color: '#fff', fontSize: 18 },
  card: {
    backgroundColor: COLORS.cardBg,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  helper: { fontSize: 13, color: '#3f3f3f', marginBottom: 10 },
  label: { fontSize: 14, color: COLORS.textDark, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
    marginBottom: 12,
    color: COLORS.textDark,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default VerifyOTPScreen;
