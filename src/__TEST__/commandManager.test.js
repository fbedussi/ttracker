import getCommandManager from '../backend/commandManager';

const FakeApp = {
    entities: [{
        id: 0,
        name: 'old entity',
        subEntity: 0,
    }],
    subEntities: [{
        id: 0,
        name: 'subEntity',
    }],
    getEntity: function(id) {
        return this.entities.filter((entity) => entity.id === id)[0];
    },
    getSubEntity: function(id) {
        return this.subEntities.filter((entity) => entity.id === id)[0];
    },
    create: jest.fn(function(entity) {
        if (entity) {
            if (entity.subEntity) {
                this.create(subentity)
            }
        } else {
            return {
                id: 1,
                name: 'brand new entity',
            }
        }
    }),
    delete: jest.fn(function(entity) {
        if (entity && entity.hasOwnProperty('subEntity')) {
            this.delete(entity.subEntity)
        }
    }),
    update: jest.fn(),
}

var newFakeApp;
var commandManager;

beforeEach(() => {
    newFakeApp = Object.assign({}, FakeApp);    
    commandManager = Object.create(getCommandManager(newFakeApp)).init(newFakeApp);
});

test('execute', () => {
    const entityToCreate = {
        id: 1,
        name: 'new entity',
    };
    const createEntityAction = commandManager.createAction(['create', entityToCreate], ['delete', entityToCreate])
    commandManager.execute(createEntityAction)

    expect(newFakeApp.create).toBeCalledWith(entityToCreate);
});

test('execute without history', () => {
    const entityToUpdate = Object.assign({},newFakeApp.getEntity(0), {name: 'updated name'});

    const updateEntityAction = commandManager.createAction(['update', entityToUpdate])
    commandManager.execute(updateEntityAction)

    expect(newFakeApp.update).toBeCalledWith(entityToUpdate);
    expect(commandManager._history.length).toBe(0);
});

test('execute without multiple parameters', () => {
    const updateEntityAction = commandManager.createAction(['update', 1, 2])
    commandManager.execute(updateEntityAction)

    expect(newFakeApp.update).toBeCalledWith(1, 2);
});

test('undo', () => {
    const entityToDelete = newFakeApp.getEntity(0);
    const deleteEntityAction = commandManager.createAction(['delete', entityToDelete], ['create', entityToDelete])
    
    commandManager.execute(deleteEntityAction)
    commandManager.undo();

    expect(newFakeApp.delete).toBeCalledWith(entityToDelete);
    expect(newFakeApp.delete).toHaveBeenCalledTimes(2);
    expect(newFakeApp.create).toBeCalledWith(entityToDelete);
    expect(newFakeApp.create).toHaveBeenCalledTimes(2);
});

test('undo very last action', () => {
    const entityToDelete = newFakeApp.getEntity(0);
    const deleteEntityAction = commandManager.createAction(['delete', entityToDelete], ['create', entityToDelete]);
    
    commandManager.execute(deleteEntityAction)
    commandManager.undo();
    const exitCode = commandManager.undo();
    
    expect(exitCode).toBe(null);
});

test('redo', () => {
    const newFakeAppOriginal = Object.assign({}, newFakeApp);
    const entityToDelete = newFakeApp.getEntity(0);
    const deleteEntityAction = commandManager.createAction(['delete', entityToDelete], ['create', entityToDelete]);
    
    commandManager.execute(deleteEntityAction)
    commandManager.undo();
    commandManager.redo();

    expect(newFakeApp.entities.length).toBe(1);
    expect(newFakeApp).toEqual(newFakeAppOriginal);
});

test('redo very last action', () => {
    const entityToDelete = newFakeApp.getEntity(0);
    const deleteEntityAction = commandManager.createAction(['delete', entityToDelete], ['create', entityToDelete]);
    
    commandManager.execute(deleteEntityAction)
    commandManager.undo();
    commandManager.redo();
    const exitCode = commandManager.redo();
    
    expect(exitCode).toBe(null);
});

test('deferred data', () => {
    const createEntityAction = commandManager.createAction(['create'], ['delete'], true);
    
    commandManager.execute(createEntityAction)
    commandManager.undo();
    expect(newFakeApp.entities.length).toBe(1);
});

