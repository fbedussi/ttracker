import initIdMaker from '../helpers/idMaker';
import merge from '../helpers/merge';
import db from '../db/dbFacade';
import {convertMsToH} from '../helpers/helpers';

import {createActivity, loadActivity} from './activity';

var clientIdMaker = null;
initIdMaker('client').then((idMaker) => clientIdMaker = idMaker);

const DBCOLLECTION = 'client';

const defaultProps = {
    id: 0,
    name: 'new client',
    creationTime: 0,
    lastBilledTime: 0,
    activities: [],
    defaultHourlyRate: 0,
    contacts: {
        address: '',
        phone: '',
        email: '',
        vatNumber: ''
    }
};

var Client = {
    create: function(props) {
        Object.assign(this, defaultProps);
        this.id = clientIdMaker.next().value;
        this.creationTime = Date.now();
        merge(this, props);

        db.create(DBCOLLECTION, this);
        return this;
    },
    load: function(props) {
        merge(this, props);
        this.activities = this.activities.map(activityProps => loadActivity(activityProps));
        return this;
    },
    update: function(newProps) {
        merge(this, newProps);
        db.update(DBCOLLECTION, this);
    },
    delete: function() {
        db.delete(DBCOLLECTION, this.id);
    },
    getTotalTime: function() {
        return this.activities.reduce((totalTime, activity) => totalTime + activity.getTotalTime(), 0);
    },
    getTotalCost: function() {
        return convertMsToH(this.getTotalTime()) * this.defaultHourlyRate;
    },
    addActivity: function(activity) {
        this.activities.push(activity);
        db.update(DBCOLLECTION, this);
        return activity;
    },
    removeActivity: function(id) {
        this.activities = this.activities.filter(activity => activity.id !== id);
        db.update(DBCOLLECTION, this);
    },
    getTotalToBill: function() {
        return this.activities.reduce((totalToBill, activity) => totalToBill + activity.getTotalCost(this.lastBilledTime), 0);
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