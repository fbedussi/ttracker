import initIdMaker from '../helpers/idMaker';
import merge from '../helpers/merge';
import db from '../db/dbFacade';
import {deepCloneDataObject} from '../helpers/helpers';

import {loadClient} from './client';

var billIdMaker = null;
initIdMaker('bill').then((idMaker) => billIdMaker = idMaker);

const DBCOLLECTION = 'bill';

const defaultBillProps = {
    id: 0,
    date: 0,
    total: 0,
    client: {},
    text: '',
    currency: '€',
    textTemplate: '',
};

var Bill = {
    create: function(props) {
        if (!(props && props.client && props.client.activities && props.client.activities.length)) {
            return false;
        }
        Object.assign(this, Object.assign({}, deepCloneDataObject(defaultBillProps)));
        merge(this, props);
        this.id = billIdMaker.next().value;
        this.client = props.client;
        this.date = Date.now();
        
        const lastBilledTime = this.client.bills.reduce((lastBilledTime, bill) => bill.date, 0);
        this.total = this.client.activities.reduce((total, activity) => total += activity.getTotalCost(lastBilledTime), 0);
        const templateWithThisKeyword = this.textTemplate.replace(/(\${)([^}]*})/g, '$1' + 'this.' + '$2');
        const textTemplate = new Function(`return \`${templateWithThisKeyword}\`;`);
        const textTemplateVariables = {
            clientName: this.client.name,
            clientAddress: this.client.billingInfo.address,
            clientVatNumber: this.client.billingInfo.vatNumber,
            date: new Date(this.date).toLocaleDateString(),
            currency: this.currency,
            total: this.total,
            activities: this.client.activities.reduce((activityList, activity) => `${activityList}${activityList.length ? ', ' : ''}${activity.name}`, '')
        };
        this.text = textTemplate.call(textTemplateVariables);

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

        return this;
    },
    delete: function(deleteActivities = false) {
        if (deleteActivities) {
            this.activities.forEach((activity) => activity.delete(true));
        }

        db.delete(DBCOLLECTION, this.id);

        return this.id;
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
        
        const initialActivitiesLenght = this.activities.length;
        this.activities = this.activities.filter(activity => activity.id !== id);

        if (this.activities.length !== initialActivitiesLenght) {
            db.update(DBCOLLECTION, this.exportForDb());
        }
        
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
        objToSave.client = {id: this.client.id};

        return objToSave;
    },
    exportForClient: function(activityDependency = false) {
        var objToExport = Object.assign({}, this, {
            totalTime: this.getTotalTime(),
            totalCost: this.getTotalCost(),
            totalTimeToBill: this.getTotalTime(this.lastBilledTime),
            totalCostToBill: this.getTotalCost(this.lastBilledTime),

            //this must be set last otherwise when activityDependency is true this.getTotalTime calls activity.getTotalTime which is undefined
            activities: this.activities.map((activity) => !activityDependency && activity.exportForClient ? activity.exportForClient() : Object.assign({}, activity)),
        });
  
        return objToExport;
    },
    resolveDependencies: function(activities) {
        this.activities = this.activities
        .map((clientActivity) => activities
            .filter((storedActivity) => storedActivity.id === clientActivity.id)[0]
        );

        return this;
    }
}

const createBill = (props) => Object.create(Bill).create(props);

const loadBill = (props) => Object.assign(Object.create(Bill), deepCloneDataObject(defaultBillProps)).load(props);

export {
    createBill,
    loadBill
};