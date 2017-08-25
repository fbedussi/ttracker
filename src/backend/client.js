import idMaker from '../helpers/idMaker';
import merge from '../helpers/merge';
import db from '../db/dbFacade';
import {convertMsToH} from '../helpers/helpers';

import createNewActivity from './activity';

const clientIdMaker = idMaker('client');

const DBCOLLECTION = 'client';

var Client = {
    id: 0,
    name: 'new client',
    creationTime: 0,
    activities: [],
    defaultHourlyRate: 0,
    contacts: {
        address: '',
        phone: '',
        email: '',
        vatNumber: ''
    },
    create: function(conf) {
        this.id = clientIdMaker.next().value;
        this.creationTime = Date.now();
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
        return this.activities.reduce((totalTime, activity) => totalTime + activity.getTotalTime(), 0);
    },
    getTotalCost: function() {
        return convertMsToH(this.getTotalTime()) * this.defaultHourlyRate;
    },
    addActivity: function(conf) {
        var newActivity = createNewActivity(conf);
        if (!newActivity.hourlyRate) {
            newActivity.hourlyRate = this.defaultHourlyRate;
        }

        this.activities.push(newActivity);
        db.update(DBCOLLECTION, this);
        return true;
    },
    removeActivity: function(id) {
        this.activities = this.activities.filter(activity => activity.id !== id);
        db.update(DBCOLLECTION, this);
    }
}

const createClient = (conf) => {
    return Object.create(Client).create(conf);
}

export default createClient;