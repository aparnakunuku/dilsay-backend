// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbhiDreJ74GVDy167HPN815YkODc3HEGc1",
  authDomain: "dilsay-6141b.firebaseapp.com1",
  projectId: "dilsay-6141b1",
  storageBucket: "dilsay-6141b.appspot.com1",
  messagingSenderId: "1472182272461",
  appId: "1:147218227246:web:a8b0ce550d173ee5f1ffbf1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
module.exports.storage = getStorage(app);