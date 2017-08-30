import {createClient} from '../backend/client';
import {createActivity} from './activity';
import db from '../db/dbFacade';

const App = {
    clients: [],
    activities: [],
    defaultHourlyRate: 0,
    load: function() {
        return Promise
            .all([
                db
                    .readAll('client')
                    .then(clients => this.clients = clients)
                ,
                db
                    .readAll('activity')
                    .then(activities => this.activities = activities)
            ])
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
    createNewClient: function(props) {
        var newClient = createClient(props);
        if (!newClient.hourlyRate) {
            newClient.hourlyRate = this.defaultHourlyRate;
        }

        this.clients.push(newClient);
        db.update('clients', this);
        return newClient;
    },
    createNewActivity: function(props) {
        var newActivity = createActivity(props);
        if (!newActivity.hourlyRate) {
            newActivity.hourlyRate = this.defaultHourlyRate;
        }

        this.activities.push(newActivity);
        db.update('activities', this);
        return newActivity;
    }
}

const loadApp = () => {
    return Object.create(App).load();
}

export default loadApp;