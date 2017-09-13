import {createClient, loadClient} from '../backend/client';
import db from '../db/dbFacade';

jest.mock('../db/dbFacade');
jest.mock('../helpers/idMaker');

beforeEach(() => {
    Object.keys(db).forEach(method => db[method].mockClear());
});

test('Create client with default name', () => {
    const client = createClient();

    expect(client.id > 0).toBe(true);
    expect(client.creationTime > 0).toBe(true);
    expect(client.name).toBe('new client');
    expect(client.defaultHourlyRate).toBe(0);
    expect(client.activities).toEqual([]);
    expect(db.create).toBeCalled();
});

test('Create client with custom data', () => {
    const contacts = {
        address: 'address',
        phone: 'phone',
        email: 'email',
        vatNumber: 'vat'
    };
    const client = createClient({
        name: 'Custom name',
        activities: [{id: 1}, {id: 2}],
        defaultHourlyRate: 10,
        contacts
    });

    expect(client.name).toBe('Custom name');
    expect(client.activities.length).toBe(2);
    expect(client.contacts).toEqual(contacts);
    expect(client.defaultHourlyRate).toEqual(10);
});

test('client.delete()', () => {
    const client = createClient();

    client.delete();
    expect(db.delete).toBeCalled();
});

test('client.update()', () => {
    const client = createClient();
    
    client.update({name: 'baz'});
    expect(client.name).toBe('baz');
    expect(db.update).toBeCalled();    
});

test('client.getTotaleTime()', () => {
    const client = createClient();

    client.update({
        activities: [{getTotalTime: function() {return 3600000}}, {getTotalTime: function() {return 3600000}}]
    });

    expect(client.getTotalTime()).toBe(3600000 * 2);
});

test('client.getTotaleCost()', () => {
    const client = createClient({
        name: 'Custom name',
        activities: [{id: 1, getTotalTime: function() {return 3600000}}, {id: 2, getTotalTime: function() {return 3600000}}],
        defaultHourlyRate: 10
    });

    expect(client.getTotalCost()).toBe(20);
});

test('client.addActivity()', () => {
    const client = createClient();
    
    const activity = {
        name: 'activity1'
    }
    const result = client.addActivity(activity);
    expect(client.activities.length).toBe(1);
    expect(result.name).toBe('activity1');
    expect(db.update).toBeCalled();    
});

test('client.removeActivity()', () => {
    const client = createClient({
        name: 'Custom name',
        activities: [{id: 1, getTotalTime: function() {return 3600000}}, {id: 2, getTotalTime: function() {return 3600000}}],
        defaultHourlyRate: 10
    });

    client.removeActivity(2);
    expect(client.activities.length).toBe(1);
    expect(db.update).toBeCalled();    
});

test('client.getTotalToBill()', () => {
    const client = loadClient({
        id: 1,
        name: 'Client name',
        lastBilledTime: new Date("2/1/2017 16:00:00").getTime(),
        activities: [{
            id: 1, 
            hourlyRate: 10,
            timeEntries: [{ //completed before lastBilledTime
                startTime: new Date("1/1/2017 15:00:00").getTime(),
                endTime: new Date("1/1/2017 16:00:00").getTime()
            }]}, 
            {id: 2, 
            hourlyRate: 10,
            timeEntries: [{ //completed after lastBilledTime
                startTime: new Date("3/1/2017 15:00:00").getTime(),
                endTime: new Date("3/1/2017 16:00:00").getTime()
            }]}],
        defaultHourlyRate: 10
    });

    expect(client.getTotalToBill()).toBe(10);
});