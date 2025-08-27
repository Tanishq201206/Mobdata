import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchMySubmissions } from '../services/api'; // ✅ import the new API function

const MySubmissionsScreen = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // <-- NEW

  const loadSubmissions = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Unauthorized', 'No token found. Please login again.');
        return;
      }
      const data = await fetchMySubmissions(token);
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch submissions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadSubmissions();
    setRefreshing(false);
  }, [loadSubmissions]);

  const renderPayload = (payloadString) => {
    try {
      const payload = JSON.parse(payloadString);
      return Object.entries(payload).map(([key, value]) => (
        <Text key={key} style={styles.payloadText}>
          {key}: {String(value)}
        </Text>
      ));
    } catch (e) {
      return <Text style={styles.payloadText}>Invalid JSON payload</Text>;
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#014421" style={{ marginTop: 30 }} />;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#014421" />
      }
    >
      {submissions.length === 0 ? (
        <Text style={styles.emptyText}>No submissions found.</Text>
      ) : (
        submissions.map((submission) => (
          <View key={submission.id} style={styles.card}>
            <Text style={styles.idText}>ID: {submission.id}</Text>
            <Text style={styles.dateText}>
              Received: {new Date(submission.receivedAt).toLocaleString()}
            </Text>
            <View style={styles.payloadContainer}>{renderPayload(submission.jsonPayload)}</View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#f0f4f3',
    padding: 16,
    marginBottom: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#014421',
  },
  idText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#014421',
  },
  dateText: {
    fontSize: 14,
    marginBottom: 8,
  },
  payloadContainer: {
    marginTop: 4,
  },
  payloadText: {
    fontSize: 14,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 50,
    color: '#555',
  },
});

export default MySubmissionsScreen;
