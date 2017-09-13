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

test('app.getAllActivities()', () => {
    return loadApp().then((app) => {
        var activities = app.getAllActivities();
        expect(activities.length).toBe(2);
        expect(activities[0].name).toBe('activity bar');
    })
});

test('app.getAllClients()', () => {
    return loadApp().then((app) => {
        var clients = app.getAllClients();
        expect(clients.length).toBe(2);
        expect(clients[0].name).toBe('client bar');
    });
});

test('app.getClient()', () => {
    return loadApp().then((app) => {
        var client = app.getClient(2);
        expect(client.name).toBe('client baz');
    });
});

test('app.getActivity()', () => {
    return loadApp().then((app) => {
        var activity = app.getActivity(2);
        expect(activity.name).toBe('activity baz');
    });
});

test('app.getTotalToBill()', () => {
    return loadApp().then((app) => {
        expect(app.getTotalToBill()).toBe(20);
    });
});

test('Create new client', () => {
    return loadApp().then((app) => {
        const client = app.createNewClient();
       
        expect(client.id > 0).toBe(true);
        expect(client.creationTime > 0).toBe(true);
        expect(client.name).toBe('new client');
        expect(client.defaultHourlyRate).toBe(0);
        expect(client.activities).toEqual([]);
        expect(db.create).toBeCalled();
    });
});

test('Create new activity', () => {
    return loadApp().then((app) => {
        const activity = app.createNewActivity()

        expect(activity.id > 0).toBe(true);
        expect(activity.startTime > 0).toBe(true);
        expect(activity.name).toBe('new activity');
        expect(activity.hourlyRate).toBe(0);
        expect(activity.subactivities).toEqual([]);
        expect(db.create).toBeCalled();
    });
});

test('addNewActivityToClient', () => {
    return loadApp().then((app) => {
        const clientId = 1;
        const activity = app.addNewActivityToClient(clientId)
        const client = app.getClient(clientId)

        expect(activity.id > 0).toBe(true);
        expect(activity.startTime > 0).toBe(true);
        expect(activity.name).toBe('new activity');
        expect(activity.hourlyRate).toBe(0);
        expect(activity.subactivities).toEqual([]);
        expect(client.addActivity).toBeCalled();
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