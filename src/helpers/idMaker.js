function* idMaker(collection, prefix = '') {
    const getNumericPart = (id) => Number(id.replace(/[^\d]/g, ''));
    const getMaxId = (collection) => collection.reduce((max, curr) => Math.max(max, getNumericPart(curr.id)), 0);

    
    var start = getMaxId(collection);

    while (true) {
        yield String(prefix + ++start);
    }
}

export default idMaker;
