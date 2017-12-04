import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom'

import { App } from '../components/App';

jest.mock('../db/dbInterface');
jest.mock('../helpers/idMaker');
jest.mock('../components/Home', () => () => null)

const store = {
  subscribe: () => { },
  dispatch: () => { },
  getState: () => ({
    data: {
      clients: [],
      activities: [],
      bills: [],
    },
    options: {},
    ui: {
      activeTab: 'clients',
      undoSnackbarOpen: false,
      undoMessage: '',
    }
  })
};

const props = {
  drawerOpen: false,
  toggleUiElement: () => {},
  errorOn: false,
  errorMessage: '',
  hideError: '',
  toolbarOpen: false,
  history,
}

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Provider store={store}>
    <BrowserRouter>
      <App {...props}/>
    </BrowserRouter>
  </Provider>
    , div);
});
