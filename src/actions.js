import loadBackend from './backend/app';
import { getOnlyOwnProperies } from './helpers/helpers';

var backend;

export function load() {
    return function (dispatch) {
        loadBackend()
            .then((app) => {
                backend = app;

                const data = app.exportForClient();

                dispatch({
                    type: 'UPDATE_DATA',
                    data
                });
            })
            ;
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

export function deleteClient(client) {
    const data = backend.deleteClient(client.id);

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

export function addNewActivityToClient(client) {
    const data = backend.addNewActivityToClient(client.id);

    return {
        type: 'UPDATE_DATA',
        data,
        lastCreatedActivityId: data.activities[data.activities.length - 1].id        
    };
}

export function addSubactivity(activity) {
    const data = backend.addSubactivity(activity.id, {name: 'new task'});

    return {
        type: 'UPDATE_DATA',
        data,
        lastCreatedActivityId: data.activities[data.activities.length - 1].id        
    };
}

export function deleteActivity(activity) {
    const data = backend.deleteActivity(activity.id);

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
        data
    };
}

export function deleteBill(billId) {
    const data = backend.deleteBill(billId);

    return {
        type: 'UPDATE_DATA',
        data
    };
}

export function toggleTimeEntriesRegistryAsTable() {
    return {
        type: 'TOGGLE_TIMEENTRIES_REGISTRY_AS_TABLE',
    };
}
