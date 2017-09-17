import loadApp from '../backend/app';
import db from '../db/dbFacade';

jest.mock('../db/dbFacade');
jest.mock('../helpers/idMaker');

beforeEach(() => {
    Object.keys(db).forEach(method => db[method].mockClear());
});

test('Load app', () => {    
    return loadApp().then((app) => {
        expect(app.clients.length).toBe(2);
        expect(app.activities.length).toBe(2);
    })
});

test('Create client', () => {
    return loadApp().then((app) => {
        const prevClientsLength = app.clients.length;
        const updatedClients = app.createClient().clients;
        const newClient = updatedClients[updatedClients.length - 1];        

        expect(updatedClients.length).toBe(prevClientsLength + 1);
        expect(newClient.id > 0).toBe(true);
        expect(newClient.name).toBe('new client');
        expect(newClient.defaultHourlyRate).toBe(0);
        expect(newClient.activities).toEqual([]);
        expect(db.create).toBeCalled();
    });
});

test('delete client', () => {
    return loadApp().then((app) => {
        app.deleteClient(2);

        expect(app.clients.length).toBe(1);
    });
});

test('update client', () => {
    return loadApp().then((app) => {
        app.updateClient({
            id: 2,
            name: 'new client 2'
        })

        expect(app.clients.filter((client) => client.id === 2)[0].name).toBe('new client 2');
    });
});

test('update non existent client', () => {
    return loadApp().then((app) => {
        const updatedApp = app.updateClient({
            id: 3,
            name: 'new client 2'
        })

        expect(updatedApp.clients).toEqual(app.exportForClient().clients);
    });
});

test('bill client', () => {
    return loadApp().then((app) => {
        app.billClient(2);

        expect(app.clients.filter((client) => client.id === 2)[0].lastBilledTime > 0).toBe(true);
    });
});

test('addNewActivityToClient', () => {
    return loadApp().then((app) => {
        const prevApp = app.exportForClient();
        const updatedApp = app.addNewActivityToClient(2)

        expect(updatedApp.activities.length).toBe(prevApp.activities.length + 1);
        expect(updatedApp.clients[1].activities.length).toBe(1);
    });
});

test('remove activity from client', () => {
    return loadApp().then((app) => {
        const prevApp = app.exportForClient();
        const updatedApp = app.addNewActivityToClient(2);
        const activityId = updatedApp.clients.filter((client) => client.id === 2)[0].activities[0].id;
        const updatedApp2 = app.removeActivityFromClient({
            activityId,
            clientId: 2
        })

         
    });
});

test('Create activity', () => {
    return loadApp().then((app) => {
        const prevActivitiesLength = app.activities.length;
        const updatedApp = app.createActivity();
        const newActivity = updatedApp.activities[updatedApp.activities.length - 1];

        expect(updatedApp.activities.length).toBe(prevActivitiesLength + 1);
        expect(newActivity.id > 0).toBe(true);
        expect(newActivity.name).toBe('new activity');
        expect(newActivity.hourlyRate).toBe(0);
        expect(newActivity.subactivities).toEqual([]);
        expect(db.create).toBeCalled();
    });
});


test('deleteActivity', () => {
    return loadApp().then((app) => {
        const clientId = 1;
        const activity = app.addNewActivityToClient(clientId)
        const client = app.getClient(clientId)
        const initialActivitiesLength = app.activities.length;
        const initialClientActivitiesLenght = client.activities.length;
        expect(activity.id > 0).toBe(true);
        expect(activity.startTime > 0).toBe(true);
        expect(activity.name).toBe('new activity');
        expect(activity.hourlyRate).toBe(0);
        expect(activity.subactivities).toEqual([]);
        expect(client.addActivity).toBeCalled();
        expect(db.create).toBeCalled();

        app.deleteActivity(activity.id);
        expect(app.activities.length).toBe(initialActivitiesLength);
        expect(client.activities.length).toBe(initialClientActivitiesLenght);

    });
});

test('update activity', () => {
    return loadApp().then((app) => {
        
    });
});

test('start activity', () => {
    return loadApp().then((app) => {
        
    });
});

test('stop activity', () => {
    return loadApp().then((app) => {
        
    });
});

