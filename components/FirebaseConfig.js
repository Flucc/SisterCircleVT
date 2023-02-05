import firebase from 'firebase/app';
import firestore from "firebase/firestore";
//import { getMessaging, getToken } from "firebase/messaging";
//import idb from 'idb';


const firebaseConfig = {
    apiKey: 'AIzaSyC4hVgS4yIDbi5PbMl0Oi5onQP-Wtgge7E',
    authDomain: 'trackington-83f2c.firebaseapp.com',
    databaseURL: 'https://trackington-83f2c-default-rtdb.firebaseio.com/',
    projectId: 'trackington-83f2c',
    storageBucket: 'trackington-83f2c.appspot.com',
    // messagingSenderId: '12345-insert-yourse',
    // appId: 'insert yours: 1:1234:web:ee873bd1234c0deb7eba61ce',
};

const FirebaseConfig = () => {
    if (!firebase.apps.length) {
      const app = firebase.initializeApp(firebaseConfig);
      //const messaging = getMessaging(app);
      //getToken(messaging, {vapidKey:"BEsnM3NmbaiJrnowJttQPRGOJ5Gqdkb-mzBMoAb1n3FdnNlTBHVUeo_WhgTT3WfiC8cVHxTFhTYdLYXVArVDc6w"});
    }
    return null;
  };


export default FirebaseConfig;