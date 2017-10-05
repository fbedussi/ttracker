import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, withRouter } from 'react-router-dom'

import { toggleDrawer } from '../actions';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import Drawer from 'material-ui/Drawer';

import Home from './Home';
import SingleActivity from './SingleActivity';
import SingleClient from './SingleClient';
import SingleBill from './SingleBill';
import OptionsPane from './OptionsPane';

import '../style/app.css';
import Style from '../style/Style.js';

const mapStateToProps = (state) => ({
  clients: state.data.clients,
  activities: state.data.activities,
  drawerOpen: state.ui.drawerOpen,
});

const mapDispatchToProps = (dispatch) => ({
  toggleDrawer: () => dispatch(toggleDrawer()),
});

export class App extends Component {
  render() {
    const {
      drawerOpen,
      toggleDrawer,
    } = this.props;
    return (
      
        <MuiThemeProvider>
          <div className="App">
            <AppBar
              className="hideInPrint appbar"
              title="tTracker"
              onTitleTouchTap={() => this.props.history.push('/')}
              onLeftIconButtonTouchTap={() => toggleDrawer()}
              iconElementLeft={<IconButton><SettingsIcon /></IconButton>}
            />
            <Drawer
              docked={false}
              open={drawerOpen}
              width={300}
              onRequestChange={() => toggleDrawer()}
            >
              <OptionsPane />
            </Drawer>
            <Route path="/" exact component={Home} />
            <Route path="/activity/:activityId" component={SingleActivity} />
            <Route path="/client/:clientId" component={SingleClient} />
            <Route path="/bill/:billId" component={SingleBill} />
          </div>
        </MuiThemeProvider>

    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
