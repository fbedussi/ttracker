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
    selectNewEndTimeForTimeEntry: null,
    timeEntriesRegistryAsTable: false
}, action) {
	switch (action.type) {
		case 'LOAD_APP':
			return Object.assign({}, state, {
                clients: action.clients,
                activities: action.activities
            });
           
        case 'UPDATE_DATA':
            return Object.assign({}, state, {
                clients: action.data.clients,
                activities: action.data.activities
            });
        
        case 'DISABLE_EDIT_CLIENT':
            return Object.assign({}, state, {
                clients: state.clients.map((client) => (!action.clientId || client.id === action.clientId) ? Object.assign({}, client, {editableName: false}) : client)
            });

        case 'ENABLE_EDIT_ACTIVITY_NAME':
            return Object.assign({}, state, {
                activities: state.activities.map((activity) => activity.id === action.activityId ? 
                    Object.assign({}, activity, {editableName: true})
                    : activity
                )
            });

        case 'DISABLE_EDIT_ACTIVITY':
            return Object.assign({}, state, {
                activities: state.activities.map((activity) => (!action.activityId || activity.id === action.activityId) ? 
                    Object.assign({}, activity, {editableName: false}) 
                    : activity
                )
            });

        case 'SET_ACTIVE_TAB':
            return Object.assign({}, state, {
                activeTab: action.activeTab
            });
        
        case 'TOGGLE_TIMEENTRIES_REGISTRY_AS_TABLE':
            return Object.assign({}, state, {
                timeEntriesRegistryAsTable: !state.timeEntriesRegistryAsTable
            });


		default:
			return state;
	}
}