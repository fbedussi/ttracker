import firebase from './firebaseInit';

const db = firebase.database();
var user;

const openDb = (dbName, loggedUser) => new Promise((resolve, reject) => {
  user = loggedUser
  resolve(dbInterface);
});

const createInStore = (storeName, content) => new Promise((resolve, reject) => {  
    db.ref(`users/${user.uid}/${storeName}/${content.id}`).set(content);

    resolve(content.id);
});

const readInStore = (storeName, contentId) => new Promise((resolve, reject) => {
  db
    .ref(`users/${user.uid}/${storeName}/${contentId}`)
    .once('value')
    .then((snapshot) => snapshot.val())
    .catch((error) => reject(error))
  ;
});

const readAllInStore = (storeName) => new Promise((resolve, reject) => {
  db
    .ref(`users/${user.uid}/${storeName}`)
    .once('value')
    .then((snapshot) => resolve(
      [].concat(snapshot.val()).filter((i) => i)) //convert everything into an array
    )
    .catch((error) => reject(error))
  ;
});

const updateInStore = (storeName, content) => new Promise((resolve, reject) => {
  db.ref(`users/${user.uid}/${storeName}/${content.id}`).update(content);
  
  resolve(content);
});

const deleteInStore = (storeName, contentId) => new Promise((resolve, reject) => {
  db.ref(`users/${user.uid}/${storeName}/${contentId}`).remove();
  
  resolve(contentId);
});

const dbInterface = {
  openDb,

  create: createInStore,
  read: readInStore,
  readAll: readAllInStore,
  update: updateInStore,
  delete: deleteInStore,
};

export default dbInterface;
