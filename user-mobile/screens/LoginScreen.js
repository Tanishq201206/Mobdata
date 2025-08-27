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
import { loginUser } from '../services/api';
import { useNavigation } from '@react-navigation/native';

const COLORS = {
  primary: '#014421',     // Royal green
  cardBg: '#f0f4f3',
  inputBorder: '#90C67C',
  textDark: '#062B1F',
};

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await loginUser({ username, password });
      const message = response.data.message;

      if (message === 'MFA enabled. Please verify OTP using /auth/verify-otp') {
        navigation.navigate('VerifyOTP', { username, password });
      } else if (message === 'MFA not set up. Please complete setup at /auth/setup-mfa') {
        Alert.alert('MFA Setup is Required');
        navigation.navigate('SetupMFA', { username, password });
      } else {
        Alert.alert('Login failed', message || 'Unknown error');
      }
    } catch (error) {
      console.error('Login error:', error?.response?.data || error.message);
      Alert.alert('Something went wrong while logging in.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header strip (matches Home) */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Login</Text>
        <Text style={styles.headerEmoji}>🔐</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>👤 User Login</Text>

        <Text style={styles.label}>Username</Text>
        <TextInput
          placeholder="Enter username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor="#6b6b6b"
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#6b6b6b"
          style={styles.input}
        />

        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

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
    marginBottom: 10,
  },
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
