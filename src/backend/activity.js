import initIdMaker from '../helpers/idMaker';
import merge from '../helpers/merge';
import db from '../db/dbFacade';
import {convertMsToH} from '../helpers/helpers';

var activityIdMaker = null;
initIdMaker('activity').then((idMaker) => activityIdMaker = idMaker);

const DBCOLLECTION = 'activity';
const CLIENT_DBCOLLECTION = 'client';

const defaultProps = {
    id: 0,
    name: 'new activity',
    client: {},
    hourlyRate: 0,
    subactivities: [],
    timeEntries: []
};

var Activity = {
    create: function(props) {
        Object.assign(this, defaultProps);        
        this.id = activityIdMaker.next().value;
        merge(this, props);
        if (props && props.client) {
            this.client = props.client;
        }
        
        db.create(DBCOLLECTION, this);
        
        return this;
    },
    load: function(props) {
        merge(this, props);
        this.subactivities = this.subactivities.map(activityProps => loadActivity(activityProps));
        
        return this;
    },
    update: function(newProps) {
        merge(this, newProps);
        
        db.update(DBCOLLECTION, this);
        
        return this;
    },
    delete: function(deleteSubactivities) {
        if (deleteSubactivities) {
            this.subactivities.forEach((subactivity) => subactivity.delete(true));
        }

        if (this.client.id) {
            const updatedClient = this.client.removeActivity(this.id);
            db.update(CLIENT_DBCOLLECTION, this.client);
        }

        db.delete(DBCOLLECTION, this.id);
    },
    getTotalTime: function(sinceTime = 0) {
        var subactivitiesTotalTime = this.subactivities.reduce((totalTime, subactivity) => totalTime + subactivity.getTotalTime(sinceTime), 0);
        var timeEntriesTotalTime = this.timeEntries
            .filter(timeEntry => timeEntry.endTime > sinceTime)
            .reduce((totalTime, timeEntry) => totalTime + timeEntry.duration, 0)
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
        
        return this;
    },
    removeSubactivity: function(id, deleteSubactivity = false) {
        const removedSubactivity = this.subactivities.filter(subactivity => subactivity.id === id)[0];

        if (!removedSubactivity) {
            return this;
        }
        
        this.subactivities = this.subactivities.filter(subactivity => subactivity.id !== id);

        if (deleteSubactivity) {
            removedSubactivity.delete(true);
        }

        db.update(DBCOLLECTION, this);
        
        return this;
    },
    start: function() {
        const newTimeEntry = {
            startTime: Date.now(),
            endTime: 0,
            duration: 0
        };
        
        this.timeEntries.push(newTimeEntry);
        
        db.update(DBCOLLECTION, this);
        
        return this;
    },
    stop: function() {
        const lastTimeEntry = this.timeEntries[this.timeEntries.length - 1];
        lastTimeEntry.endTime = Date.now();
        lastTimeEntry.duration = lastTimeEntry.endTime - lastTimeEntry.startTime;
        
        db.update(DBCOLLECTION, this);
        
        return this;
    },
    removeTimeEntry: function(id) {
        this.timeEntries = this.timeEntries
            .filter(timeEntry => timeEntry.id !== id);

        db.update(DBCOLLECTION, this);

        return this;
    },
    updateTimeEntry: function(props) {
        if (!props.id) {
            return this;
        }

        this.timeEntries = this.timeEntries
            .map(timeEntry => timeEntry.id === props.id ? merge(timeEntry, props) : timeEntry);

        db.update(DBCOLLECTION, this);

        return this;
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