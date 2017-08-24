import merge from '../helpers/merge';
import idMaker from '../helpers/idMaker';
import db from '../db/dbFacade';

const timeEntryIdMaker = idMaker('timeEntry');

const TimeEntry = {
    id: 0,
    startTime: 0,
    endTime: 0,
    stop: function() {
        this.endTime = Date.now();
        db.update('timeEntry', this);
    },
    create: function() {
        this.id = timeEntryIdMaker.next().value;
        this.startTime = Date.now();
        db.create('timeEntry', this);
        return this;
    },
    update: function(newData) {
        merge(this, newData);
        db.update('timeEntry', this);
    },
    delete: function() {
        db.delete('timeEntry', this);
    },
    getTotalTime: function() {
        return this.endTime - this.startTime
    }
}

const createTimeEntry = (id, db) => {
    return Object.create(TimeEntry).create(id, db);
}

export default createTimeEntry;
