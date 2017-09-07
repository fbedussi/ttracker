import initIdMaker from '../helpers/idMaker';
import merge from '../helpers/merge';
import db from '../db/dbFacade';
import {convertMsToH} from '../helpers/helpers';
import {createTimeEntry, loadTimeEntry} from './timeEntry';

var activityIdMaker = null;
initIdMaker('activity').then((idMaker) => activityIdMaker = idMaker);

const DBCOLLECTION = 'activity';

const defaultProps = {
    id: 0,
    name: 'new activity',
    startTime: 0,
    hourlyRate: 0,
    totalCost: 0,
    subactivities: [],
    timeEntries: []
};

var Activity = {
    create: function(props) {
        Object.assign(this, defaultProps);        
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
        return this;
    },
    delete: function() {
        this.subactivities.forEach((subactivity) => subactivity.delete());
        this.timeEntries.forEach((timeEntry) => timeEntry.delete());
        db.delete(DBCOLLECTION, this.id);
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
    start: function() {
        var newTimeEntry = createTimeEntry();
        
        this.timeEntries.push(newTimeEntry);
        db.update(DBCOLLECTION, this);
        return newTimeEntry;
    },
    stop: function() {
        this.timeEntries[this.timeEntries.length - 1].stop();
        this.totalCost = this.getTotalCost();
        return this;
    },
    removeTimeEntry: function(id) {
        this.timeEntries = this.timeEntries
            .map((timeEntry) => timeEntry.id === id ? timeEntry.delete() : timeEntry)  //timeEntry.delete() returns undefined
            .filter(timeEntry => timeEntry); //removes undefined
        db.update(DBCOLLECTION, this);
    }
}

const createActivity = (props) => {
    return Object.create(Activity).create(props);
}

const loadActivity = (props) => {
    return Object.assign(Object.create(Activity), defaultProps).load(props);
}

export {
    createActivity,
    loadActivity
};