import createTimeEntry from '../backend/timeEntry';

const mockDb = {
    create: jest.fn(),
    read: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
}

// function* mockIdMaker() {
//     var maxId = 0;

//     while (true) {
//         yield ++maxId;
//     }
// }

// const timeEntryIdMaker = mockIdMaker();

test('Create timeEntry', () => {
    const timeEntry = createTimeEntry(1, mockDb);
    expect(timeEntry.id).toBe(1);
    expect(isNaN(timeEntry.startTime)).toBe(false);
    expect(timeEntry.db).toBe(mockDb);
    expect(mockDb.create).toBeCalled();
});

test('timeEntry.stop()', () => {
    const timeEntry = createTimeEntry(1, mockDb);
    expect(timeEntry.id).toBe(1);
    expect(timeEntry.db).toBe(mockDb);
    expect(isNaN(timeEntry.startTime)).toBe(false);
    timeEntry.stop();
    expect(isNaN(timeEntry.endTime)).toBe(false);
    expect(timeEntry.startTime <= timeEntry.endTime).toBe(true);
    expect(mockDb.update).toBeCalled();
});

test('timeEntry.delete()', () => {
    const timeEntry = createTimeEntry(1, mockDb);
    timeEntry.delete();
    expect(mockDb.delete).toBeCalled();
});

test('timeEntry.update()', () => {
    const mockDb = {
        create: jest.fn(),
        read: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    }

    const timeEntry = createTimeEntry(1, mockDb);
    expect(isNaN(timeEntry.startTime)).toBe(false);
    expect(timeEntry.endTime).toBe(null);
    timeEntry.update({startTime: 1, endTime: 2});
    expect(timeEntry.startTime).toBe(1);
    expect(timeEntry.endTime).toBe(2);
    expect(mockDb.update).toBeCalled();
});

test('timeEntry.update() with invalid attributes', () => {
    const timeEntry = createTimeEntry(1, mockDb);
    expect(isNaN(timeEntry.startTime)).toBe(false);
    expect(timeEntry.endTime).toBe(null);
    timeEntry.update({startTime: 1, endTime: 2, invalid: true});
    expect(timeEntry.startTime).toBe(1);
    expect(timeEntry.endTime).toBe(2);
    expect(timeEntry.invalid).toBe(undefined);
    expect(mockDb.update).toBeCalled();
});

test('timeEntry.getTotalTime()', () => {
    const timeEntry = createTimeEntry(1, mockDb);
    timeEntry.update({startTime: 1, endTime: 2});
    var totalTime = timeEntry.getTotalTime();
    expect(totalTime).toBe(1);
});