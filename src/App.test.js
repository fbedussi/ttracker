import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './components/App';

jest.mock('./db/dbFacade');
jest.mock('./helpers/idMaker');
jest.mock('./components/Home', () => () => null) 

const store = {
  clients: [],
  activities: [],
  activeTab: 'clients'
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App store={store}/>, div);
});
