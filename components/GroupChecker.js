import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import firebase from 'firebase';
import { getDistance } from 'geolib';

const GroupChecker =  () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        console.error('No current user');
        return;
      }

      const userDoc = await firebase.firestore().collection('users').doc(currentUser.email).get();
      const groupId = userDoc.data().group;
      if (!groupId) {
        //console.error('User is not in a group');
        return;
      }

      const groupMembers = await firebase.firestore().collection('groups').doc(groupId).get();
      setMembers(groupMembers.data().userIds);
    };

    const checkDistances = async () => {
      console.log('Checking distances...');
      const users = [];
      for (let i = 0; i < members.length; i++) {
        const user = await firebase.firestore().collection('users').doc(members[i]).get();
        users.push(user.data());
      }

      const positions = users.map((user) => ({
        latitude: user.latitude,
        longitude: user.longitude
      }));
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
            console.log(positions[i].latitude + '&'+ positions[j].longitude);
          const distance = getDistance(positions[i],positions[j]);
          console.log(`Calculated distance between users ${i} and ${j}: ${distance}`);
          if (distance > 50) {
            const message = `You are too far apart by (${distance} meters).`;
            Alert.alert(
              'Too Far Apart',
              message,
              [
                {
                  text: 'OK',
                  onPress: () => console.log('OK Pressed'),
                },
              ],
              { cancelable: false }
            );
          }
        }
      }
    };

    const interval = setInterval(() => {
      fetchMembers();
      checkDistances();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View>
    </View>
  );
};

export default GroupChecker;