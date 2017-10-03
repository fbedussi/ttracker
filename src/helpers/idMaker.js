import dbService from '../db/dbFacade';

function* idMaker(maxId) {
    while (true) {
        yield ++maxId;
    }
}

function initIdMaker(collection) {
    return dbService
        .openDb('ttracker')
        .then((db) => db.readAll(collection))
        .then((collection) => {
            var maxId = collection.reduce((max, curr) => Math.max(max, curr.id), -1);
            return idMaker(maxId);
        })
        .catch(() => idMaker(-1))
    ;
}

export default initIdMaker;
