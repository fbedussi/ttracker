import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
//import Drawer from 'material-ui/Drawer';

import Home from './Home';
import SingleActivity from './SingleActivity';

const mapStateToProps = (state) => ({
  clients: state.clients,
  activities: state.activities
});

const mapDispatchToProps = (dispatch) => ({
});

class App extends Component {
  render() {
    const { selectedTab, setActiveTab } = this.props;

    return (
      <BrowserRouter>
        <MuiThemeProvider>
          <div className="App">
            <AppBar
              title="tTracker"
            />
            <Route path="/" exact component={Home} />
            <Route path="/activity/:activityId" component={SingleActivity} />
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
