//import db from './services/indexedDb';
import db from './services/firebase';

//All methods return a promise
export default {
    openDb: db.openDb,

    create: db.create,
    read: db.read,
    readAll: db.read,
    update: db.update,
    delete: db.delete,
};