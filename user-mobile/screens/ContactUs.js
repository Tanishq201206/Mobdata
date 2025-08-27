import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';

const ContactUs = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Us</Text>

      <Text style={styles.label}>📧 Email:</Text>
      <TouchableOpacity onPress={() => Linking.openURL('mailto:support@example.com')}>
        <Text style={styles.link}>support@example.com</Text>
      </TouchableOpacity>

      <Text style={styles.label}>📞 Phone:</Text>
      <TouchableOpacity onPress={() => Linking.openURL('tel:+911234567890')}>
        <Text style={styles.link}>+91 00000 00000</Text>
      </TouchableOpacity>

      <Text style={styles.label}>🏢 Address:</Text>
      <Text style={styles.text}>
         cybercity  India
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    color: '#014421',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: '600',
    color: '#000',
  },
  text: {
    fontSize: 16,
    color: '#444',
    marginBottom: 10,
  },
  link: {
    fontSize: 16,
    color: '#014421',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
});

export default ContactUs;
