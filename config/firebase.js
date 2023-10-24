// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
// import firebase from "firebase";
// import "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDbtcglNxUkhXCOxY4ufst6nzhNxKAjJ_g",
//   authDomain: "iedashboard-2680b.firebaseapp.com",
//   databaseURL: "https://iedashboard-2680b-default-rtdb.firebaseio.com",
//   projectId: "iedashboard-2680b",
//   storageBucket: "iedashboard-2680b.appspot.com",
//   messagingSenderId: "1000270520804",
//   appId: "1:1000270520804:web:0fa539f158a5927732e7f1",
//   measurementId: "G-BXYC77K68J"
// };
const firebaseConfig = {
  apiKey: "AIzaSyD8-K3nG4VHaIha8NzPfmqoA-8BjOv9RB0",
  authDomain: "hklogs-231a7.firebaseapp.com",
  projectId: "hklogs-231a7",
  storageBucket: "hklogs-231a7.appspot.com",
  messagingSenderId: "1092724081194",
  appId: "1:1092724081194:web:0f95323bd88ae19885b953",
  measurementId: "G-LNM7M1DC9Z"
};

// // Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);
const auth = getAuth(app);

export default app;


// if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
//   } else {
//     firebase.app(); // if already initialized, use that one
//   }
  
//   const storage = firebase.storage();
//   export { storage, firebase as default };
  
