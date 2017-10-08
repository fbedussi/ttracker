import dbService from '../db/dbFacade';

function* idMaker(maxId) {
    while (true) {
        yield maxId++;
    }
}

function initIdMaker(collection, user) {
    return dbService
        .openDb('ttracker', user)
        .then((db) => db.readAll(collection))
        .then((collection) => {
            var maxId = collection.reduce((max, curr) => Math.max(max, curr.id), 0);
            return idMaker(maxId + 1);
        })
        .catch(() => idMaker(0))
    ;
}

export default initIdMaker;
