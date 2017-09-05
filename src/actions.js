import loadBackend from './backend/app';
import {getOnlyOwnProperies} from './helpers/helpers';

var backend;

export function load() {
    return function (dispatch) {
        loadBackend()
            .then((app) => {
                backend = app;
                
                dispatch({
                    type: 'LOAD_APP', 
                    clients: backend.clients.map((client) => getOnlyOwnProperies(client)),
                    activities: backend.activities.map((activity) => getOnlyOwnProperies(activity))
                });
            })
        ;
    };
}

export function createNewClient() {
    const client = backend.createNewClient();

    return {
        type: 'ADD_CLIENT',
        client: getOnlyOwnProperies(client)
    }
}

export function deleteClient(client) {
    backend.getClient(client.id).delete();

    return {
        type: 'REMOVE_CLIENT',
        id: client.id
    }
}

export function addNewActivity(activity) {
    return {
        type: 'ADD_ACTIVITY',
        activity
    }
}

export function createNewActivity() {
    const activity = backend.createNewActivity();

    return addNewActivity(getOnlyOwnProperies(activity));
}

export function addNewActivityToClient(clientId) {
    const activity = backend.addNewActivityToClient(clientId);

    return {
        type: 'ADD_NEW_ACTIVITY_TO_CLIENT',
        clientId: clientId,
        activity: getOnlyOwnProperies(activity)
    }
}

export function deleteActivity(activity) {
    backend.getActivity(activity.id).delete();

    return {
        type: 'REMOVE_ACTIVITY',
        id: activity.id
    }
}

export function setActiveTab(activeTab) {
    return {
        type: 'SET_ACTIVE_TAB',
        activeTab: activeTab
    }
}

export function updateClient(client) {
    return {
        type: 'UPDATE_CLIENT',
        client
    }
}

export function startActivity(activity) {
    backend.getActivity(activity.id).start();

    return {
        type: 'START_ACTIVITY',
        id: activity.id
    }
}

export function stopActivity(activity) {
    backend.getActivity(activity.id).stop();

    return {
        type: 'STOP_ACTIVITY',
        id: activity.id
    }
}

export function deleteTimeEntry(timeEntry, activity) {
    backend.getActivity(activity.id).removeTimeEntry(timeEntry.id);

    return {
        type: 'REMOVE_TIMEENTRY',
        timeEntryId: timeEntry.id,
        activityId: activity.id
    }
}

export function changeActivityName(activity, newName) {
    backend.getActivity(activity.id).update({name: newName});
    
    const updatedActivity = Object.assign({}, activity, {name: newName});

    return {
        type: 'UPDATE_ACTIVITY',
        activity: updatedActivity
    }
}

export function disableEditActivity(id) {
    return {
        type: 'DISABLE_EDIT_ACTIVITY',
        activityId: id
    }
}

export function changeClientName(client, newName) {
    backend.getClient(client.id).update({name: newName});
    
    const updatedClient = Object.assign({}, client, {name: newName});

    return {
        type: 'UPDATE_CLIENT',
        client: updatedClient
    }
}

export function disableEditClient(id) {
    return {
        type: 'DISABLE_EDIT_CLIENT',
        clientId: id
    }
}