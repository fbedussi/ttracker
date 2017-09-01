import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Tabs, Tab } from 'material-ui/Tabs';

import { setActiveTab } from '../actions';

import ClientTab from './ClientTab';
import ActivityTab from './ActivityTab';

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  setActiveTab: (activeTab) => dispatch(setActiveTab(activeTab))
});

class App extends Component {
  render() {
    const { selectedTab, setActiveTab } = this.props;

    return (
      <Tabs
        value={selectedTab}
        onChange={(selectedTab) => setActiveTab(selectedTab)}
      >
        <Tab label="Clients" value="clients">
          <ClientTab />
        </Tab>
        <Tab label="Projects" value="activities">
          <ActivityTab />
        </Tab>
      </Tabs>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
