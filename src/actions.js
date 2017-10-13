import StartAppAndLogin, { StartAppAndLoadData } from './backend/app';
import { getOnlyOwnProperies } from './helpers/helpers';

var backend;

export function login(loginData) {    
    return function (dispatch) {
        const loadAppData = loadData(dispatch);

        StartAppAndLogin(loginData)
            .then(loadAppData)
            .catch(err => dispatch(showError(err)))
            ;
    };
}

export function load() {
    return function (dispatch) {
        const loadAppData = loadData(dispatch);

        StartAppAndLoadData()
            .then(loadAppData)
            .catch(err => dispatch(showError(err)))
            ;
    };
}

function loadData(dispatch) {
    return (app) => {
        backend = app;

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
    const data = backend.createClient();

    return {
        type: 'UPDATE_DATA',
        data,
        lastCreatedClientId: data.clients[data.clients.length - 1].id
    };
}

export function deleteClient(client, deleteActvities) {
    const data = backend.deleteClient(client.id, deleteActvities);

    return {
        type: 'UPDATE_DATA',
        data,
    };
}

export function createNewActivity() {
    const data = backend.createActivity();

    return {
        type: 'UPDATE_DATA',
        data,
        lastCreatedActivityId: data.activities[data.activities.length - 1].id
    };
}

export function addNewActivityToClient(clientId) {
    const data = backend.addNewActivityToClient(clientId);

    return {
        type: 'UPDATE_DATA',
        data,
        lastCreatedActivityId: data.activities[data.activities.length - 1].id
    };
}

export function addSubactivity(activity) {
    const data = backend.addSubactivity(activity.id, { name: 'new task' });

    return {
        type: 'UPDATE_DATA',
        data,
        lastCreatedActivityId: data.activities[data.activities.length - 1].id
    };
}

export function deleteActivity(activity, deleteSubactivities = false) {
    const data = backend.deleteActivity(activity.id, deleteSubactivities);

    return {
        type: 'UPDATE_DATA',
        data
    };
}

export function setActiveTab(activeTab) {
    return {
        type: 'SET_ACTIVE_TAB',
        activeTab: activeTab
    };
}

export function updateClient(client) {
    const data = backend.updateClient(client);

    return {
        type: 'UPDATE_DATA',
        data
    };
}

export function startActivity(activity) {
    const data = backend.startActivity(activity.id);

    return {
        type: 'START_ACTIVITY',
        activityId: activity.id,
        data
    };
}

export function stopActivity(activity) {
    const data = backend.stopActivity(activity.id);

    return {
        type: 'STOP_ACTIVITY',
        activityId: activity.id,
        data
    };
}

export function deleteTimeEntry(activity, timeEntry) {
    const data = backend.deleteTimeEntry(activity.id, timeEntry.id);

    return {
        type: 'UPDATE_DATA',
        data
    };
}

export function updateActivity(activity, newProps) { //TODO: pass newprops only
    const data = backend.updateActivity(Object.assign(activity, newProps));

    return {
        type: 'UPDATE_DATA',
        data
    };
}

export function updateTimeEntry(activity, timeEntry) {
    const data = backend.updateTimeEntry(activity.id, timeEntry);

    return {
        type: 'UPDATE_DATA',
        data
    };
}

export function createNewBill(clientId, billTextTemplate, currency) {
    const data = backend.billClient(clientId, billTextTemplate, currency);

    return {
        type: 'UPDATE_DATA',
        data
    };
}

export function updateBill(bill) {
    const data = backend.updateBill(bill);

    return {
        type: 'UPDATE_DATA',
        data,
        lastUpdatedBillId: bill.id
    };
}

export function refreshBillText(billId) {
    const data = backend.refreshBillText(billId);

    return {
        type: 'UPDATE_DATA',
        data,
    };
}

export function deleteBill(billId) {
    const data = backend.deleteBill(billId);

    return {
        type: 'UPDATE_DATA',
        data
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
    }
}

export function updateOptions(options) {
    backend.saveOptions(options);

    return {
        type: 'UPDATE_OPTIONS',
        options
    }
}

export function updateSearch(searchText) {
    return {
        type: 'UPDATE_SEARCH',
        searchText,
    }
}