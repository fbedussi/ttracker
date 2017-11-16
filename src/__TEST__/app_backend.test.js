import {startAppAndLoadData} from '../backend/app';
import db from '../db/dbInterface';

jest.mock('../db/dbInterface');
jest.mock('../helpers/idMaker');

beforeEach(() => {
    Object.keys(db).forEach(method => db[method].mockClear());
});

test('Load app', () => {    
    return startAppAndLoadData().then((app) => {
        expect(app.clients.length).toBe(2);
        expect(app.activities.length).toBe(2);
    })
});

test('Create client', () => {
    return startAppAndLoadData().then((app) => {
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
    return startAppAndLoadData().then((app) => {
        app.deleteClient({id: 1});

        expect(app.clients.length).toBe(1);
    });
});

test('update client', () => {
    return startAppAndLoadData().then((app) => {
        app.updateClient({
            id: 1,
            name: 'new client 2'
        })

        expect(app.clients.filter((client) => client.id === 1)[0].name).toBe('new client 2');
    });
});

test('update non existent client', () => {
    return startAppAndLoadData().then((app) => {
        const updatedApp = app.updateClient({
            id: 2,
            name: 'new client 2'
        })

        expect(updatedApp.clients).toEqual(app.exportForClient().clients);
    });
});

test('bill client', () => {
    return startAppAndLoadData().then((app) => {
        app.billClient(1);

        expect(app.clients.filter((client) => client.id === 1)[0].bills.length).toBe(1);
    });
});

test('delete bill only if it is the last bill for that client', () => {
    return startAppAndLoadData().then((app) => {
        app.billClient(0);
        const client = app.bills[app.bills.length - 1].client;
        const clientLastBillId = client.bills[client.bills.length - 1].id;
        
        expect(() => app.deleteBill(0)).toThrow(); //not deleted
        app.deleteBill({id: clientLastBillId})
        expect(app.clients.filter((client) => client.id === 0)[0].bills.length).toBe(1); //deleted
        expect(app.bills.length).toBe(1);    
    });
});

test('update bill', () => {
    return startAppAndLoadData().then((app) => {
        app.billClient(0);
        const client = app.clients.filter((client) => client.id === 0)[0];
        const clientBill = client.bills[client.bills.length - 1]; 
        const billId = clientBill.id;
        
        const billUpdates = {
            id: billId,
            text: 'baz',
            currency: '$',
            client: {
                id: 0
            },
            total: 70000,
        };
        
        const updatedApp = app.updateBill(billUpdates);
        const updatedBill = updatedApp.bills.filter((bill) => bill.id === billId)[0];
        expect(updatedBill.text).toBe('baz');
        expect(updatedBill.currency).toBe('$');
        expect(updatedBill.total).toBe(70000);
        expect(clientBill).toEqual(updatedBill);
        expect(db.update).toBeCalled();    
    });
});

// test('refresh bill Text', () => {
//     return loadApp().then((app) => {
//         Date.now = () => 101;
//         const textTemplate = '${clientName}\n${clientAddress}\n${clientVatNumber}\n\ndate: ${date}\n\nthe invoice total is ${currency}${total}.\nfor the following activities: ${activities}.';
        
//         app.billClient(
//             1,
//             textTemplate,
//             '€'
//         );
//         const client = app.clients.filter((client) => client.id === 1)[0];
//         const clientBill = client.bills[client.bills.length - 1]; 
//         const billId = clientBill.id;
        
//         const billUpdates = {
//             id: billId,
//             date: 20000000,
//             total: 500,
//         };
        
//         const updatedApp = app.updateBill(billUpdates);

//         app.refreshBillText(billId);
//         const updatedBill = updatedApp.bills.filter((bill) => bill.id === billId)[0];
//         expect(updatedBill.text).toBe(`client 1\n\n\n\ndate: ${new Date(20000000).toLocaleDateString()}\n\nthe invoice total is €500.\nfor the following activities: activity bar`)    
//         expect(db.update).toBeCalled();    
//     });
// });

test('addNewActivityToClient', () => {
    return startAppAndLoadData().then((app) => {
        const prevApp = app.exportForClient();
        const updatedApp = app.addNewActivityToClient(1)

        expect(updatedApp.activities.length).toBe(prevApp.activities.length + 1);
        expect(updatedApp.clients[1].activities.length).toBe(prevApp.clients[1].activities.length + 1);
    });
});

test('remove activity from client', () => {
    return startAppAndLoadData().then((app) => {
        const prevApp = app.exportForClient();
        const updatedApp = app.addNewActivityToClient(1);
        const activityId = updatedApp.clients.filter((client) => client.id === 1)[0].activities[0].id;
        const updatedApp2 = app.removeActivityFromClient({
            activityId,
            clientId: 1
        })

        expect(updatedApp2.clients.filter((client) => client.id === 1)[0].activities.length).toBe(prevApp.clients.filter((client) => client.id === 1)[0].activities.length);
    });
});

test('remove activity from client and delete it', () => {
    return startAppAndLoadData().then((app) => {
        const prevApp = app.exportForClient();
        const updatedApp = app.addNewActivityToClient(1);
        const activityId = updatedApp.clients.filter((client) => client.id === 1)[0].activities[0].id;
        const updatedApp2 = app.removeActivityFromClient({
            activityId,
            clientId: 1,
            deleteActivity: true
        })

        expect(updatedApp2.activities.length).toBe(2);
    });
});

test('remove activity from non existing client', () => {
    return startAppAndLoadData().then((app) => {
        const prevApp = app.exportForClient();
        const updatedApp = app.addNewActivityToClient(1);
        const activityId = updatedApp.clients.filter((client) => client.id === 1)[0].activities[0].id;

        expect(() => {
            app.removeActivityFromClient({
                activityId,
                clientId: 2,
                deleteActivity: true
            })
          }).toThrow();
    });
});

test('Create activity', () => {
    return startAppAndLoadData().then((app) => {
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
    return startAppAndLoadData().then((app) => {
        app.deleteActivity({id: 1});
        expect(app.activities.length).toBe(1);
    });
});

test('update activity', () => {
    return startAppAndLoadData().then((app) => {
       app.updateActivity({
           id: 0,
           name: 'update activity name'
       });
       expect(app.activities[0].name).toBe('update activity name');
    });
});

test('start activity', () => {
    return startAppAndLoadData().then((app) => {
        app.startActivity(0);
        expect(app.activities[0].timeEntries[0].startTime > 0).toBe(true);
    });
});

test('stop activity', () => {
    return startAppAndLoadData().then((app) => {
        app.startActivity(1);
        Date.now = () => 1000000000000000000000;
        app.stopActivity(1);
        expect(app.activities[1].timeEntries[0].endTime > 0).toBe(true);
        expect(app.activities[1].timeEntries[0].duration > 0).toBe(true);
    });
});

test('delete timeEntry', () => {
    return startAppAndLoadData().then((app) => {
        app.startActivity(1);
        const timeEntryId = app._getActivity(1).timeEntries[0].id;
        app.stopActivity(1);
        app.deleteTimeEntry(1, timeEntryId);
        expect(app.activities[1].timeEntries.length).toBe(0);
    });
});

test('update timeEntry', () => {
    return startAppAndLoadData().then((app) => {
        app.updateTimeEntry(0, {id: 0, startTime: 1000, endTime: 2500});
        expect(app.activities[0].timeEntries[0].endTime).toBe(2500);
    });
})

test('add subactivity', () => {
    return startAppAndLoadData().then((app) => {
        app.activities[0].client = {
            id: 0,
            name: 'client 1'
        };
        app.addSubactivity(0, {name: 'new task'});
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
