import db from './services/indexedDb';

//All methods return a promise
export default {
    openDb: db.openDb(dbName),
    deleteDb: db.deleteDb(dbName),

    create: db.create(collection, batch),
    read: db.read(collection, id),
    readAll: db.read(collection),
    update: db.update(collection, batch),
    delete: db.delete(collection, id),
};