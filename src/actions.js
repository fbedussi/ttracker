import startAppAndLogin, { startAppAndLoadData } from './backend/app';
import {onErrorReport} from './backend/errorReporter';
import getCommandManager from './backend/commandManager';

const fileSaver = require('file-saver');

var commandManager;

export function login(loginData) {    
    return function (dispatch) {
        const loadAppData = loadData(dispatch);

        startAppAndLogin(loginData)
            .then(loadAppData)
            .catch(err => dispatch(showError(err)))
            ;
    };
}

export function load() {
    return function (dispatch) {
        const loadAppData = loadData(dispatch);

        startAppAndLoadData()
            .then((app) => {
                loadAppData(app);
            })
            .catch(err => dispatch(showError(err)))
            ;
    };
}

export function importData(jsonData) {
    return function (dispatch) {
        const backend = commandManager.getApp();
        const app = backend
            .loadApp(JSON.parse(jsonData))
            .saveAllDataToDb()
        ;
        
        loadData(dispatch)(app);
    };
}

function loadData(dispatch) {
    return (app) => {
        commandManager = getCommandManager(app);

        onErrorReport((error) => dispatch(showError(error)));

        const data = app.exportForClient();

        dispatch({
            type: 'UPDATE_DATA',
            data
        });

        dispatch({
            type: 'UPDATE_OPTIONS',
            options: Object.assign({}, app.options, { logged: true })
        });
    }
}

export function undoLastAction() {
    try {
        const data = commandManager.undo();
    
        return {
            type: 'UPDATE_DATA',
            data,
        };
    } catch(e) {
        return showError(e);
    }
}

export function createNewClient() {
    try {
        const createClientAction = commandManager.createAction(['createClient']);
        const data = commandManager.execute(createClientAction);
    
        return {
            type: 'UPDATE_DATA',
            data,
            lastCreatedClientId: data.clients[data.clients.length - 1].id
        };
    } catch(e) {
        return showError(e);
    }
}

export function deleteClient(client, deleteActvities) {
    try {
        const deleteClientAction = commandManager.createAction(['deleteClient', client], ['createClient', client]);        
        const data = commandManager.execute(deleteClientAction);
    
        return {
            type: 'UPDATE_DATA',
            data,
            undoable: true,
            undoMessage: 'Client deleted'
        };
    } catch(e) {
        return showError(e);        
    }
}

export function createNewActivity() {
    try {
        const createActivityAction = commandManager.createAction(['createActivity']);
        const data = commandManager.execute(createActivityAction);
    
        return {
            type: 'UPDATE_DATA',
            data,
            lastCreatedActivityId: data.activities[data.activities.length - 1].id
        };
    } catch(e) {
        return showError(e);        
    }
}

export function deleteActivity(activity, deleteSubactivities = false) {
    try {
        const deleteActivityAction = commandManager.createAction(['deleteActivity', activity], ['createActivity', activity]);
        const data = commandManager.execute(deleteActivityAction);

        return {
            type: 'UPDATE_DATA',
            data,
            undoable: true,
            undoMessage: 'Activity deleted'
        };
    } catch(e) {
        return showError(e);        
    }
}

export function addNewActivityToClient(clientId) {
    try {
        const addNewActivityToClientAction = commandManager.createAction(['addNewActivityToClient', clientId]);
        const data = commandManager.execute(addNewActivityToClientAction);

        return {
            type: 'UPDATE_DATA',
            data,
            lastCreatedActivityId: data.activities[data.activities.length - 1].id
        };
    } catch(e) {
        return showError(e);        
    }
}

export function addSubactivity(activity) {
    try {
        const addSubactivityAction = commandManager.createAction(['addSubactivity', activity.id, { name: 'new task' }]);
        const data = commandManager.execute(addSubactivityAction);
    
        return {
            type: 'UPDATE_DATA',
            data,
            lastCreatedActivityId: data.activities[data.activities.length - 1].id
        };
    } catch(e) {
        return showError(e);        
    }
}

export function updateClient(updatedClient) {
    try {
        const updateClientAction = commandManager.createAction(['updateClient', updatedClient]);
        const data = commandManager.execute(updateClientAction);

        return {
            type: 'UPDATE_DATA',
            data
        };
    } catch(e) {
        return showError(e);        
    }
}

export function startActivity(activity) {
    try {
        const startActivityAction = commandManager.createAction(['startActivity', activity.id]);
        const data = commandManager.execute(startActivityAction);

        return {
            type: 'START_ACTIVITY',
            activityId: activity.id,
            data
        };
    } catch(e) {
        return showError(e);        
    }
}

export function stopActivity(activity) {
    try {
        const stopActivityAction = commandManager.createAction(['stopActivity', activity.id]);
        const data = commandManager.execute(stopActivityAction);

        return {
            type: 'STOP_ACTIVITY',
            activityId: activity.id,
            data
        };
    } catch(e) {
        return showError(e);        
    }
}

export function deleteTimeEntry(activity, timeEntry) {
    try {
        const deleteTimeEntryAction = commandManager.createAction(['deleteTimeEntry', activity.id, timeEntry.id], ['addTimeEntry', activity.id, timeEntry]);
        const data = commandManager.execute(deleteTimeEntryAction);

        return {
            type: 'UPDATE_DATA',
            data,
            undoable: true,
            undoMessage: 'Time entry deleted'
        };
    } catch(e) {
        return showError(e);        
    }
}

export function updateActivity(activity, newProps) { //TODO: pass newprops only
    try {
        const updateActivityAction = commandManager.createAction(['updateActivity', Object.assign(activity, newProps)], ['updateActivity', activity]);
        const data = commandManager.execute(updateActivityAction);

        return {
            type: 'UPDATE_DATA',
            data
        };
    } catch(e) {
        return showError(e);        
    }
}

export function updateTimeEntry(activity, timeEntry) {
    try {
        const updateTimeEntryAction = commandManager.createAction(['updateTimeEntry', activity.id, timeEntry]);
        const data = commandManager.execute(updateTimeEntryAction);
    
        return {
            type: 'UPDATE_DATA',
            data
        };
    } catch(e) {
        return showError(e);        
    }
}

export function createNewBill(clientId, billTextTemplate, currency) {
    try {
        const createNewBillAction = commandManager.createAction(['billClient', clientId, billTextTemplate, currency]);
        const data = commandManager.execute(createNewBillAction);

        return {
            type: 'UPDATE_DATA',
            data
        };
    } catch(e) {
        return showError(e);        
    }
}

export function updateBill(bill) {
    try {
        const updateBillAction = commandManager.createAction(['updateBill', bill]);
        const data = commandManager.execute(updateBillAction);

        return {
            type: 'UPDATE_DATA',
            data,
            lastUpdatedBillId: bill.id
        };
    } catch(e) {
        return showError(e);        
    }
}

export function refreshBillText(billId) {
    try {
        const refreshBillTextAction = commandManager.createAction(['refreshBillText', billId]);
        const data = commandManager.execute(refreshBillTextAction);

        return {
            type: 'UPDATE_DATA',
            data,
        };
    } catch(e) {
        return showError(e);        
    }
}

export function deleteBill(bill) {
    try {
        const deleteBillAction = commandManager.createAction(['deleteBill', bill], ['billClient', bill.client.id, bill.textTemplate, bill.currency]);
        const data = commandManager.execute(deleteBillAction);

        return {
            type: 'UPDATE_DATA',
            data,
            undoable: true,
            undoMessage: 'Bill deleted'
        };
    } catch(e) {
        return showError(e);        
    }
}

export function updateOptions(options) {
    try {
        const saveOptionsAction = commandManager.createAction(['saveOptions', options]);
        commandManager.execute(saveOptionsAction);

        return {
            type: 'UPDATE_OPTIONS',
            options
        }
    } catch(e) {
        return showError(e);        
    }
}

//UI
export function setActiveTab(activeTab) {
    return {
        type: 'SET_ACTIVE_TAB',
        activeTab: activeTab
    };
}

export function toggleUiElement(element) {
    switch (element) {
        case 'drawer':
            return {
                type: 'TOGGLE_DRAWER'
            }
        
        case 'toolbar':
            return {
                type: 'TOGGLE_TOOLBAR'
            }

        default:
    }
}

export function updateSearch(searchText) {
    return {
        type: 'UPDATE_SEARCH',
        searchText,
    }
}

export function exportData() {
    const exportDataAction = commandManager.createAction(['exportData']);
    const jsonData = commandManager.execute(exportDataAction);
    const file = new File([jsonData], "tTrackerExport.json", {type: "text/plain;charset=utf-8"});
    fileSaver.saveAs(file);

    return {
        type: 'DATA_EXPORTED'
    }
}

export function showError(error) {
    return {
        type: 'SHOW_ERROR',
        permanent: true,
        error
    };
}

export function hideError(error) {
    return {
        type: 'HIDE_ERROR',
    };
}

export function closeUndoSnackbar() {
    return {
        type: 'CLOSE_UNDOSNACKBAR',
    };
}