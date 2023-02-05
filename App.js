import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView} from 'react-native';
import MapView, { Animated, Marker } from 'react-native-maps';
import { Button } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import * as Location from 'expo-location';
import GroupModal from './components/GroupModal';
import GroupMembersModal from './components/GroupMembersModal';
import LoginModal from './components/SMSAuth';
import SettingsModal from './components/SettingsModal';
import FirebaseConfig from './components/FirebaseConfig';
import firebase from 'firebase';
import 'firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';
import { TailwindProvider } from "tailwind-rn"
import utilities from "./tailwind.json"
//import AsyncStorage from '@react-native-async-storage/async-storage';
import UserModal from './components/UserModal'
import { Modal, TouchableHighlight } from 'react-native';
//import { getMessaging, getToken } from "firebase/messaging";
import GroupChecker from './components/GroupChecker';

const App = () => {
  const [location, setLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [markers, setMarkers] = useState([
    {
      latitude: 37.78825,
      longitude: -122.4324,
    },
    {
      latitude: 37.8015,
      longitude: -122.4180,
    },
  ]);
  FirebaseConfig();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showGroupMemModal, setShowGroupMemModal] = useState(false);
  const [inGroup, setInGroup] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [members, setMembers] = useState([]);



  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setPermissionGranted(true);
      }
    })();
  }, []);


  useEffect(() => {
    (async () => {
      const { status } = await Notification.requestPermission();
      if (status === 'granted') {
        setPermissionGranted(true);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      const user = firebase.auth().currentUser;
      if (!user) {
        // console.error('User is not authenticated');
        return;
      }

      await firebase.firestore().collection('users').doc(user.email)
        .update({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude
        });
    })();
  });

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
      console.log('Checking distances: asdfasdf');
      console.log(members);
      const users = [];
      for (let i = 0; i < members.length; i++) {
        const user = await firebase.firestore().collection('users').doc(members[i]).get();
        users.push(user.data());
      }
    console.log(users);
    const positions = users.map((user) => ({
        latitude: user.latitude,
        longitude: user.longitude
      }));
      setMarkers(positions);
    };

    const interval = setInterval(() => {
      fetchMembers();
      checkDistances();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const watchId = Location.watchPositionAsync({ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }, (newLocation) => {
      setLocation({
        latitude: newLocation.coords.latitude,
        longitude: newLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      const user = firebase.auth().currentUser;
      if (!user) {
        // console.error('User is not authenticated');
        return;
      }
      firebase.firestore().collection('users').doc(user.email)
        .update({
          latitude: newLocation.coords.latitude,
          longitude: newLocation.coords.longitude
        });
    });
  }, []);

  const handleGroupChange = (memBool) => {
      setShowGroupMemModal(memBool);
      setInGroup(memBool);
      setShowGroupModal(!memBool)
  };

  const checkGroupChange = () => {
    if (inGroup) {
      setShowGroupMemModal(true);
    }
    else {
      setShowGroupModal(true)
    }
  }

    const handleSignedOut = () => {
      setShowSettingsModal(false);
      setSignedIn(false);
  };

  // const checkSignedIn = () => {
  //   if (inGroup) {
  //     setShowGroupMemModal(true);
  //   }
  //   else {
  //     setShowGroupModal(true)
  //   }
  // }
  const GroupCheckerWrapper = () => {
    useEffect(() => {
      const interval = setInterval(() => {
        console.log('bruh');
      }, 10000);
      return () => clearInterval(interval);
    }, []);
  
    return <GroupChecker />;
  };
  
  return (
    <View style={styles.container}>
      <FirebaseConfig />
      <LoginModal
        visible={!signedIn}
        lat={location.latitude}
        long={location.longitude}
        latDel={location.latitudeDelta}
        longDel={location.longitudeDelta}
        handleSignedIn={() => setSignedIn(true)}
      />
      <MapView
        style={{ flex: 1 }}
        initialRegion={location}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
          />
        ))}
      </MapView>
      <View style={styles.barContainer}>
        <Button
          icon={<Icon name="cog" color="#ffffff" type="font-awesome" />}
          title="Settings"
          buttonStyle={styles.barButton}
          titleStyle={styles.barText}
          onPress={() => setShowSettingsModal(true)}
        />
        <Button
          icon={<Icon name="group" color="#ffffff" />}
          title="Group"
          buttonStyle={styles.barButton}
          titleStyle={styles.barText}
          onPress={checkGroupChange}
        />
        <Button
          icon={<Icon name="person" color="#ffffff" />}
          title="User"
          buttonStyle={styles.barButton}
          titleStyle={styles.barText}
          onPress={() => setShowUserModal(true)}
        />
      </View>
      {<GroupChecker/>}
      <SettingsModal
        visible={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        handleSignedOut={handleSignedOut}
      />
      <GroupModal
        visible={showGroupModal}
        onClose={() => setShowGroupModal(false)}
        handleGroupChange={handleGroupChange}
      />
      <GroupMembersModal
        visible={showGroupMemModal}
        onClose={() => setShowGroupMemModal(false)}
        handleGroupChange={handleGroupChange}
      />
      <UserModal visible={showUserModal} onClose={() => setShowUserModal(false)} />
    </View>
  );
  };

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
    flex: 1,
  },
  map: {
    flex: 1,
  },
  barContainer: {
    paddingBottom: 20,
    paddingHorizontal: 30,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#333',
  },
  barButton: {
    backgroundColor: '#333',
    padding: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  barText: {
    color: '#ffffff',
    fontSize: 10,
    marginHorizontal: 20,
  },
});


export default App;
