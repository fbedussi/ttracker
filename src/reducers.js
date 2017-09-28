function removeTimeEntryFromActivity(activity, timeEntryId) {
    activity.timeEntries = activity.timeEntries.filter((timeEntry) => timeEntry.id !== timeEntryId);

    return activity;
}

function removeActivityFromClient(client, activityId) {
    client.activities = client.activities.filter((id) => id !== activityId);

    return client;
}

export function dataReducer(state = {
    clients: [],
    activities: [],
}, action) {
	switch (action.type) {
        case 'UPDATE_DATA':
            return Object.assign({}, state, {
                clients: action.data.clients,
                activities: action.data.activities
            });
        
        case 'START_ACTIVITY':
            return Object.assign({}, state, {
                clients: action.data.clients,
                activities: action.data.activities
            });

        case 'STOP_ACTIVITY':
            return Object.assign({}, state, {
                clients: action.data.clients,
                activities: action.data.activities
            });

		default:
			return state;
	}
}

export function uiReducer(state = {
    activeTab: 'clients',
    ongoingActivities: [],
    selectNewEndTimeForTimeEntry: null,
    timeEntriesRegistryAsTable: false,
    lastCreatedActivityId: undefined,
}, action) {
	switch (action.type) {
        case 'UPDATE_DATA':
            return Object.assign({}, state, {
                lastCreatedActivityId: action.lastCreatedActivityId,
                lastCreatedClientId: action.lastCreatedClientId
            });

        case 'SET_ACTIVE_TAB':
            return Object.assign({}, state, {
                activeTab: action.activeTab
            });
        
        case 'TOGGLE_TIMEENTRIES_REGISTRY_AS_TABLE':
            return Object.assign({}, state, {
                timeEntriesRegistryAsTable: !state.timeEntriesRegistryAsTable
            });
        
        case 'START_ACTIVITY':
            return Object.assign({}, state, {
                ongoingActivities: state.ongoingActivities.concat(action.activityId)
            });

        case 'STOP_ACTIVITY':
            return Object.assign({}, state, {
                ongoingActivities: state.ongoingActivities.filter((ongoingActivityId) => ongoingActivityId !== action.activityId)
            });

		default:
			return state;
	}
}

export function optionsReducer(state = {
    currency: '€',
    billTextTemplate: '${clientName}\n${clientAddress}\n${clientVatNumber}\n\ndate: ${date}\n\nthe invoice total is ${currency}${total}.\nfor the following activities: ${activities}.',
}, action) {
	switch (action.type) {
		default:
			return state;
	}
}