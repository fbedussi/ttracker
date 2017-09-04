function removeTimeEntryFromActivity(activity, timeEntryId) {
    activity.timeEntries = activity.timeEntries.filter((timeEntry) => timeEntry.id !== timeEntryId);

    return activity;
}

export default function reducer(state = {
    clients: [],
    activities: [],
    activeTab: 'clients'
}, action) {
	switch (action.type) {
		case 'LOAD_APP':
			return Object.assign({}, state, {
                clients: action.clients.map((i) => i),
                activities: action.activities.map((i) => i)
            });
           
        case 'ADD_CLIENT':
            return Object.assign({}, state, {
                clients: state.clients.concat(action.client)
            });

        case 'REMOVE_CLIENT':
            return Object.assign({}, state, {
                clients: state.clients.filter((client) => client.id !== action.id)
            });

        case 'ADD_ACTIVITY':
            return Object.assign({}, state, {
                activities: state.activities.concat(action.activity)
            });

        case 'REMOVE_ACTIVITY':
            return Object.assign({}, state, {
                activities: state.activities.filter((activity) => activity.id !== action.id)
            });

        case 'REMOVE_TIMEENTRY':
            return Object.assign({}, state, {
                activities: state.activities.map((activity) => activity.id === removeTimeEntryFromActivity(activity, action.timeEntryId) ? activity: activity)
            });
        
        case 'SET_ACTIVE_TAB':
            return Object.assign({}, state, {
                activeTab: action.activeTab
            });
        
        case 'UPDATE_CLIENT':
            return Object.assign({}, state, {
                clients: state.clients.map((client) => client.id === action.client.id ? action.client : client)
            });
        
        case 'START_ACTIVITY':
            return Object.assign({}, state, {
                activities: state.activities.map((activity) => activity.id === action.id ? Object.assign(activity, {active: true}) : activity)
            });

        case 'STOP_ACTIVITY':
            return Object.assign({}, state, {
                activities: state.activities.map((activity) => activity.id === action.id ? Object.assign(activity, {active: false}) : activity)
            });

		default:
			return state;
	}
}
