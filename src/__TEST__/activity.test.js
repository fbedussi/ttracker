import {createActivity, loadActivity} from '../backend/activity';
import db from '../db/dbFacade';

jest.mock('../db/dbFacade');
jest.mock('../helpers/idMaker');

beforeEach(() => {
    Object.keys(db).forEach(method => db[method].mockClear());
});

test('Create activity with default name', () => {
    const activity = createActivity({
        hourlyRate: 10
    });

    expect(activity.id > 0).toBe(true);
    expect(activity.startTime > 0).toBe(true);
    expect(activity.name).toBe('new activity');
    expect(activity.hourlyRate).toBe(10);
    expect(activity.subactivities).toEqual([]);
    expect(db.create).toBeCalled();
});

test('Create activity with custom name and subacivities', () => {
    const activity = createActivity({
        name: 'Custom name',
        subactivities: [{id: 1}, {id: 2}],
        hourlyRate: 10
    });

    expect(activity.name).toBe('Custom name');
    expect(activity.subactivities.length).toBe(2);
});

test('activity.delete()', () => {
    const activity = createActivity({
        hourlyRate: 10
    });

    activity.delete();
    expect(db.delete).toBeCalled();
});

test('activity.update()', () => {
    const activity = createActivity({
        hourlyRate: 10
    });
    
    activity.update({name: 'baz'});
    expect(activity.name).toBe('baz');
    expect(db.update).toBeCalled();    
});

test('activity.getTotaleTime()', () => {
    const activity = createActivity({
        hourlyRate: 10
    });

    activity.update({
        subactivities: [{getTotalTime: function() {return 3600000}}, {getTotalTime: function() {return 3600000}}],
        timeEntries: [{
            endTime: 1,
            getTotalTime: function() {return 3600000}
        }, {
            endTime: 2,
            getTotalTime: function() {return 3600000}
        }]
    });

    expect(activity.getTotalTime()).toBe(3600000 * 4);
});

test('activity.getTotaleTime() since a specific time', () => {
    const activity = createActivity({
        hourlyRate: 10
    });

    activity.update({
        timeEntries: [{
            endTime: new Date("1/1/2017 15:00:00").getTime(),
            getTotalTime: function() {return 3600000}
        }, {
            endTime: new Date("3/1/2017 15:00:00").getTime(),
            getTotalTime: function() {return 3600000}
        }]
    });

    expect(activity.getTotalTime(new Date("2/1/2017 15:00:00").getTime(),)).toBe(3600000);
});

test('activity.getTotaleCost()', () => {
    const activity = createActivity({
        hourlyRate: 10
    });

    activity.update({subactivities: [{getTotalTime: function() {return 3600000}}, {getTotalTime: function() {return 3600000}}]});

    expect(activity.getTotalCost()).toBe(20);
});

test('activity.getTotaleCost() since a specific time', () => {
    const activity = loadActivity({
        hourlyRate: 10,
        timeEntries: [{
            startTime: new Date("1/1/2017 15:00:00").getTime(),
            endTime: new Date("1/1/2017 16:00:00").getTime()
        }, { 
            startTime: new Date("3/1/2017 15:00:00").getTime(),
            endTime: new Date("3/1/2017 16:00:00").getTime()
        }]
    });

    expect(activity.getTotalCost(new Date("2/1/2017 16:00:00").getTime())).toBe(10);
});

test('activity.addSubactivity()', () => {
    const activity = createActivity({
        hourlyRate: 10
    });

    const subactivity = {
        name: 'subactivity1'
    }
    const result = activity.addSubactivity(subactivity);
    expect(activity.subactivities.length).toBe(1);
    expect(result.name).toBe('subactivity1');
    expect(db.update).toBeCalled();    
});

test('activity.removeSubactivity()', () => {
    const activity = createActivity({
        hourlyRate: 10,
        subactivities: [{id: 1}, {id: 2}]
    });

    activity.removeSubactivity(2);
    expect(activity.subactivities.length).toBe(1);
    expect(db.update).toBeCalled();    
});

test('activity.start()', () => {
    const activity = createActivity({
        timeEntries: [{id: 1}]
    });

    const result = activity.start();
    expect(activity.timeEntries.length).toBe(2);
    expect(isNaN(result.id)).toBe(false);
    expect(db.update).toBeCalled();    
});

test('activity.stop()', () => {
    const activity = createActivity({
        timeEntries: [{id: 1, stop: jest.fn}]
    });

    const result = activity.stop();
    expect(activity.timeEntries[0].stop).toBeCalled();    
});

test('activity.removeTimeEntry()', () => {
    const activity = createActivity({
        timeEntries: [{id: 1}]
    });

    activity.removeTimeEntry(1);
    expect(activity.timeEntries.length).toBe(0);
    expect(db.update).toBeCalled();    
});