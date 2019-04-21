import Rebase from "re-base";
import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAUk5ZEDLl3xC-q1PBheVRX2W3GxRkFN34",
    authDomain: "catch-of-the-day-nc-446cd.firebaseapp.com",
    databaseURL: "https://catch-of-the-day-nc-446cd.firebaseio.com",
});

const base = Rebase.createClass(firebaseApp.database());

// This is a named export 
export { firebaseApp };

// This is a default export 
export default base;