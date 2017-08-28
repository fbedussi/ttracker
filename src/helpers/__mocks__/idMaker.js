function* idMaker(collection) {
    var maxId = 0;

    while (true) {
        yield ++maxId;
    }
}

export default idMaker;
