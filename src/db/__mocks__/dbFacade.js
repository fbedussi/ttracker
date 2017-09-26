function getCollection(collection) {
    var response;

    switch (collection) {
        case 'client':
            response = [
                {
                    id: 1,
                    name: 'client 1',
                    activities: [{id: 1, getTotalCost: function() {return 10}}],
                    bills: [{id: 1}],
                    addActivity: jest.fn()
                },
                {
                    id: 2,
                    name: 'client 2',
                    activities: [{id: 1, getTotalCost: function() {return 10}}],            
                }
            ];
            break;
        case 'activity':
            response = [
                {
                    id: 1,
                    name: collection + ' bar',
                    getTotalCost: function() {return 10},
                    timeEntries: [{id: 1, startTime: 1000, endTime: 2000}, {id: 2, startTime: 3000, endTime: 3000}]
                },
                {
                    id: 2,
                    name: collection + ' baz',
                    getTotalCost: function() {return 10},
                }
            ];
            break;
        case 'bill':
            response = [
                {
                    id: 1,
                    total: 10,
                    date: 101,
                    client: {
                        id: 1
                    }
                }
            ];
            break;
    }

    return response; 
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