// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbhiDreJ74GVDy167HPN815YkODc3HEGc",
  authDomain: "dilsay-6141b.firebaseapp.com",
  projectId: "dilsay-6141b",
  storageBucket: "dilsay-6141b.appspot.com",
  messagingSenderId: "147218227246",
  appId: "1:147218227246:web:a8b0ce550d173ee5f1ffbf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
module.exports.storage = getStorage(app);