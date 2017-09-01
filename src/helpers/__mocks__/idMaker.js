function* idMaker(maxId) {
    while (true) {
        yield ++maxId;
    }
}

function initIdMaker() {
    return Promise
        .resolve()
        .then(() => idMaker(0))
    ;
}

export default initIdMaker;
