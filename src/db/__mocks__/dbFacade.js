function getCollection(collection) {
    return collection === 'client' ?
    [
        {
            id: 1,
            name: collection + ' bar',
            activities: [],
            getTotalToBill: function() {return 10},
            addActivity: jest.fn()
        },
        {
            id: 2,
            name: collection + ' baz',
            getTotalToBill: function() {return 10}            
        }
    ] 
    : [
        {
            id: 1,
            name: collection + ' bar',
            getTotalToBill: function() {return 10},
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