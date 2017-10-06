import * as firebase from "firebase";

if (firebase.app.length === 0) {
}
        const config = {
            apiKey: "AIzaSyD0KEukmxkpPdkwrEzIbmzJoczmhdTQFT0",
            authDomain: "ttracker-18ad8.firebaseapp.com",
            databaseURL: "https://ttracker-18ad8.firebaseio.com",
            storageBucket: "ttracker-18ad8.appspot.com",
            projectId: "ttracker-18ad8",
            messagingSenderId: "636865515126"
        };
        firebase.initializeApp(config);

export default firebase;
  