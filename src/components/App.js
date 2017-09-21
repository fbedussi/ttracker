import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
//import Drawer from 'material-ui/Drawer';

import Home from './Home';
import SingleActivity from './SingleActivity';
import SingleClient from './SingleClient';

import '../style/app.css';
import Style from '../style/Style.js';

const mapStateToProps = (state) => ({
  clients: state.data.clients,
  activities: state.data.activities
});

const mapDispatchToProps = (dispatch) => ({
});

export class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider>
          <div className="App">
            <Style></Style>
            <AppBar
              title="tTracker"
            />
            <Route path="/" exact component={Home} />
            <Route path="/activity/:activityId" component={SingleActivity} />
            <Route path="/client/:clientId" component={SingleClient} />
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
