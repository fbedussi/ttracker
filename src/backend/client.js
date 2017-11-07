// @ts-check

import initIdMaker from '../helpers/idMaker';
import merge from '../helpers/merge';
import db from '../db/dbFacade';
import {deepCloneDataObject} from '../helpers/helpers';

var clientIdMaker = null;

const DBCOLLECTION = 'client';

const defaultClientProps = {
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
        Object.assign(this, Object.assign({}, deepCloneDataObject(defaultClientProps)));
        merge(this, props);
        this.id = clientIdMaker.next().value;
        
        if (props && props.activities) {
            this.activities = props.activities;
        }

        db.create(DBCOLLECTION, this.exportForDb());

        return this;
    },
    load: function(props) {
        merge(this, props);

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
    addBill: function(bill) {
        this.bills.push(bill);
        this.lastBilledTime = bill.date;

        db.update(DBCOLLECTION, this.exportForDb());
        
        return this;
    },
    deleteBill: function(id) {
        const lastBill = this.bills[this.bills.length - 1];
        if (lastBill.id !== id) {
            throw new Error('Cannot delete bill, it\'s not the last bill for this client');            
        }

        lastBill.delete();

        this.bills = this.bills.slice(0, -1);

        db.update(DBCOLLECTION, this.exportForDb());

        return this;
    },
    updateBill: function(props) {
        const billsData = {
            billToUpdate: null,
            prevBill: null,
            nextBill: null
        }
        
        this.bills.reduce((result, bill, i, bills) => {
            if (bill.id === props.id) {
                Object.assign(billsData, {
                    billToUpdate: bill,
                    prevBill: bills[i - 1],
                    nextBill: bills[i + 1]
                });
            }

            return billsData; 
        }, billsData);

        if (!billsData.billToUpdate) {
            throw new Error('No bill to update');
        }

        if ((billsData.nextBill && props.date >= billsData.nextBill.date) || (billsData.prevBill && props.date <= billsData.prevBill.date)) {
            props.date = billsData.billToUpdate.date;
        }
        billsData.billToUpdate.update(props);

        return this.exportForClient();
    },
    exportForDb: function() {
        var objToSave = Object.assign({}, this);
        objToSave.activities = objToSave.activities.map((activity) => ({id: activity.id}));
        objToSave.bills = objToSave.bills.map((bill) => ({id: bill.id}));

        return objToSave;
    },
    exportForClient: function() {
        var objToExport = Object.assign({}, this, {
            totalTime: this.getTotalTime(),
            totalCost: this.getTotalCost(),
            totalTimeToBill: this.getTotalTime(this.lastBilledTime),
            totalCostToBill: this.getTotalCost(this.lastBilledTime),
            bills: this.bills.map((bill) => bill.exportForClient()),

            //this must be set last otherwise when resolvingDependency is true this.getTotalTime calls activity.getTotalTime which is undefined
            activities: this.activities.map((activity) => activity.exportForClient()),
        });
  
        return objToExport;
    },
    resolveDependencies: function(activities, bills) {
        this.activities = this.activities
            .map((clientActivity) => activities
                .filter((storedActivity) => storedActivity.id === clientActivity.id)[0]
            )
        ;
        this.bills = this.bills
            .map((clientBill) => bills
                .filter((storedBill) => storedBill.id === clientBill.id)[0]
            )
        ;
        
        return this;
    }
}

const createClient = (props) => Object.create(Client).create(props);

const loadClient = (props) => Object.assign(Object.create(Client), deepCloneDataObject(defaultClientProps)).load(props);

const initClientIdMaker = (user) => {
    initIdMaker('client', user).then((idMaker) => clientIdMaker = idMaker); 
}

export {
    createClient,
    loadClient,
    initClientIdMaker
};