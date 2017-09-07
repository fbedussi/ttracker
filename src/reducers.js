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
    activeTab: 'clients'
}, action) {
	switch (action.type) {
		case 'LOAD_APP':
			return Object.assign({}, state, {
                clients: action.clients,
                activities: action.activities
            });
           
        case 'ADD_CLIENT':
            return Object.assign({}, state, {
                clients: state.clients.concat(Object.assign({}, action.client, {editableName: true}))
            });

        case 'REMOVE_CLIENT':
            return Object.assign({}, state, {
                clients: state.clients.filter((client) => client.id !== action.id)
            });
        
        case 'UPDATE_CLIENT':
            return Object.assign({}, state, {
                clients: state.clients.map((client) => client.id === action.client.id ? action.client : client)
            });
        
        case 'ADD_NEW_ACTIVITY_TO_CLIENT':
            return Object.assign({}, state, {
                activities: state.activities.concat(Object.assign({}, action.activity, {editableName: true})),
                clients: state.clients.map((client) => client.id === action.clientId ? 
                    Object.assign({}, client, {
                        activities: client.activities.concat(action.activity.id)
                    })
                    : client)
            })

        case 'DISABLE_EDIT_CLIENT':
            return Object.assign({}, state, {
                clients: state.clients.map((client) => (!action.clientId || client.id === action.clientId) ? Object.assign({}, client, {editableName: false}) : client)
            });

        case 'ADD_ACTIVITY':
            return Object.assign({}, state, {
                activities: state.activities.concat(Object.assign({}, action.activity, {editableName: true}))
            });

        case 'DISABLE_EDIT_ACTIVITY':
            return Object.assign({}, state, {
                activities: state.activities.map((activity) => (!action.activityId || activity.id === action.activityId) ? Object.assign({}, activity, {editableName: false}) : activity)
            });


        case 'REMOVE_ACTIVITY':
            return Object.assign({}, state, {
                activities: state.activities.filter((activity) => activity.id !== action.id),
                clients: state.clients.map((client) => removeActivityFromClient(client, action.id))
            });

        case 'UPDATE_ACTIVITY':
            return Object.assign({}, state, {
                activities: state.activities.map((activity) => activity.id === action.activity.id ? action.activity : activity)
            });

        case 'UPDATE_ACTIVITY_IN_CLIENT':
            return Object.assign({}, state, {
                activities: state.activities.map((activity) => activity.id === action.activity.id ? action.activity : activity),
                clients: state.clients.map((client) => client.id === action.clientId ? Object.assign({}, client, 
                    {
                        activities: client.activities.map((activity) => activity.id === action.activity.id ? action.activity : activity)
                    }
                ) : client)                
            });

        case 'REMOVE_TIMEENTRY':
            return Object.assign({}, state, {
                activities: state.activities.map((activity) => activity.id === removeTimeEntryFromActivity(activity, action.timeEntryId) ? activity: activity)
            });
        
        case 'SET_ACTIVE_TAB':
            return Object.assign({}, state, {
                activeTab: action.activeTab
            });
        
        case 'START_ACTIVITY':
            return Object.assign({}, state, {
                activities: state.activities.map((activity) => activity.id === action.id ? Object.assign({}, activity, {active: true}) : activity)
            });

        case 'STOP_ACTIVITY':
            return Object.assign({}, state, {
                activities: state.activities.map((activity) => activity.id === action.id ? Object.assign({}, activity, {active: false}) : activity)
            });

		default:
			return state;
	}
}
