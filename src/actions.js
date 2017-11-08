import startAppAndLogin, { startAppAndLoadData } from './backend/app';
import {onErrorReport} from './backend/errorReporter';
const fileSaver = require('file-saver');

var backend;

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
            .then(loadAppData)
            .catch(err => dispatch(showError(err)))
            ;
    };
}

export function importData(jsonData) {
    return function (dispatch) {
        const app = backend
            .loadApp(JSON.parse(jsonData))
            .saveAllDataToDb()
        ;
        
        loadData(dispatch)(app);
    };
}

function loadData(dispatch) {
    return (app) => {
        backend = app;

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

export function createNewClient() {
    try {
        const data = backend.createClient();
    
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
        const data = backend.deleteClient(client.id, deleteActvities);
    
        return {
            type: 'UPDATE_DATA',
            data,
        };
    } catch(e) {
        return showError(e);        
    }
}

export function createNewActivity() {
    try {
        const data = backend.createActivity();
    
        return {
            type: 'UPDATE_DATA',
            data,
            lastCreatedActivityId: data.activities[data.activities.length - 1].id
        };
    } catch(e) {
        return showError(e);        
    }
}

export function addNewActivityToClient(clientId) {
    try {
        const data = backend.addNewActivityToClient(clientId);
    
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
        const data = backend.addSubactivity(activity.id, { name: 'new task' });
    
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
        const data = backend.deleteActivity(activity.id, deleteSubactivities);
    
        return {
            type: 'UPDATE_DATA',
            data
        };
    } catch(e) {
        return showError(e);        
    }
}

export function setActiveTab(activeTab) {
    return {
        type: 'SET_ACTIVE_TAB',
        activeTab: activeTab
    };
}

export function updateClient(client) {
    try {
        const data = backend.updateClient(client);
    
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
        const data = backend.startActivity(activity.id);
    
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
        const data = backend.stopActivity(activity.id);
    
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
        const data = backend.deleteTimeEntry(activity.id, timeEntry.id);
    
        return {
            type: 'UPDATE_DATA',
            data
        };
    } catch(e) {
        return showError(e);        
    }
}

export function updateActivity(activity, newProps) { //TODO: pass newprops only
    try {
        const data = backend.updateActivity(Object.assign(activity, newProps));
    
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
        const data = backend.updateTimeEntry(activity.id, timeEntry);
    
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
        const data = backend.billClient(clientId, billTextTemplate, currency);
    
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
        const data = backend.updateBill(bill);
    
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
        const data = backend.refreshBillText(billId);

        return {
            type: 'UPDATE_DATA',
            data,
        };
    } catch(e) {
        return showError(e);        
    }
}

export function deleteBill(billId) {
    try {
        const data = backend.deleteBill(billId);
    
        return {
            type: 'UPDATE_DATA',
            data
        };
    } catch(e) {
        return showError(e);        
    }
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

export function updateOptions(options) {
    try {
        backend.saveOptions(options);
    
        return {
            type: 'UPDATE_OPTIONS',
            options
        }
    } catch(e) {
        return showError(e);        
    }
}

export function updateSearch(searchText) {
    return {
        type: 'UPDATE_SEARCH',
        searchText,
    }
}

export function exportData() {
    const jsonData = backend.exportData();
    const file = new File([jsonData], "tTrackerExport.json", {type: "text/plain;charset=utf-8"});
    fileSaver.saveAs(file);

    return {
        type: 'DATA_EXPORTED'
    }
}
