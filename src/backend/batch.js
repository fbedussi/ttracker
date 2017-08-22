const Batch = {
    ID: null,
    db: null,
    startTime: null,
    endTime: null,
    stop: function() {
        this.endTime = Date.now();
        this.db.updateBatch(this);
    },
    create: function(ID, db) {
        this.ID = ID;
        this.db = db;
        this.startTime = Date.now();
        this.db.createBatch(this);
        return this;
    },
    delete: function() {
        this.db.deleteBatch(this);
    }
}

const createBatch = (ID, db) => {
    return Object.create(Batch).create(ID, db);
}

export default createBatch;
