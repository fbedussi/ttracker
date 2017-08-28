import idMaker from '../helpers/idMaker';
import merge from '../helpers/merge';
import db from '../db/dbFacade';
import {convertMsToH} from '../helpers/helpers';
import {createTimeEntry, loadTimeEntry} from './timeEntry';

const activityIdMaker = idMaker('activity');


const DBCOLLECTION = 'activity';

var Activity = {
    id: 0,
    name: 'new activity',
    startTime: 0,
    hourlyRate: 0,
    subactivities: [],
    timeEntries: [],
    create: function(props) {
        this.id = activityIdMaker.next().value;
        this.startTime = Date.now();
        merge(this, props);

        db.create(DBCOLLECTION, this);
        return this;
    },
    load: function(props) {
        merge(this, props);
        this.subactivities = this.subactivities.map(activityProps => loadActivity(activityProps));
        this.timeEntries = this.timeEntries.map(timeEntryProps => loadTimeEntry(timeEntryProps));        
        return this;
    },
    update: function(newProps) {
        merge(this, newProps);
        db.update(DBCOLLECTION, this);
    },
    delete: function() {
        db.delete(DBCOLLECTION, this);
    },
    getTotalTime: function(sinceTime = 0) {
        var subactivitiesTotalTime = this.subactivities.reduce((totalTime, subactivity) => totalTime + subactivity.getTotalTime(sinceTime), 0);
        var timeEntriesTotalTime = this.timeEntries
            .filter(timeEntry => timeEntry.endTime > sinceTime)
            .reduce((totalTime, timeEntry) => totalTime + timeEntry.getTotalTime(), 0)
        ;
        
        return subactivitiesTotalTime + timeEntriesTotalTime;
    },
    getTotalCost: function(sinceTime) {
        return convertMsToH(this.getTotalTime(sinceTime)) * this.hourlyRate;
    },
    addSubactivity: function(props) {
        var newActivity = createActivity(props);
        if (!newActivity.hourlyRate) {
            newActivity.hourlyRate = this.hourlyRate;
        }

        this.subactivities.push(newActivity);
        db.update(DBCOLLECTION, this);
        return newActivity;
    },
    removeSubactivity: function(id) {
        this.subactivities = this.subactivities.filter(subactivity => subactivity.id !== id);
        db.update(DBCOLLECTION, this);
    },
    addTimeEntry: function() {
        var newTimeEntry = createTimeEntry();
        
        this.timeEntries.push(newTimeEntry);
        db.update(DBCOLLECTION, this);
        return newTimeEntry;
    },
    removeTimeEntry: function(id) {
        this.timeEntries = this.timeEntries.filter(timeEntry => timeEntry.id !== id);
        db.update(DBCOLLECTION, this);
    }
}

const createActivity = (conf) => {
    return Object.create(Activity).create(conf);
}

const loadActivity = (conf) => {
    return Object.create(Activity).load(conf);
}

export {
    createActivity,
    loadActivity
};