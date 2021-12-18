import firebase from 'firebase/app';
import 'firebase/database' ;
import 'firebase/auth';

let firebaseConfig = {
    apiKey: "AIzaSyCRT3syUcJ0oRC4TibKFBYn0q__e9W1LLo",
    authDomain: "meuapp-9d5e6.firebaseapp.com",
    databaseURL: "https://meuapp-9d5e6-default-rtdb.firebaseio.com",
    projectId: "meuapp-9d5e6",
    storageBucket: "meuapp-9d5e6.appspot.com",
    messagingSenderId: "825616241295",
    appId: "1:825616241295:web:cdf272de2274022bd496fa",
    measurementId: "G-ZYXELLPFE7"
  };

  // Initialize Firebase
  if(!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
  }
  export default firebase;