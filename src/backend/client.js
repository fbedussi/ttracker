import initIdMaker from '../helpers/idMaker';
import merge from '../helpers/merge';
import db from '../db/dbFacade';
import {convertMsToH} from '../helpers/helpers';

import {loadActivity} from './activity';

var clientIdMaker = null;
initIdMaker('client').then((idMaker) => clientIdMaker = idMaker);

const DBCOLLECTION = 'client';

export const defaultClientProps = {
    id: 0,
    name: 'new client',
    lastBilledTime: 0,
    activities: [],
    defaultHourlyRate: 0,
    billingInfo: {
        address: '',
        phone: '',
        email: '',
        vatNumber: ''
    },
    bills: [],
};

var Client = {
    create: function(props) {
        Object.assign(this, defaultClientProps);
        this.id = clientIdMaker.next().value;
        merge(this, props);

        if (props && props.activities) {
            this.activities = props.activities;
        }

        db.create(DBCOLLECTION, this.exportForDb());

        return this;
    },
    load: function(props) {
        merge(this, props);
        this.activities = this.activities.map(activityProps => loadActivity(activityProps));
        return this;
    },
    update: function(newProps) {
        merge(this, newProps);
        db.update(DBCOLLECTION, this.exportForDb());
    },
    delete: function(deleteActivities = false) {
        if (deleteActivities) {
            this.activities.forEach((activity) => activity.delete(true));
        }

        db.delete(DBCOLLECTION, this.id);
    },
    getTotalTime: function(startTime) {
        return this.activities.reduce((totalTime, activity) => totalTime + activity.getTotalTime(startTime), 0);
    },
    getTotalCost: function(startTime) {
        return this.activities.reduce((totalCost, activity) => totalCost + activity.getTotalCost(startTime), 0);
    },
    addActivity: function(activity) {
        this.activities.push(activity);

        db.update(DBCOLLECTION, this.exportForDb());
        
        return this;
    },
    removeActivity: function(id, deleteActivity = false) {
        if (deleteActivity) {
            const activityToDelete = this.activities.filter(activity => activity.id === id)[0];
            if (activityToDelete.delete) {
                activityToDelete.delete(true);
            }
        }
        
        this.activities = this.activities.filter(activity => activity.id !== id);
        
        db.update(DBCOLLECTION, this.exportForDb());

        return this;
    },
    bill: function() {
        const amount = this.getTotalCost(this.lastBilledTime);
        var  billedActivities =  [];
        
        if (this.activities.length && this.activities[0].getTotalTime) {
            billedActivities = this.activities.filter((activity) => activity.getTotalTime(this.lastBilledTime) > 0);
        }

        this.lastBilledTime = Date.now();
        this.bills.push({
            date: this.lastBilledTime,
            amount,
            billedActivities
        })

        db.update(DBCOLLECTION, this.exportForDb());

        return this;
    },
    exportForDb: function() {
        var objToSave = Object.assign({}, this);
        objToSave.activities = objToSave.activities.map((activity) => ({id: activity.id}));

        return objToSave;
    },
    exportForClient: function() {
        var objToExport = Object.assign({}, this, {
            totalTime: this.getTotalTime(),
            totalCost: this.getTotalCost(),
            totalTimeToBill: this.getTotalTime(this.lastBilledTime),
            totalCostToBill: this.getTotalCost(this.lastBilledTime),
        });
  
        return objToExport;
    }
}

const createClient = (props) => {
    return Object.create(Client).create(props);
}

const loadClient = (props) => {
    return Object.assign(Object.create(Client), defaultProps).load(props);
}

export {
    createClient,
    loadClient
};