import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, withRouter } from 'react-router-dom'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
//import Drawer from 'material-ui/Drawer';

import Home from './Home';
import SingleActivity from './SingleActivity';
import SingleClient from './SingleClient';
import SingleBill from './SingleBill';

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
      <div className="App">
        <AppBar
          title="tTracker"
          onTitleTouchTap={() => this.props.history.push('/')}
        />
        <Route path="/" exact component={Home} />
        <Route path="/activity/:activityId" component={SingleActivity} />
        <Route path="/client/:clientId" component={SingleClient} />
        <Route path="/bill/:billId" component={SingleBill} />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
