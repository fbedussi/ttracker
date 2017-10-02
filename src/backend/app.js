// @ts-check

import {createClient, loadClient} from '../backend/client';
import {createActivity, loadActivity} from './activity';
import {createBill, loadBill} from './bill';
import db from '../db/dbFacade';

const App = {
    clients: [],
    activities: [],
    bills: [],
    options: {
        currency: '€',
        billTextTemplate: '${clientName}\n${clientAddress}\n${clientVatNumber}\n\ndate: ${date}\n\nthe invoice total is ${currency}${total}.\nfor the following activities: ${activities}.',
        defaultHourlyRate: 0,
        allowZeroTotalBill: false,
    },
    load: function() {
        return db
            .openDb('ttracker')
            .then((db) => Promise //read data
                .all([
                    db
                        .readAll('client')
                        .then((clientsData) => clientsData
                            .map((clientData) => loadClient(clientData))
                        )
                    ,
                    db
                        .readAll('activity')
                        .then((activitiesData) => activitiesData
                            .map((activityData) => loadActivity(activityData))
                        )
                    ,
                    db
                        .readAll('bill')
                        .then((billsData) =>billsData
                            .map((billData) => loadBill(billData))
                        )
                    ,
                    db
                        .readAll('option')
                        .then((options) => options[0])
                ])
            )
            .then(([clients, activities, bills, options]) => { //resolve cross dependencies
                this.activities = activities.map((activity) => activity.resolveDependencies(clients, activities));
                this.clients = clients.map((client) => client.resolveDependencies(activities, bills));
                this.bills = bills.map((bill) => bill.resolveDependencies(clients));
                this.options = options;
                return this;
            })
        ;
    },
    saveOptions: function(options) {
        this.options = Object.assign({}, this.options, options);
        
        db.update('option', Object.assign({id: 1}, this.options));
        
        return this.options;
    },
    _getActivity: function(id) {
        return this.activities.filter((activity) => activity.id === id)[0];
    },
    _getClient: function(id) {   
        return this.clients.filter((client) => client.id === id)[0];  
    },
    _getBill: function(id) {   
        return this.bills.filter((bill) => bill.id === id)[0];  
    },
    createClient: function(props = {}) {
        var newClient = createClient(Object.assign({defaultHourlyRate: this.options.defaultHourlyRate}, props));
        this.clients.push(newClient);
        
        return this.exportForClient();
    },
    deleteClient: function(id, deleteActivities = false) {
        const clientToDelete = this._getClient(id);
        clientToDelete.delete(deleteActivities);
        this.clients = this.clients.filter((client) => client.id !== id);

        if (deleteActivities) {
            this.activities = this.activities
                .filter((activity) => clientToDelete.activities
                    .every((clientActivity) => clientActivity.id !== activity.id)
                )
            ;
        }
        return this.exportForClient();
    },
    updateClient: function(props) {
        if (!props.id) {
            return this.exportForClient();
        }

        this.clients = this.clients.map((client) => client.id === props.id ? client.update(props) : client);

        return this.exportForClient();
    },
    billClient: function(clientId, textTemplate, currency) {
        var client = this._getClient(clientId);
        var bill;

        if (!client) {
            return this.exportForClient();
        }

        bill = createBill({
            client,
            textTemplate,
            currency
        });
        this.bills.push(bill);
        client.addBill(bill);

        return this.exportForClient();
    },
    deleteBill: function(id) {
        const bill = this._getBill(id);
        if (!bill) {
            return this.exportForClient();
        }
        const client = bill.client;
        if (!client) {
            return this.exportForClient();
        }

        try {
            client.deleteBill(id);
            this.bills = this.bills.filter((bill) => bill.id !== id);
        } catch(e) {
            throw e;
        }
        
        return this.exportForClient();        
    },
    updateBill: function(props) {
        if (!(props.id && props.client && props.client.id)) {
            return this.exportForClient();
        }

        this._getClient(props.client.id).updateBill(props);

        return this.exportForClient();
    },
    refreshBillText: function(billId) {
        this._getBill(billId).refreshText();

        return this.exportForClient();
    },
    addNewActivityToClient: function(clientId) {
        var client = this._getClient(clientId);
        var activity;

        if (!client) {
            return this.exportForClient();
        }

        activity = createActivity({
            hourlyRate: client.defaultHourlyRate,
            client
        });
        this.activities.push(activity);
        client.addActivity(activity);

        return this.exportForClient();
    },
    removeActivityFromClient: function(options) {
        Object.assign({deleteActivity: false}, options);

        var client = this._getClient(options.clientId);

        if (!client) {
            return this.exportForClient();
        }

        client.removeActivity(options.activityId, options.deleteActivity);
        
        if (options.deleteActivity) {
            this.activities = this.activities.filter((activity) => activity.id !== options.activityId);
        }

        return this.exportForClient();
    },
    createActivity: function(props) {
        var newActivity = createActivity(Object.assign({hourlyRate: this.defaultHourlyRate}, props));
        this.activities.push(newActivity);

        return this.exportForClient();
    },
    deleteActivity: function(activityId, deleteSubActivities = false) {
        var activity = this._getActivity(activityId);
        
        if (!activity) {
            return this.exportForClient();
        }

        var removedActivityIds = activity.delete(deleteSubActivities);
        this.activities = this.activities.filter((activity) => removedActivityIds.every((removedActivityId) => activity.id !== removedActivityId));
        this.clients = this.clients.map((client) => {
            //TODO: check first if client has activity?
            removedActivityIds.forEach((removedActivityId) => client.removeActivity(removedActivityId));

            return client;
        });

        return this.exportForClient();
    },
    updateActivity: function(props) {
        if (!props.id) {
            return this.exportForClient();
        }

        this._getActivity(props.id).update(props);

        return this.exportForClient();
    },
    startActivity: function(activityId) {
        this._getActivity(activityId).start();
        
        return this.exportForClient();
    },
    stopActivity: function(activityId) {
        this._getActivity(activityId).stop();
        
        return this.exportForClient();
    },
    deleteTimeEntry: function(activityId, timeEntryId) {
        this._getActivity(activityId).deleteTimeEntry(timeEntryId);
        
        return this.exportForClient();        
    },
    updateTimeEntry: function(activityId, timeEntry) {
        this._getActivity(activityId).updateTimeEntry(timeEntry);
        
        return this.exportForClient();        
    },
    addSubactivity: function(activityId, props) {
        const activity = this._getActivity(activityId).addSubactivity(props);
        const subactivity = activity.subactivities[activity.subactivities.length - 1];
        this.activities.push(subactivity);
        
        return this.exportForClient();        
    },
    exportForClient: function() {
        return {
            activities: this.activities.map((activity) => activity.exportForClient()),
            clients: this.clients.map((client) => client.exportForClient()),
            bills: this.bills.map((bill) => bill.exportForClient()),
        }
    }
}

const loadApp = () => {
    return Object.create(App).load();
}

export default loadApp;