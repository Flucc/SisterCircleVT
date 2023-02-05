import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import firebase from 'firebase'

const windowHeight = Dimensions.get('window').height;

const UserModal = ({ visible, onClose }) => {

  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        //console.error('No current user');
        return;
      }
  
      const userDoc = await firebase.firestore().collection('users').doc(currentUser.email).get();
      const usrEmail = userDoc.data().group;

      setEmail(currentUser.email);
    }
    const interval = setInterval(() => {
      fetchMembers();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.container}>
        <Image source={require('../assets/1.png')} style={{width: 150, height: 150, borderRadius: 200/2}}/>
        <Text style={{ ...styles.header, color: 'white', fontWeight: 'bold' , marginTop: 12}}>{email}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>          
          <Text style={{ ...styles.closeButtonText, color: 'white' }}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
    padding: 22,
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 4,
    marginTop: windowHeight - (windowHeight / 3),
  },
  header: {
    fontSize: 20,
    marginBottom: 12,
  },
  closeButton: {
    marginTop: 15,
  },
  closeButtonText: {
    fontSize: 17,
    color: 'purple',
  },
});

export default UserModal;



 