import db from '../db/dbFacade';

function* idMaker(collection) {
    const data = db.readAll(collection);
    var maxId = data.reduce((max, curr) => Math.max(max, getNumericPart(curr.id)), 0);

    while (true) {
        yield ++maxId;
    }
}

export default idMaker;
