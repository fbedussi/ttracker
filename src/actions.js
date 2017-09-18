import loadBackend from './backend/app';
import { getOnlyOwnProperies } from './helpers/helpers';

var backend;

export function load() {
    return function (dispatch) {
        loadBackend()
            .then((app) => {
                backend = app;

                dispatch({
                    type: 'LOAD_APP',
                    clients: backend.clients,
                    activities: backend.activities
                });
            })
            ;
    };
}

export function createNewClient() {
    const data = backend.createClient();

    return {
        type: 'UPDATE_DATA',
        data
    };
}

export function deleteClient(client) {
    const data = backend.deleteClient(client.id);

    return {
        type: 'UPDATE_DATA',
        data
    };
}

export function createNewActivity() {
    const data = backend.createActivity();

    return {
        type: 'UPDATE_DATA',
        data
    };
}

export function addNewActivityToClient(clientId) {
    const data = backend.addNewActivityToClient(clientId);

    return {
        type: 'UPDATE_DATA',
        data
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
        type: 'UPDATE_DATA',
        data
    };
}

export function stopActivity(activityId) {
    const data = backend.startActivity(activityId);

    return {
        type: 'UPDATE_DATA',
        data
    };
}

export function deleteTimeEntry(timeEntry, activity) {
    const data = backend.deleteTimeEntry(activity.id, timeEntry);

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

export function enabelEditActivityName(activityId) {
    return {
        type: 'ENABLE_EDIT_ACTIVITY_NAME',
        activityId: activityId
    }
}

export function disableEditActivity(id) {
    return {
        type: 'DISABLE_EDIT_ACTIVITY',
        activityId: id
    }
}

export function disableEditClient(id) {
    return {
        type: 'DISABLE_EDIT_CLIENT',
        clientId: id
    }
}

export function updateTimeEntry(props) { //TODO
    //backend.get

    return {
        type: 'UPDATE_TIME_ENTRY',
        props
    };
}

export function toggleTimeEntriesRegistryAsTable() {
    return {
        type: 'TOGGLE_TIMEENTRIES_REGISTRY_AS_TABLE',
    };
}