import createActivity from '../backend/activity';

const mockDb = {
    create: jest.fn(),
    read: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
}

test('Create activity', () => {
    const activity = createActivity({
        id: 1,
        db: mockDb,
        hourlyRate: 10
    });

    expect(activity.id).toBe(1);
    expect(isNaN(activity.startTime)).toBe(false);
    expect(activity.name).toBe('new activity');
    expect(activity.db).toBe(mockDb);
    expect(activity.hourlyRate).toBe(10);
    expect(activity.subactivities).toEqual([]);
    expect(mockDb.create).toBeCalled();
});

test('activity.delete()', () => {
    const activity = createActivity({
        id: 1,
        db: mockDb,
        hourlyRate: 10
    });

    activity.delete();
    expect(mockDb.delete).toBeCalled();
});

test('activity.update()', () => {
    const activity = createActivity({
        id: 1,
        db: mockDb,
        hourlyRate: 10
    });
    
    activity.update({name: 'baz'});
    expect(activity.name).toBe('baz');
});

test('activity.getTotaleTime()', () => {
    const activity = createActivity({
        id: 1,
        db: mockDb,
        hourlyRate: 10
    });

    activity.update({subactivities: [{getTotalTime: function() {return 3600000}}, {getTotalTime: function() {return 3600000}}]});

    expect(activity.getTotalTime()).toBe(3600000 * 2);
});

test('activity.getTotaleCost()', () => {
    const activity = createActivity({
        id: 1,
        db: mockDb,
        hourlyRate: 10
    });

    activity.update({subactivities: [{getTotalTime: function() {return 3600000}}, {getTotalTime: function() {return 3600000}}]});

    expect(activity.getTotalCost()).toBe(20);
});