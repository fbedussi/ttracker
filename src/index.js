import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { dataReducer, uiReducer, optionsReducer } from './reducers';
import { load } from './actions';

import App from './components/App';
//import registerServiceWorker from './registerServiceWorker';

const store = createStore(combineReducers({
    data: dataReducer,
    ui: uiReducer,
    options: optionsReducer
}), applyMiddleware(thunkMiddleware));

function run() {
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>, document.getElementById('root'));
}

store.subscribe(run);
store.dispatch(load());
