import idMaker from '../helpers/idMaker';
import merge from '../helpers/merge';
import db from '../db/dbFacade';

const activityIdMaker = idMaker('activity');

function convertMsToH(ms) {
    return ms/3600000;    
}

var Activity = {
    id: 0,
    name: 'new activity',
    startTime: 0,
    hourlyRate: 0,
    subactivities: [],
    timeEntries: [],
    create: function(conf) {
        this.id = activityIdMaker.next().value;
        this.hourlyRate = conf.hourlyRate;
        this.startTime = Date.now();

        if (conf.name) {
            this.name = conf.name;
        }

        if (conf.subactivities) {
            this.subactivities = conf.subactivities;
        }

        db.create('activity', this);
        return this;
    },
    update: function(newProps) {
        merge(this, newProps);
        db.update('activity', this);
    },
    delete: function() {
        db.delete('activity', this);
    },
    getTotalTime: function() {
        return this.subactivities.reduce((totalTime, subactivity) => totalTime + subactivity.getTotalTime(), 0);
    },
    getTotalCost: function() {
        return convertMsToH(this.getTotalTime()) * this.hourlyRate;
    },
    addSubactivity: function(subactivity) {
        if (this.subactivities.filter(storedSubactivity => storedSubactivity.id === subactivity.id).length) {
            return false;
        }

        this.subactivities.push(subactivity);
        db.update('activity', this);
        return true;
    },
    removeSubactivity: function(id) {
        this.subactivities = this.subactivities.filter(subactivity => subactivity.id !== id);
        db.update('activity', this);
    }
}

const createActivity = (conf) => {
    return Object.create(Activity).create(conf);
}

export default createActivity;