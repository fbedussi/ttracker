import {createClient, loadClient} from '../backend/client';
import {createActivity, loadActivity} from './activity';
import db from '../db/dbFacade';

function updateClientTotalCost(client, activityId) {
    if (client.activities.some((activity) => activity.id === activityId).length) {
        client.totalCost = client.getTotalCost();
    }

    return client;
}

const App = {
    clients: [],
    activities: [],
    defaultHourlyRate: 0,
    load: function() {
        return db
            .openDb('ttracker')
            .then((db) => Promise
                .all([
                    db
                        .readAll('client')
                        .then((clientsData) => this.clients = clientsData
                            .map((clientData) => loadClient(clientData))
                        )
                    ,
                    db
                        .readAll('activity')
                        .then((activitiesData) => this.activities = activitiesData
                            .map((activityData) => loadActivity(activityData))
                    )
                ])
            )
            .then(() => this)
        ;
    },
    getAllActivities: function() {
        return this.activities;
    },
    getAllClients: function() {
        return this.clients;
    },
    getActivity: function(id) {
        return this.activities.filter((activity) => activity.id === id)[0];
    },
    getClient: function(id) {   
        return this.clients.filter((client) => client.id === id)[0];  
    },
    getTotalToBill: function() {
        return this.clients.reduce((total, client) => total + client.getTotalToBill(), 0);
    },
    createNewClient: function(props = {}) {
        var newClient = createClient(Object.assign({defaultHourlyRate: this.defaultHourlyRate}, props));
        this.clients.push(newClient);
        return newClient;
    },
    createNewActivity: function(props) {
        var newActivity = createActivity(Object.assign({hourlyRate: this.defaultHourlyRate}, props));
        this.activities.push(newActivity);
        return newActivity;
    },
    addNewActivityToClient: function(clientId) {
        var client = this.getClient(clientId);
        var activity;

        if (!client) {
            return false;
        }

        activity = this.createNewActivity({hourlyRate: client.defaultHourlyRate});
        client.addActivity(activity);

        return activity;
    },
    deleteActivity: function(activityId) {
        var activity = this.getActivity(activityId);

        if (!activity) {
            return false;
        }

        activity.delete();
        var clientsAssociaterdWithActivity = this.clients.filter((client) => client.activities.some((id) => id === activityId));

        clientsAssociaterdWithActivity.forEach((client) => client.removeActivity(activityId));
    },
    stopActivity: function(activityId) {
        this.activities = this.activities.map((activity) => activity.id === activityId ? activity.stop() : activity);
        this.clients = this.clients.map((client) => updateClientTotalCost(client, activityId))

        return {
            activities: this.activities,
            clients: this.clients
        } 
    }
}

const loadApp = () => {
    return Object.create(App).load();
}

export default loadApp;