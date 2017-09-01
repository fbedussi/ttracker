import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

jest.mock('./db/dbFacade');
jest.mock('./helpers/idMaker');

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
