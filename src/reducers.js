function removeTimeEntryFromActivity(activity, timeEntryId) {
    activity.timeEntries = activity.timeEntries.filter((timeEntry) => timeEntry.id !== timeEntryId);

    return activity;
}

function removeActivityFromClient(client, activityId) {
    client.activities = client.activities.filter((id) => id !== activityId);

    return client;
}

export default function reducer(state = {
    clients: [],
    activities: [],
    activeTab: 'clients',
    currency: '€',
    ongoingActivities: [],
    selectNewEndTimeForTimeEntry: null,
    timeEntriesRegistryAsTable: false
}, action) {
	switch (action.type) {
        case 'UPDATE_DATA':
            return Object.assign({}, state, {
                clients: action.data.clients,
                activities: action.data.activities
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
                clients: action.data.clients,
                activities: action.data.activities,
                ongoingActivities: state.ongoingActivities.concat(action.activityId)
            });

        case 'STOP_ACTIVITY':
            return Object.assign({}, state, {
                clients: action.data.clients,
                activities: action.data.activities,
                ongoingActivities: state.ongoingActivities.filter((ongoingActivityId) => ongoingActivityId !== action.activityId)
            });

		default:
			return state;
	}
}