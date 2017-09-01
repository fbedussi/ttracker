import {createClient, loadClient} from '../backend/client';
import {createActivity, loadActivity} from './activity';
import db from '../db/dbFacade';

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
    }
}

const loadApp = () => {
    return Object.create(App).load();
}

export default loadApp;