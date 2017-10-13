import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, withRouter } from 'react-router-dom'

import {
  toggleUiElement,
  hideError,
} from '../actions';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import ExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import ExpandLessIcon from 'material-ui/svg-icons/navigation/expand-less';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

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
  errorOn: state.ui.errorOn,
  errorMessage: state.ui.errorMessage,
  toolbarOpen: state.ui.toolbarOpen,
});

const mapDispatchToProps = (dispatch) => ({
  toggleUiElement: (element) => dispatch(toggleUiElement(element)),
  hideError: () => dispatch(hideError()),
});

export class App extends Component {
  render() {
    const {
      drawerOpen,
      toggleUiElement,
      errorOn,
      errorMessage,
      hideError,
      toolbarOpen,
    } = this.props;
    return (<MuiThemeProvider>
      <div className="App">
        <AppBar
          className="hideInPrint appbar"
          title="tTracker"
          onTitleTouchTap={() => this.props.history.push('/')}
          iconElementLeft={<IconButton><SettingsIcon /></IconButton>}
          onLeftIconButtonTouchTap={() => toggleUiElement('drawer')}
          iconElementRight={<IconButton>{toolbarOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>}
          onRightIconButtonTouchTap={() => toggleUiElement('toolbar')}
        />
        <Drawer
          docked={false}
          open={drawerOpen}
          width={300}
          onRequestChange={() => toggleUiElement('drawer')}
        >
          <OptionsPane />
        </Drawer>
        <Dialog
          title="Error"
          modal={false}
          open={errorOn}
          onRequestClose={() => hideError()}
          actions={<RaisedButton label="Close" onClick={() => hideError()} />}
        >
          {errorMessage}
        </Dialog>
        <Route path="/" exact component={Home} />
        <Route path="/activity/:activityId" component={SingleActivity} />
        <Route path="/client/:clientId" component={SingleClient} />
        <Route path="/bill/:billId" component={SingleBill} />
      </div>
    </MuiThemeProvider>);
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
