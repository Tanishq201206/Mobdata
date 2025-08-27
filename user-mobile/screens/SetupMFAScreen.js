import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { setupMFA } from '../services/api';

const SetupMFAScreen = ({ route, navigation }) => {
  const { username, password } = route.params;
  const [qrBase64, setQrBase64] = useState('');
  const [secret, setSecret] = useState('');
  const [otpUri, setOtpUri] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const initiateMFA = async () => {
      try {
        const response = await setupMFA({ username, password });
        const data = response.data;

        setMessage(data.message);
        setSecret(data.secret);
        let qr = data.qrImageBase64;
        if (!qr.startsWith('data:image')) {
           qr = `data:image/png;base64,${qr}`;
          }
        setQrBase64(qr);
        
        setOtpUri(data.otpUri);           // optional: Google Auth deep link
      } catch (error) {
        Alert.alert('Error', 'Failed to setup MFA.');
        console.log('MFA setup error:', error);
      }
    };

    initiateMFA();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Set up MFA with Google Authenticator</Text>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      {qrBase64 ? (
        <Image source={{ uri: qrBase64 }} style={styles.qrImage} resizeMode="contain" />
      ) : (
        <Text>Loading QR Code...</Text>
      )}

      {secret ? (
        <View style={styles.secretContainer}>
          <Text style={styles.label}>Secret Key:</Text>
          <Text style={styles.secret}>{secret}</Text>
        </View>
      ) : null}

      {otpUri ? (
        <View style={styles.otpUriContainer}>
          <Text style={styles.label}>OTP URI (tap to open Authenticator):</Text>
          <Text style={styles.otpUri} selectable>{otpUri}</Text>
        </View>
      ) : null}

      <Button title="Done! Go to Login" onPress={() => navigation.navigate('Login')} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  qrImage: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  secretContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
  },
  secret: {
    fontSize: 16,
    marginTop: 4,
    color: '#014421',
  },
  otpUriContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  otpUri: {
    color: 'blue',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default SetupMFAScreen;
