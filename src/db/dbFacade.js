import db from './services/indexedDb';

//All methods return a promise
export default {
    openDb: db.openDb,
    deleteDb: db.deleteDb,

    create: db.create,
    read: db.read,
    readAll: db.read,
    update: db.update,
    delete: db.delete,
};