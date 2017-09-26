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

        expect(app.clients.filter((client) => client.id === 2)[0].bills.length).toBe(1);
    });
});

test('delete last bill', () => {
    return loadApp().then((app) => {
        app.billClient(1);
        app.deleteLastBill(1)
        expect(app.clients.filter((client) => client.id === 1)[0].bills.length).toBe(1);
    });
});

test('update bill', () => {
    return loadApp().then((app) => {
        app.billClient(1);
        
        const billUpdates = createBill({
            id: 2,
            text: 'baz',
            currency: '$',
            total: 70000,
        });
        
        const updatedApp = app.updateBill(1, billUpdates);
        const updatedBill = updatedApp.clients.filter((client) => client.id === 1)[0].bills.filter((bill) => bill.id === 2)[0];
        expect(updatedBill.text).toBe('baz');
        expect(updatedBill.currency).toBe('$');
        expect(updatedBill.total).toBe(70000);
        expect(db.update).toBeCalled();    
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

        expect(updatedApp2.clients.filter((client) => client.id === 2)[0].activities.length).toBe(0);
    });
});

test('remove activity from client and delete it', () => {
    return loadApp().then((app) => {
        const prevApp = app.exportForClient();
        const updatedApp = app.addNewActivityToClient(2);
        const activityId = updatedApp.clients.filter((client) => client.id === 2)[0].activities[0].id;
        const updatedApp2 = app.removeActivityFromClient({
            activityId,
            clientId: 2,
            deleteActivity: true
        })

        expect(updatedApp2.activities.length).toBe(2);
    });
});

test('remove activity from non existing client', () => {
    return loadApp().then((app) => {
        const prevApp = app.exportForClient();
        const updatedApp = app.addNewActivityToClient(2);
        const activityId = updatedApp.clients.filter((client) => client.id === 2)[0].activities[0].id;
        const updatedApp2 = app.removeActivityFromClient({
            activityId,
            clientId: 3,
            deleteActivity: true
        })

        expect(updatedApp2).toEqual(updatedApp);
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
        app.deleteActivity(2);
        expect(app.activities.length).toBe(1);
    });
});

test('update activity', () => {
    return loadApp().then((app) => {
       app.updateActivity({
           id: 1,
           name: 'update activity name'
       });
       expect(app.activities[0].name).toBe('update activity name');
    });
});

test('start activity', () => {
    return loadApp().then((app) => {
        app.startActivity(1);
        expect(app.activities[0].timeEntries[0].startTime > 0).toBe(true);
    });
});

test('stop activity', () => {
    return loadApp().then((app) => {
        app.startActivity(2);
        Date.now = () => 1000000000000000000000;
        app.stopActivity(2);
        expect(app.activities[1].timeEntries[0].endTime > 0).toBe(true);
        expect(app.activities[1].timeEntries[0].duration > 0).toBe(true);
    });
});

test('delete timeEntry', () => {
    return loadApp().then((app) => {
        app.startActivity(2);
        const timeEntryId = app._getActivity(2).timeEntries[0].id;
        app.stopActivity(2);
        app.deleteTimeEntry(2, timeEntryId);
        expect(app.activities[1].timeEntries.length).toBe(0);
    });
});

test('update timeEntry', () => {
    return loadApp().then((app) => {
        app.updateTimeEntry(1, {id: 1, startTime: 1000, endTime: 2500});
        expect(app.activities[0].timeEntries[0].endTime).toBe(2500);
    });
})

test('add subactivity', () => {
    return loadApp().then((app) => {
        app.activities[0].client = {
            id: 1,
            name: 'client 1'
        };
        app.addSubactivity(1, {name: 'new task'});
        const activity = app.activities[0];
        const subactivity = app.activities[2];

        expect(app.activities.length).toBe(3);
        expect(activity.subactivities.length).toBe(1);
        expect(subactivity.name).toEqual('new task');
        expect(activity.subactivities[0]).toEqual(subactivity);
        expect(subactivity.parentActivity).toEqual(activity);
        expect(subactivity.client).toEqual(activity.client);
        expect(subactivity.hourlyRate).toEqual(activity.hourlyRate);
    });
})
