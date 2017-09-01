import loadBackend from './backend/app'

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
    const client = backend.createNewClient();

    return {
        type: 'ADD_CLIENT',
        client
    }
}

export function deleteClient(client) {
    client.delete();

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

    return addNewActivity(activity);
}

export function deleteActivity(activity) {
    activity.delete();

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
    activity.start();

    return {
        type: 'START_ACTIVITY',
        id: activity.id
    }
}

export function stopActivity(activity) {
    activity.stop();

    return {
        type: 'STOP_ACTIVITY',
        id: activity.id
    }
}