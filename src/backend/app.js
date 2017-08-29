import db from '../db/dbFacade';

const App = {
    clients: [],
    projects: [],
    defaultHourlyRate: 0,
    load: function() {
        db
            .readAll('client')
            .then(clients => this.clients = client)
        ;
        db
            .readAll('activity')
            .then(activities => this.activities = activities)
        ;
        return this;
    },
    getAllProjects: function() {
        return this.projects;
    },
    getAllClients: function() {
        return this.clients;
    },
    getProject: function(id) {
        return this.projects.filter((project) => project.id = id);
    },
    getClient: function(id) {   
        return this.clients.filter((client) => client.id = id);        
    },
    getTotalToBill: function() {
        return this.clients.reduce((total, client) => total + client.get, 0);

    },
    createNewClient: function() {

    }
}

const createApp = (conf) => {
    return Object.create(App).load();
}

export default createApp;