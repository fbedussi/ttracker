import merge from '../helpers/merge';

const TimeEntry = {
    id: null,
    db: null,
    startTime: null,
    endTime: null,
    stop: function() {
        this.endTime = Date.now();
        this.db.update('timeEntry', this);
    },
    create: function(id, db) {
        this.id = id;
        this.db = db;
        this.startTime = Date.now();
        this.db.create('timeEntry', this);
        return this;
    },
    update: function(newData) {
        merge(this, newData);
        this.db.update('timeEntry', this);
    },
    delete: function() {
        this.db.delete('timeEntry', this);
    },
    getTotalTime: function() {
        return this.endTime - this.startTime
    }
}

const createTimeEntry = (id, db) => {
    return Object.create(TimeEntry).create(id, db);
}

export default createTimeEntry;
