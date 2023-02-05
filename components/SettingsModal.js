import React, { useState } from 'react';
import { 
  Modal, 
  StyleSheet, 
  View, 
  SafeAreaView, 
  Text, 
  TouchableHighlight, 
  TextInput, 
  Image, 
  Button,
  Dimensions,
  TouchableOpacity, 
} from 'react-native';
import FirebaseConfig from './FirebaseConfig';
import firebase from 'firebase';
import LoginModal from './SMSAuth';

const windowHeight = Dimensions.get('window').height;

const SettingsModal = ({ visible, onClose, handleSignedOut }) => {

  const handleLogout = () => {               
    firebase.auth().signOut().then(function() {
    }, function(error) {
      //console.error('Sign Out Error', error);
    });
    handleSignedOut();
  }

  return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
        >
        <FirebaseConfig/>
        <View style={styles.container}>
          <Text style={{ ...styles.header, color: 'white' , fontWeight: 'bold'}}>Settings</Text>
          <Button
            title="Sign Out"
            color='#ffffff'
            buttonStyle={styles.signOutButton}
            onPress={handleLogout}
          />
          <Button
            title="Change Password"
            color='#ffffff'
            buttonStyle={styles.passwordButton}
            //onPress={changePassword}
          />
          <Button
            title="Change Email"
            color='#ffffff'
            buttonStyle={styles.emailButton}
            //onPress={changeEmail}
          />
          <Button
            title="Change Profile Picture"
            color='#ffffff'
            buttonStyle={styles.pictureButton}
            //onPress={changePicture}
          />
          <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
        >
          <Text style={{...styles.closeButtonText, color: "white"}}>Close</Text>
        </TouchableOpacity>
          </View>
          </Modal>
    );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginTop: windowHeight - (windowHeight / 3.3),
    },
    header: {
    fontSize: 20,
    marginBottom: 12,
    },
    signOutButton: {
    backgroundColor: 'white',
    width: '80%',
    marginBottom: 10,
    alignSelf: 'center'
    },
    userButton: {
    backgroundColor: '#6A4C93',
    width: '80%',
    marginBottom: 10,
    alignSelf: 'center'
    },
    pictureButton: {
    backgroundColor: '#6A4C93',
    width: '80%',
    marginBottom: 10,
    alignSelf: 'center'
    },
    passwordButton: {
    backgroundColor: '#6A4C93',
    width: '80%',
    marginBottom: 10,
    alignSelf: 'center'
    },
    emailButton: {
    backgroundColor: '#6A4C93',
    width: '80%',
    marginBottom: 10,
    alignSelf: 'center'
    },
    errorMessage: {
    color: 'red',
    marginTop: 10,
    },
    groupId: {
    marginTop: 10,
    },
    closeButton: {
    marginTop: 10,
    },
    closeButtonText: {
    color: '#6A4C93',
    },
    });

export default SettingsModal;
