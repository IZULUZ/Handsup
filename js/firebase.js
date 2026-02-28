const firebaseConfig = {
  apiKey: "AIzaSyDHG3uB-tqoE-4YLBHHvBRM4YhPh9qa-mI",
  authDomain: "handsup-262b8.firebaseapp.com",
  databaseURL: "https://handsup-262b8-default-rtdb.firebaseio.com",
  projectId: "handsup-262b8",
  storageBucket: "handsup-262b8.firebasestorage.app",
  messagingSenderId: "494093439378",
  appId: "1:494093439378:web:af0a9081d72f021031f14b"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const PRESENCE = db.ref("presence");
const GAME = db.ref("game");
const RESULTS = db.ref("results");
