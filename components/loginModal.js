import React, { useState } from 'react';
import { KeyboardAvoidingView, View, Modal, Text, TouchableHighlight } from 'react-native';
import { auth } from "./backend/index.js"
import App from '../App.js';
function loginModal(lat, long, latDel, longDel) {

    const [modal, setModal] = useState(false);
    const [phoneNum, setPhoneNum] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    const signInWithEmail = async () => {
        firebase.auth().signInWithEmail(email, password)
        .then(user => {
            console.log(user);
        })
  };

    return (
        <View style={styles.centeredView}>

        <Modal
            animationType="slide"
            transparent={true}
            visible={modal}
            onRequestClose={() => {
            setModal(!modal);
            }}>
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalText}>Hello World!</Text>
                <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Hide Modal</Text>
                </Pressable>
            </View>
            </View>
        </Modal>
        <Pressable
            style={[styles.button, styles.buttonOpen]}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.textStyle}>Show Modal</Text>
        </Pressable>
        </View>
    );
    };
    const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});
    
export default App;
