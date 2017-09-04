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

    return addNewActivity(activity);
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