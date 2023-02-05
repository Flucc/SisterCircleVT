import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput, Clipboard } from 'react-native';
import { Button } from 'react-native-elements';
import firebase from 'firebase';
import 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import FirebaseConfig from './FirebaseConfig';
import GroupMembersModal from './GroupMembersModal.js';

const GroupModal = ({ visible, onClose, handleGroupChange }) => {
  const [groupName, setGroupName] = useState('');
  const [joinGroupId, setJoinGroupId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [showGroupMemModal, setShowGroupMemModal] = useState(false);

  const generateGroup = async () => {
    try {
      const newGroupId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const groupsRef = firebase.firestore().collection('groups').doc(newGroupId).set({userIds: [firebase.auth().currentUser.email]});
      firebase.firestore().collection("users").doc(firebase.auth().currentUser.email).update({
        group: joinGroupId
      });
      setGroupId(newGroupId);
      Clipboard.setString(groupId);
      setShowGroupMemModal(true);
      handleGroupChange(true);
    } catch (error) {
      // console.error(error);
      setErrorMessage(error.message);
    }
  };

  const joinGroup = async () => {
    try {
      const groupRef = firebase.firestore().collection(`groups/`).doc(`${joinGroupId}`);
      if (!groupRef.get()) {
        setErrorMessage(`Group "${joinGroupId}" does not exist`);
      }
      else{
        await groupRef.update({
            userIds: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.email)
          });
          firebase.firestore().collection("users").doc(firebase.auth().currentUser.email).update({
            group: joinGroupId
          });

      }
      setGroupId(joinGroupId);
      setShowGroupMemModal(true);
      handleGroupChange(true);
      onClose();
    } catch (error) {
      // console.error(error);
      setErrorMessage(error.message);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
    >
      <View style={styles.container}>
        <Text style={{ ...styles.header, color: 'white' }}>Join or Create a Group</Text>
        <TextInput
          style={{...styles.input, textAlign: 'center'}}
          placeholder="Enter group name to create"
          placeholderTextColor="white"
          value={groupName}
          onChangeText={setGroupName}
          color="white"
        />
        <Button
          title="Create Group"
          buttonStyle={styles.createButton}
          onPress={generateGroup}
        />
        <TextInput
          style={{...styles.input, textAlign: 'center'}}
          placeholder="Enter group ID to join"
          placeholderTextColor="white"
          value={joinGroupId}
          onChangeText={setJoinGroupId}
          color="white"
        />
        <Button
          title="Join Group"
          buttonStyle={styles.joinButton}
          onPress={joinGroup}
        />
        {errorMessage && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}
        {groupId && (
          <Text style={styles.groupId}>
            Group ID: {groupId}
          </Text>
        )}
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
  marginTop: '50%',
  },
  header: {
  fontSize: 20,
  marginBottom: 12,
  },
  input: {
  height: 40,
  paddingHorizontal: 10,
  marginBottom: 10,
  borderColor: 'gray',
  borderWidth: 1,
  width: '80%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  },
  createButton: {
  backgroundColor: '#6A4C93',
  width: '80%',
  marginBottom: 10,
  alignSelf: 'center'
  },
  joinButton: {
  backgroundColor: '#6A4C93',
  width: '80%',
  alignSelf: 'center'
  },
  errorMessage: {
  color: 'red',
  marginTop: 10,
  },
  groupId: {
  marginTop: 10,
  color: 'white',
  },
  closeButton: {
  marginTop: 10,
  },
  closeButtonText: {
  color: 'blue',
  },
});

export default GroupModal;