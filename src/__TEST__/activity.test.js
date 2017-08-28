import createActivity from '../backend/activity';
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
        timeEntries: [{getTotalTime: function() {return 3600000}}, {getTotalTime: function() {return 3600000}}]
    });

    expect(activity.getTotalTime()).toBe(3600000 * 4);
});

test('activity.getTotaleCost()', () => {
    const activity = createActivity({
        hourlyRate: 10
    });

    activity.update({subactivities: [{getTotalTime: function() {return 3600000}}, {getTotalTime: function() {return 3600000}}]});

    expect(activity.getTotalCost()).toBe(20);
});

test('activity.addSubactivity()', () => {
    const activity = createActivity({
        hourlyRate: 10
    });

    const subactivity = {
        id: 2,
        name: 'subactivity1'
    }
    const result = activity.addSubactivity(subactivity);
    expect(activity.subactivities.length).toBe(1);
    expect(result).toBe(true);
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

test('activity.addTimeEntry()', () => {
    const activity = createActivity({
        timeEntries: [{id: 1}]
    });

    const timeEntry = {
        id: 2
    }
    const result = activity.addTimeEntry(timeEntry);
    expect(activity.timeEntries.length).toBe(2);
    expect(result).toBe(true);
    expect(db.update).toBeCalled();    
});

test('activity.removeTimeEntry()', () => {
    const activity = createActivity({
        timeEntries: [{id: 1}]
    });

    activity.removeTimeEntry(1);
    expect(activity.timeEntries.length).toBe(0);
    expect(db.update).toBeCalled();    
});