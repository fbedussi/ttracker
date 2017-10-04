import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import {App} from './components/App';

jest.mock('./db/dbFacade');
jest.mock('./helpers/idMaker');
jest.mock('./components/Home', () => () => null) 

const store = {
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({
    clients: [],
    activities: [],
    activeTab: 'clients',
    options: {},
  })
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Provider store={store}>
      <App />
    </Provider>
    , div);
});
