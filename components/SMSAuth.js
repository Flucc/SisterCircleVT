import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import firebase from 'firebase';
import FirebaseConfig from './FirebaseConfig';


const LoginModal = ({ visible, closeModal, lat, long, latDel, longDel, handleSignedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [formType, setFormType] = useState('login');
    const [modalVisible, setModalVisible] = useState(true);

    const handleSignIn = async () => {
      try {
        const response = await firebase.auth().signInWithEmailAndPassword(email, password);
        setErrorMessage(null);
        // setModalVisible(false);
        handleSignedIn();
      } catch (error) {
        //console.error(error);
        setErrorMessage(error.message);
      }
      //firebase.firestore().collection('users').doc(firebase.auth().currentUser.email).set({latitude: lat, longitude: long});
    };

    const handleSignUp = async () => {
      try {
        const response = await firebase.auth().createUserWithEmailAndPassword(email, password);
        setErrorMessage(null);
        // setModalVisible(false);
        handleSignedIn();
      } catch (error) {
        //console.error(error);
        setErrorMessage(error.message);
      }
    };
  
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
      >
          <FirebaseConfig />
          <View style={styles.container}>
            <Text style={{ ...styles.header, color: 'white' }}>
              {formType === 'login' ? 'Login' : 'Sign Up'}
            </Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="white"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              color="white"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="white"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              color="white"
            />
            <Button
              title={formType === 'login' ? 'Sign In' : 'Sign Up'}
              buttonStyle={styles.signInButton}
              onPress={formType === 'login' ? handleSignIn : handleSignUp}
            />
            {errorMessage && (
              <Text style={{...styles.errorMessage, color: 'white', padding: 20, fontWeight: "bold", textAlign: "center"}}>{errorMessage}</Text>
            )}
            <TouchableOpacity
              style={styles.formTypeButton}
              onPress={() => setFormType(formType === 'login' ? 'signup' : 'login')}
            >
              <Text style={{...styles.formTypeButtonText, color: 'white', padding: 10, textDecorationLine: "underline"}}>
                {formType === 'login' ? 'Don\'t have an account? Sign up' : 'Already have an account? Login'}
              </Text>
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
    marginTop: '60%',
    color: 'white',
    textAlign: 'center',
  },
  header: {
    fontSize: 20,
    marginBottom: 12,
  },
  input: {
    height: 40,
    borderColor: '#6A4C93',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  signInButton: {
    backgroundColor: '#6A4C93',
    marginTop: 10,
    padding: 10,
    width: '100%',
  },
});

export default LoginModal;