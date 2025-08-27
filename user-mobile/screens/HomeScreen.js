import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserStatus, requestDataAccess, submitDataPayload } from '../services/api';

const HomeScreen = () => {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [jsonFields, setJsonFields] = useState([{ key: '', value: '' }]);

  // NEW: sending guard (prevents double-submit)
  const [sending, setSending] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedToken = await AsyncStorage.getItem('token');

      if (storedUsername && storedToken) {
        setUsername(storedUsername);
        const response = await getUserStatus(storedUsername, storedToken);
        const data = response.data;

        setStatus({
          emailVerified: data.emailVerified,
          deviceApproved: data.deviceApproved,
          dataSendingEnabled: data.dataSendingEnabled,
          dataRequestStatus: data.dataRequestStatus,
          deviceBlocked: data.deviceBlocked ?? data.deiceBlocked, // fallback for typo
        });
      }
    } catch (error) {
      console.error('Error fetching user status:', error);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchStatus();
    setRefreshing(false);
  }, [fetchStatus]);

  const handleRequestAccess = async () => {
    try {
      const deviceId = await AsyncStorage.getItem('deviceId');
      const token = await AsyncStorage.getItem('token');

      if (!deviceId || !token) {
        setErrorMessage('Missing device ID or token.');
        return;
      }

      const response = await requestDataAccess(deviceId, token);

      if (response.status === 200) {
        setSuccessMessage('✅ Request submitted. Wait for admin approval.');
        setErrorMessage('');
        fetchStatus();
      } else if (response.status === 409) {
        setErrorMessage('❌ Request already submitted. If Data Request Status is ✅, you can send data.');
        setSuccessMessage('');
      } else {
        setErrorMessage('❌ Something went wrong. Please try again.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error requesting data access:', error);
      setErrorMessage('❌ Request failed.');
      setSuccessMessage('');
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedFields = [...jsonFields];
    updatedFields[index][field] = value;
    setJsonFields(updatedFields);
  };

  const addField = () => {
    setJsonFields([...jsonFields, { key: '', value: '' }]);
  };

  // UPDATED: guarded, disables button while sending, proper Alert usage
  const sendData = async () => {
    if (sending) return; // prevent double-tap
    setSuccessMessage('');
    setErrorMessage('');

    try {
      setSending(true);

      const deviceToken = await AsyncStorage.getItem('deviceToken');
      const token = await AsyncStorage.getItem('token');

      if (!deviceToken || !token) {
        setErrorMessage('Missing token or deviceToken');
        return;
      }

      const jsonPayload = {};
      jsonFields.forEach(({ key, value }) => {
        if (key.trim() !== '') {
          jsonPayload[key.trim()] = isNaN(value) ? value : Number(value);
        }
      });

      const response = await submitDataPayload(deviceToken, jsonPayload, token);
      if (response.status === 200) {
        setSuccessMessage('✅ Data submitted successfully.');
        setErrorMessage('');
        setShowForm(false);
        setJsonFields([{ key: '', value: '' }]);
      } else {
        setErrorMessage('❌ Failed to send data.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error sending data:', error);
      // Fix Alert signature (no raw object as 3rd param)
      const msg = error?.response?.data?.message || error?.message || 'Unknown error occurred';
      Alert.alert('Submission Error', msg);
      setErrorMessage('❌ Submission failed.');
      setSuccessMessage('');
    } finally {
      setSending(false);
    }
  };

  const renderStatus = (label, value) => (
    <Text style={styles.cardText}>
      {label}: {value ? '✅ Yes' : '❌ No'}
    </Text>
  );

  if (!status) {
    return (
      <View style={styles.centered}>
        <Text>Loading user status...</Text>
      </View>
    );
  }

  if (status.deviceBlocked) {
    return (
      <View style={styles.centered}>
        <Text style={styles.blockedText}>🚫 Your device is blocked</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* User Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>👤 User Info</Text>
        <Text style={styles.cardText}>Username: {username}</Text>
      </View>

      {/* Status Overview */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Status Overview</Text>
        {renderStatus('📧 Email Verified', status.emailVerified)}
        {renderStatus('📱 Device Approved', status.deviceApproved)}
        {renderStatus('📤 Data Request Status', status.dataRequestStatus)}
        {renderStatus('📦 Send Allowed', status.dataSendingEnabled)}
      </View>

      {/* Request Access Button */}
      {!status.dataRequestStatus && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>⚙️ Quick Actions</Text>
          <Text style={styles.cardText}>🔘 Request Data Access</Text>
          <TouchableOpacity style={styles.button} onPress={handleRequestAccess}>
            <Text style={styles.buttonText}>Request Access</Text>
          </TouchableOpacity>
          {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        </View>
      )}

      {/* Send Data Button */}
      {status.deviceApproved && status.dataSendingEnabled && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📤 Send Data</Text>

          {!showForm ? (
            <TouchableOpacity style={styles.button} onPress={() => setShowForm(true)}>
              <Text style={styles.buttonText}>Send Data</Text>
            </TouchableOpacity>
          ) : (
            <>
              {jsonFields.map((field, index) => (
                <View key={index} style={{ marginBottom: 8 }}>
                  <TextInput
                    placeholder="Key (e.g. temperature)"
                    style={styles.input}
                    value={field.key}
                    onChangeText={(text) => handleInputChange(index, 'key', text)}
                  />
                  <TextInput
                    placeholder="Value"
                    style={styles.input}
                    value={field.value}
                    onChangeText={(text) => handleInputChange(index, 'value', text)}
                  />
                </View>
              ))}
              <TouchableOpacity onPress={addField} style={styles.button}>
                <Text style={styles.buttonText}>+ Add Field</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={sendData}
                style={[styles.button, sending && { opacity: 0.6 }]}
                disabled={sending}
              >
                <Text style={styles.buttonText}>{sending ? 'Sending…' : 'Submit Data'}</Text>
              </TouchableOpacity>
            </>
          )}

          {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#014421',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  successText: {
    color: 'green',
    marginTop: 6,
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    marginTop: 6,
    fontSize: 14,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },
  blockedText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },
});

export default HomeScreen;
