import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import firebase from 'firebase';
import FirebaseConfig from './FirebaseConfig';

const windowHeight = Dimensions.get('window').height;

const GroupMembersModal = ({ groupId, visible, onClose, handleGroupChange }) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        // console.error('No current user');
        return;
      }

      const userDoc = await firebase.firestore().collection('users').doc(currentUser.email).get();
      const groupId = userDoc.data().group;
      if (!groupId) {
        // console.error('User is not in a group');
        return;
      }

      const groupMembers = await firebase.firestore().collection('groups').doc(groupId).get();
      setMembers(groupMembers.data().userIds);
    }
    const interval = setInterval(() => {
      fetchMembers();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const leaveGroup = async () => {
    try {
      const groupRef = firebase.firestore().collection('groups').doc(await firebase.firestore().collection('users').doc(firebase.auth().currentUser.email).get().then(doc => doc.data().group));
      await groupRef.update({
        userIds: firebase.firestore.FieldValue.arrayRemove(firebase.auth().currentUser.email)
      });
      firebase.firestore().collection('users').doc(firebase.auth().currentUser.email).update({ group: null });
      handleGroupChange(false);
    } catch (error) {
      // console.error(error);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.container}>
        <Text style={{ ...styles.header, color: 'white', fontWeight: 'bold'}}>Group Members</Text>
        {members.map(member => {
          return (
            <Text key={member} style={styles.member}>
              {member}
            </Text>
          );
        })}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={leaveGroup} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Leave Group</Text>
          </TouchableOpacity>
        </View>
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
    marginTop: windowHeight - (windowHeight / 1.5),
  },
  header: {
    fontSize: 20,
    marginBottom: 12,
  },
  member: {
    marginTop: 10,
    marginBottom: 12,
    color: 'white',
  },
  text: {
    marginBottom: 10,
    color: 'white',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 4,
    marginRight: 10,
  },
  closeButtonText: {
    color: 'white',
  },
});

export default GroupMembersModal;