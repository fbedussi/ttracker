import idMaker from '../helpers/idMaker';
import merge from '../helpers/merge';
import db from '../db/dbFacade';
import {convertMsToH} from '../helpers/helpers';

const activityIdMaker = idMaker('activity');

const DBCOLLECTION = 'activity';

var Activity = {
    id: 0,
    name: 'new activity',
    startTime: 0,
    hourlyRate: 0,
    subactivities: [],
    timeEntries: [],
    create: function(conf) {
        this.id = activityIdMaker.next().value;
        this.startTime = Date.now();
        merge(this, conf);

        db.create(DBCOLLECTION, this);
        return this;
    },
    update: function(newProps) {
        merge(this, newProps);
        db.update(DBCOLLECTION, this);
    },
    delete: function() {
        db.delete(DBCOLLECTION, this);
    },
    getTotalTime: function() {
        var subactivitiesTotalTime = this.subactivities.reduce((totalTime, subactivity) => totalTime + subactivity.getTotalTime(), 0);
        var timeEntriesTotalTime = this.timeEntries.reduce((totalTime, timeEntry) => totalTime + timeEntry.getTotalTime(), 0);
        
        return subactivitiesTotalTime + timeEntriesTotalTime;
    },
    getTotalCost: function() {
        return convertMsToH(this.getTotalTime()) * this.hourlyRate;
    },
    addSubactivity: function(subactivity) {
        this.subactivities.push(subactivity);
        db.update(DBCOLLECTION, this);
        return true;
    },
    removeSubactivity: function(id) {
        this.subactivities = this.subactivities.filter(subactivity => subactivity.id !== id);
        db.update(DBCOLLECTION, this);
    },
    addTimeEntry: function(timeEntry) {
        this.timeEntries.push(timeEntry);
        db.update(DBCOLLECTION, this);
        return true;
    },
    removeTimeEntry: function(id) {
        this.timeEntries = this.timeEntries.filter(timeEntry => timeEntry.id !== id);
        db.update(DBCOLLECTION, this);
    }
}

const createActivity = (conf) => {
    return Object.create(Activity).create(conf);
}

export default createActivity;