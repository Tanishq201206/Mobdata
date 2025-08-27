import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const AboutUs = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>About Us</Text>
      <Text style={styles.content}>
        Welcome to our secure data submission platform. Our goal is to ensure secure communication between trusted mobile devices and administrators. 
        {"\n\n"}
        This system uses multi-factor authentication and device verification to guarantee that only authorized users can access and transmit data. 
        {"\n\n"}
        Our commitment is to privacy, efficiency, and reliability in every interaction.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    color: '#014421',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  content: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
});

export default AboutUs;
