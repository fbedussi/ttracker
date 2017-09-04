import merge from '../helpers/merge';
import initIdMaker from '../helpers/idMaker';
import db from '../db/dbFacade';

var timeEntryIdMaker = null;
initIdMaker('timeEntry').then((idMaker) => timeEntryIdMaker = idMaker);

const DBCOLLECTION = 'timeEntry';

const defaultProps = {
    id: 0,
    startTime: 0,
    endTime: 0,
};

const TimeEntry = {  
    create: function() {
        Object.assign(this, defaultProps);                
        this.id = timeEntryIdMaker.next().value;
        this.startTime = Date.now();
        db.create(DBCOLLECTION, this);
        return this;
    },
    stop: function() {
        this.endTime = Date.now();
        db.update(DBCOLLECTION, this);
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
        db.delete(DBCOLLECTION, this.id);
    },
    getTotalTime: function() {
        return this.endTime > 0 ? this.endTime - this.startTime : 0;
    }
}

const createTimeEntry = () => {
    return Object.create(TimeEntry).create();
}

const loadTimeEntry = (props) => {
    return Object.assign(Object.create(TimeEntry), defaultProps).load(props);
}

export {
    createTimeEntry,
    loadTimeEntry
} 
