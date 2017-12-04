export function dataReducer(state = {
    clients: [],
    bills: [],
    activities: [],
}, action) {
	switch (action.type) {
        case 'UPDATE_DATA':
            return Object.assign({}, state, {
                clients: action.data.clients,
                activities: action.data.activities,
                bills: action.data.bills
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
    drawerOpen: false,
    ongoingActivities: [],
    selectNewEndTimeForTimeEntry: null,
    timeEntriesRegistryAsTable: false,
    lastCreatedActivityId: undefined,
    errorOn: false,
    errorMessage: '',
    dialogTitle: '',
    dialogMessage: '',
    dialogOk: null,
    dialogOn: false,
    searchText: '',
    toolbarOpen: false,
    undoSnackbarOpen: false,
}, action) {
	switch (action.type) {
        case 'UPDATE_DATA':
            return Object.assign({}, state, {
                lastCreatedActivityId: action.lastCreatedActivityId,
                lastCreatedClientId: action.lastCreatedClientId,
                lastUpdatedBillId: action.lastUpdatedBillId,
                undoable: Boolean(action.undoable),
                undoMessage: action.undoMessage ? action.undoMessage : '',
                undoSnackbarOpen: !!action.undoable,
            });

        case 'SET_ACTIVE_TAB':
            return Object.assign({}, state, {
                activeTab: action.activeTab,
                searchText: '',
            });
        
        case 'START_ACTIVITY':
            return Object.assign({}, state, {
                ongoingActivities: state.ongoingActivities.concat(action.activityId)
            });

        case 'STOP_ACTIVITY':
            return Object.assign({}, state, {
                ongoingActivities: state.ongoingActivities.filter((ongoingActivityId) => ongoingActivityId !== action.activityId)
            });

        case 'TOGGLE_DRAWER':
            return Object.assign({}, state, {
                drawerOpen: !state.drawerOpen
            });

        case 'TOGGLE_TOOLBAR':
            return Object.assign({}, state, {
                toolbarOpen: !state.toolbarOpen
            });

        case 'SHOW_ERROR':
            return Object.assign({}, state, {errorOn: true, errorMessage: action.error.message ? action.error.message : action.error});

        case 'HIDE_ERROR':
            return Object.assign({}, state, {errorOn: false, errorMessage: ''});

        case 'UPDATE_SEARCH':
            return Object.assign({}, state, {searchText: action.searchText});
            
        case 'CLOSE_UNDOSNACKBAR':
        return Object.assign({}, state, {undoSnackbarOpen: false});

		default:
			return state;
	}
}

export function optionsReducer(state = {
    logged: false,
    currency: '€',
    billTextTemplate: '${clientName}\n${clientAddress}\n${clientVatNumber}\n\ndate: ${date}\n\nthe invoice total is ${currency}${total}.\nfor the following activities: ${activities}.',
    defaultHourlyRate: 0,
    allowZeroTotalBill: false,
    timeEntriesRegistryAsTable: false,
    undoSnackbarAutoHideDuration: 10000,
}, action) {
	switch (action.type) {
        case 'UPDATE_OPTIONS':
            return Object.assign({}, state, action.options);

        default:
			return state;
	}
}