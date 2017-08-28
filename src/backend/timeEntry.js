import merge from '../helpers/merge';
import idMaker from '../helpers/idMaker';
import db from '../db/dbFacade';

const timeEntryIdMaker = idMaker('timeEntry');

const DBCOLLECTION = 'activity';

const TimeEntry = {
    id: 0,
    startTime: 0,
    endTime: 0,
    stop: function() {
        this.endTime = Date.now();
        db.update(DBCOLLECTION, this);
    },
    create: function() {
        this.id = timeEntryIdMaker.next().value;
        this.startTime = Date.now();
        db.create(DBCOLLECTION, this);
        return this;
    },
    load: function(props) {
        merge(this, props);        
        return this;
    },
    update: function(newData) {
        merge(this, newData);
        db.update(DBCOLLECTION, this);
    },
    delete: function() {
        db.delete(DBCOLLECTION, this);
    },
    getTotalTime: function() {
        return this.endTime - this.startTime
    }
}

const createTimeEntry = () => {
    return Object.create(TimeEntry).create();
}

const loadTimeEntry = (props) => {
    return Object.create(TimeEntry).load(props);
}

export {
    createTimeEntry,
    loadTimeEntry
} 
