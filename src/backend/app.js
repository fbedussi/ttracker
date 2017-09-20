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
                        .then((clientsData) => clientsData
                            .map((clientData) => loadClient(clientData))
                        )
                    ,
                    db
                        .readAll('activity')
                        .then((activitiesData) => activitiesData
                            .map((activityData) => loadActivity(activityData))
                    )
                ])
            )
            .then(([clients, activities]) => { //resolve cross dependencies
                this.activities = activities.map((activity) => activity.resolveDependencies(clients, activities));
                this.clients = clients.map((client) => client.resolveDependencies(activities));
                
                return this;
            })
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

        this.clients = this.clients.map((client) => client.id === props.id ? client.update(props) : client);

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
    deleteTimeEntry: function(activityId, timeEntry) {
        this._getActivity(activityId).deleteTimeEntry(timeEntry);

        return this.exportForClient();        
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