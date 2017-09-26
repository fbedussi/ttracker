function getCollection(collection) {
    return collection === 'client' ?
    [
        {
            id: 1,
            name: 'client 1',
            activities: [],
            bills: [{id: 1}],
            getTotalToBill: function() {return 10},
            addActivity: jest.fn()
        },
        {
            id: 2,
            name: 'client 2',
            activities: [],            
            getTotalToBill: function() {return 10}            
        }
    ] 
    : [
        {
            id: 1,
            name: collection + ' bar',
            getTotalToBill: function() {return 10},
            timeEntries: [{id: 1, startTime: 1000, endTime: 2000}, {id: 2, startTime: 3000, endTime: 3000}]
        },
        {
            id: 2,
            name: collection + ' baz',
            getTotalToBill: function() {return 10}            
        }
    ]
}

const mockDb = {
        openDb: jest.fn(() => Promise.resolve(mockDb)),
        deleteDb: jest.fn(),
    
        create: jest.fn(),
        read: jest.fn(),
        readAll: jest.fn((collection) => Promise.resolve(getCollection(collection))),
        update: jest.fn(),
        delete: jest.fn(),
}

export default mockDb;