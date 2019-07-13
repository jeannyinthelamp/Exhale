import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var config = {
    apiKey: "AIzaSyBzJZXdXnsaLT7bwvLU7OzPH_84MSTCg9w",
    authDomain: "exhale-8a62e.firebaseapp.com",
    databaseURL: "https://exhale-8a62e.firebaseio.com",
    projectId: "exhale-8a62e",
    storageBucket: "exhale-8a62e.appspot.com",
    messagingSenderId: "139474363506",
    appId: "1:139474363506:web:f543dd44dc8a9f50"
  };


  // Initialize Firebase
  firebase.initializeApp(config);

export default firebase;
