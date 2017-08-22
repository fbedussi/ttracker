import db from './services/indexedDb';

//All methods return a promise
export default {
    openDb: db.openDb(dbName),
    deleteDb: db.deleteDb(dbName),

    createBatch: db.createBatch(batch),
    readBatch: db.readBatch(id),
    updateBatch: db.updateBatch(batch),
    deleteBatch: db.deleteBatch(id),

    createActivity: db.createActivity(activity),
    readActivity: db.readActivity(id),
    updateActivity: db.updateActivity(activity),
    deleteActivity: db.deleteActivity(id),

    createClient: db.createClient(client),
    readClient: db.readClient(id),
    updateClient: db.updateClient(client),
    deleteClient: db.deleteClient(id)
};