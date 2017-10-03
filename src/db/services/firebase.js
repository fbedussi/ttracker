import * as firebase from "firebase";

var db;
var config = {
  apiKey: "AIzaSyD0KEukmxkpPdkwrEzIbmzJoczmhdTQFT0",
  authDomain: "ttracker-18ad8.firebaseapp.com",
  databaseURL: "https://ttracker-18ad8.firebaseio.com",
  storageBucket: "ttracker-18ad8.appspot.com",
  projectId: "ttracker-18ad8",
  messagingSenderId: "636865515126"
};

firebase.initializeApp(config);

  var db = firebase.database();

const openDb = (dbName) => new Promise((resolve, reject) => {


  resolve(dbInterface);
});

const deleteDb = (dbName) => new Promise((resolve, reject) => {
  // const request = indexedDB.deleteDatabase(dbName);

  // request.onerror = (event) => reject(`Error deleting DB ${dbName}: ${request.error}`);

  // request.onsuccess = (event) => resolve(event.result === undefined); //event should be undefined
});

const createInStore = (storeName, content) => new Promise((resolve, reject) => {  
    db.ref(storeName + '/' + content.id).set(content);

    resolve(content.id);
});

const readInStore = (storeName, contentId) => new Promise((resolve, reject) => {
  db
    .ref(`/${storeName}/${contentId}`)
    .once('value')
    .then((snapshot) => {
      console.log(snapshot.val());
      resolve(snapshot.val() || [])
    })
    .catch((error) => reject(error))
  ;
});

const readAllInStore = (storeName) => new Promise((resolve, reject) => {
  db
  .ref(`/${storeName}`)
  .once('value')
  .then((snapshot) => {
    console.log(snapshot.val());
    var val = snapshot.val();
    var result = val ? [].concat(val) : []; 
    resolve(result);
  })
  .catch((error) => reject(error))
;
});

const updateInStore = (storeName, content) => new Promise((resolve, reject) => {
  db.ref(`/${storeName}/${content.id}`).update(content);
  
  resolve(content);
});

const deleteInStore = (storeName, contentId) => new Promise((resolve, reject) => {
  db.ref(`/${storeName}/${contentId}`).remove();
  
  resolve(contentId);
});

const dbInterface = {
  openDb,
  deleteDb,

  create: createInStore,
  read: readInStore,
  readAll: readAllInStore,
  update: updateInStore,
  delete: deleteInStore,
};

export default dbInterface;
