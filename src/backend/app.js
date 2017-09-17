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
            .then((db) => Promise //read data
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
            .then(() => { //resolve cross dependencies
                this.activities = this.activities.map((activity) => {
                    if (activity.client.id) {
                        const client = this.client.filter((client) => client.id = activity.client.id)[0];
                        if (client) {
                            activity.client = client;
                        }
                    }

                    activity.subactivities = activity.subactivities
                        .map((activity) => this.activities
                            .filter((storedActivity) => storedActivity.id === activity.id)[0]
                        )

                    return activity;
                })

                this.clients = this.clients.map((client) => {
                    client.activities = client.activities
                        .map((activity) => this.activities
                            .filter((storedActivity) => storedActivity.id === activity.id)[0]
                        );

                    return client;
                })
            })
            .then(() => this) //return app
        ;
    },
    _getActivity: function(id) {
        return this.activities.filter((activity) => activity.id === id)[0];
    },
    _getClient: function(id) {   
        return this.clients.filter((client) => client.id === id)[0];  
    },
    createClient: function(props = {}) {
        var newClient = createClient(Object.assign({defaultHourlyRate: this.defaultHourlyRate}, props));
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

        this.clients = this.clients.map((client) => client.id === props.id ? Object.assign(client, props) : client);

        return this.exportForClient();
    },
    billClient: function(id) {
        this._getClient(id).bill();

        return this.exportForClient();
    },
    addNewActivityToClient: function(clientId) {
        var client = this._getClient(clientId);
        var activity;

        if (!client) {
            return this.exportForClient();
        }

        activity = createActivity({
            hourlyRate: this.defaultHourlyRate,
            client
        });
        this.activities.push(activity);
        const updatedClient = client.addActivity(activity);

        return this.exportForClient();
    },
    
    createActivity: function(props) {
        var newActivity = createActivity(Object.assign({hourlyRate: this.defaultHourlyRate}, props));
        this.activities.push(newActivity);

        return this.exportForClient();
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
    },
    exportForClient: function() {
        return {
            activities: this.activities.map((activity) => activity.exportForClient()),
            clients: this.clients.map((client) => client.exportForClient())
        }
    }
}

const loadApp = () => {
    return Object.create(App).load();
}

export default loadApp;