const mockDb = {
        openDb: jest.fn(() => Promise.resolve(mockDb)),
        deleteDb: jest.fn(),
    
        create: jest.fn(),
        read: jest.fn(),
        readAll: jest.fn((collection) => Promise.resolve([
            {
                id: 1,
                name: collection + ' bar',
                getTotalToBill: function() {return 10}
            },
            {
                id: 2,
                name: collection + ' baz',
                getTotalToBill: function() {return 10}            
            }
        ])),
        update: jest.fn(),
        delete: jest.fn(),
}

export default mockDb;