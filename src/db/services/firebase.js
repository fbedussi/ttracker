import firebase from './firebaseInit';

const db = firebase.database();
var user;

const openDb = (dbName, loggedUser) => new Promise((resolve, reject) => {
  user = loggedUser
  resolve(dbInterface);
});

const createInStore = (storeName, content) => db
    .ref(`users/${user.uid}/${storeName}/${content.id}`)
    .set(content)
;

const readInStore = (storeName, contentId) => db
  .ref(`users/${user.uid}/${storeName}/${contentId}`)
  .once('value')
  .then((snapshot) => snapshot.val())
;

const readAllInStore = (storeName) => db
  .ref(`users/${user.uid}/${storeName}`)
  .once('value')
  .then((snapshot) => [].concat(snapshot.val()).filter((i) => i)) //convert everything into an array
;

const updateInStore = (storeName, content) => db
  .ref(`users/${user.uid}/${storeName}/${content.id}`)
  .update(content)
;

const deleteInStore = (storeName, contentId) => db
  .ref(`users/${user.uid}/${storeName}/${contentId}`)
  .remove()
;
  
const replaceAllInStore = (storeName, data) => {
  const writeAllRecords = data.map((record) => createInStore(storeName, record));
  
  return Promise.all(writeAllRecords);
}


const dbInterface = {
  openDb,

  create: createInStore,
  read: readInStore,
  readAll: readAllInStore,
  update: updateInStore,
  delete: deleteInStore,
  replaceAll: replaceAllInStore,
};

export default dbInterface;
