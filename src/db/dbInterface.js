import {config} from '../../package.json';
import indexedDb from './services/indexedDb';
import firebase from './services/firebase';
import {watchForError} from '../backend/errorReporter';
var db;

switch (config.db.toLowerCase()) {
    case 'indexeddb':
        db = indexedDb;
        break;

    case 'firebase':
        db = firebase;
        break;

    default:
        throw new Error('There is no service for db: ' + config.db);
        break;
}


//All methods return a promise
export default {
    openDb: watchForError(db.openDb),

    create: watchForError(db.create),
    read: watchForError(db.read),
    readAll: watchForError(db.read),
    update: watchForError(db.update),
    delete: watchForError(db.delete),
    replaceAll: watchForError(db.replaceAll)
};