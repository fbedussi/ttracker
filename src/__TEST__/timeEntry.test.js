import {createTimeEntry} from '../backend/timeEntry';
import db from '../db/dbFacade';

jest.mock('../db/dbFacade');
jest.mock('../helpers/idMaker');

test('Create timeEntry', () => {
    const timeEntry = createTimeEntry();
    expect(timeEntry.id > 0).toBe(true);
    expect(timeEntry.startTime > 0).toBe(true);
    expect(db.create).toBeCalled();
});

test('timeEntry.stop()', () => {
    const timeEntry = createTimeEntry();
    timeEntry.stop();
    expect(timeEntry.endTime > 0).toBe(true);
    expect(timeEntry.startTime <= timeEntry.endTime).toBe(true);
    expect(db.update).toBeCalled();
});

test('timeEntry.delete()', () => {
    const timeEntry = createTimeEntry();
    timeEntry.delete();
    expect(db.delete).toBeCalled();
});

test('timeEntry.update()', () => {
    const timeEntry = createTimeEntry();
    timeEntry.update({startTime: 1, endTime: 2});
    expect(timeEntry.startTime).toBe(1);
    expect(timeEntry.endTime).toBe(2);
    expect(db.update).toBeCalled();
});

test('timeEntry.update() with invalid attributes', () => {
    const timeEntry = createTimeEntry();
    timeEntry.update({startTime: 1, endTime: 2, invalid: true});
    expect(timeEntry.startTime).toBe(1);
    expect(timeEntry.endTime).toBe(2);
    expect(timeEntry.invalid).toBe(undefined);
    expect(db.update).toBeCalled();
});

test('timeEntry.getTotalTime()', () => {
    const timeEntry = createTimeEntry();
    timeEntry.update({startTime: 1, endTime: 2});
    var totalTime = timeEntry.getTotalTime();
    expect(totalTime).toBe(1);
});