import {createClient, loadClient} from '../backend/client';
import db from '../db/dbFacade';

jest.mock('../db/dbFacade');
jest.mock('../helpers/idMaker');

beforeEach(() => {
    Object.keys(db).forEach(method => db[method].mockClear());
});

test('Create client with default data', () => {
    const client = createClient();

    expect(client.id > 0).toBe(true);
    expect(client.name).toBe('new client');
    expect(client.defaultHourlyRate).toBe(0);
    expect(client.lastBilledTime).toBe(0);
    expect(client.billingInfo).toEqual({
        address: '',
        phone: '',
        email: '',
        vatNumber: ''
    });
    expect(client.activities).toEqual([]);
    expect(client.bills).toEqual([]);
    expect(db.create).toBeCalled();
});

test('Create client with custom data', () => {
    const billingInfo = {
        address: 'address',
        phone: 'phone',
        email: 'email',
        vatNumber: 'vat'
    };
    const client = createClient({
        name: 'Custom name',
        activities: [{id: 1}, {id: 2}],
        defaultHourlyRate: 10,
        billingInfo
    });

    expect(client.name).toBe('Custom name');
    expect(client.activities.length).toBe(2);
    expect(client.billingInfo).toEqual(billingInfo);
    expect(client.defaultHourlyRate).toEqual(10);
});

test('client.delete()', () => {
    const client = createClient();

    client.delete();
    expect(db.delete).toBeCalled();
});

test('client.delete(true) delete activities', () => {
    const deleteActivity1 = jest.fn();
    const deleteActivity2 = jest.fn();
    const client = createClient({
        activities: [{id: 1, delete: deleteActivity1}, {id: 2, delete: deleteActivity2}],
    });

    client.delete(true);
    expect(deleteActivity1).toBeCalled()
    expect(deleteActivity2).toBeCalled()
    expect(db.delete).toBeCalled();
});

test('client.update()', () => {
    const client = createClient();
    
    client.update({name: 'baz'});
    expect(client.name).toBe('baz');
    expect(db.update).toBeCalled();    
});

test('client.getTotaleTime()', () => {
    const client = createClient({
        activities: [{getTotalTime: function() {return 3600000}}, {getTotalTime: function() {return 3600000}}]
    });

    expect(client.getTotalTime()).toBe(3600000 * 2);
});

test('client.getTotaleCost()', () => {
    const client = createClient({
        name: 'Custom name',
        activities: [{id: 1, getTotalCost: function() {return 10}}, {id: 2, getTotalCost: function() {return 10}}],
    });

    expect(client.getTotalCost()).toBe(20);
});

test('client.addActivity()', () => {
    const client = createClient();
    
    const activity = {
        name: 'activity1'
    }
    const updatedClient = client.addActivity(activity);
    expect(updatedClient.activities.length).toBe(1);
    expect(updatedClient.activities[0].name).toBe('activity1');
    expect(db.update).toBeCalled();    
});

test('client.removeActivity()', () => {
    const client = createClient({
        activities: [{id: 1}, {id: 2}]
    });

    const updatedClient = client.removeActivity(2);
    expect(updatedClient.activities.length).toBe(1);
    expect(db.update).toBeCalled();    
});

test('client.removeActivity(, true) delete activity', () => {
    const deleteActivity1 = jest.fn();
    const deleteActivity2 = jest.fn();
    const client = createClient({
        activities: [{id: 1, delete: deleteActivity1}, {id: 2, delete: deleteActivity2}],
    });

    const updatedClient = client.removeActivity(2, true);
    expect(updatedClient.activities.length).toBe(1);
    expect(deleteActivity1).toBeCalled()
    expect(deleteActivity2).toBeCalled()
    expect(db.update).toBeCalled();    
});

test('client.getTotalTime()', () => {
    const client = createClient({
        id: 1,
        name: 'Client name',
        lastBilledTime: new Date("2/1/2017 16:00:00").getTime(),
        activities: [{
            id: 1, 
            getTotalTime: () => 1 * 1000 * 60 * 60
        }, 
        {
            id: 2, 
            getTotalTime: () => 1 * 1000 * 60 * 60
        }]
    });

    expect(client.getTotalTime()).toBe(2 * 1000 * 60 * 60);
});

test('client.getTotalCost()', () => {
    const client = createClient({
        id: 1,
        name: 'Client name',
        lastBilledTime: new Date("2/1/2017 16:00:00").getTime(),
        activities: [{
            id: 1, 
            getTotalCost: () => 10
        }, 
        {
            id: 2, 
            getTotalCost: () => 10
        }]
    });

    expect(client.getTotalCost()).toBe(20);
});

test('client.bill()', () => {
    const client = createClient({
        id: 1,
        name: 'Client name',
        lastBilledTime: 0,
        activities: [{
            id: 1, 
            getTotalCost: () => 10
        }, 
        {
            id: 2, 
            getTotalCost: () => 10
        }]
    });

    const updatedClient = client.bill();

    expect(updatedClient.lastBilledTime > 0).toBe(true);
    expect(updatedClient.bills.length).toBe(1);
});

test('client.exportForDb()', () => {
    const client = createClient({
        activities: [{id: 1, name: 'baz'}, {id: 2, name: 'bar'}]
    });

    const clientReadyForDB = client.exportForDb();    
    expect(clientReadyForDB).toEqual({
        id: 1,
        name: 'new client',
        lastBilledTime: 0,
        activities: [{id: 1}, {id:2}],
        defaultHourlyRate: 0,
        billingInfo: {}
    });
});


test('client.exportForClient()', () => {
    const client = createClient({
        activities: [{
            id: 1, 
            name: 'activity 1',
            getTotalTime: (startTime) => startTime ? 100 : 200,
            getTotalCost: (startTime) => startTime ? 10 : 20
        }, {
            id: 2, 
            name: 'activity 2',            
            getTotalTime: (startTime) => startTime ? 100 : 200,
            getTotalCost: (startTime) => startTime ? 10 : 20
        }]
    });

    const clientReadyForClient = client.exportForClient();    
    expect(clientReadyForClient).toEqual({
        id: 1,
        name: 'new client',
        lastBilledTime: 0,
        activities: [{
            id: 1, 
            name: 'activity 1'
        }, {
            id: 2, 
            name: 'activity 2'
        }],
        defaultHourlyRate: 0,
        billingInfo: {
            address: '',
            phone: '',
            email: '',
            vatNumber: ''
        },
        bills: [],
        totalTime: 400,
        totalCost: 40,
        totalTimeToBill: 200,
        totalCostToBill: 20
    });
});