import React from 'react';
import { connect } from 'react-redux';

import { Tabs, Tab } from 'material-ui/Tabs';

import { setActiveTab } from '../actions';

import ClientTab from './ClientTab';
import ActivityTab from './ActivityTab';
import BillTab from './BillTab';
import LoginForm from './LoginForm';

const mapStateToProps = (state) => ({
  activeTab: state.ui.activeTab,
  logged: state.options.logged,
});

const mapDispatchToProps = (dispatch) => ({
  setActiveTab: (activeTab) => dispatch(setActiveTab(activeTab))
});

const Home = ({ history, activeTab, setActiveTab, logged }) => (logged ? 
    <div>
      <Tabs
        value={activeTab}
        onChange={(selectedTab) => setActiveTab(selectedTab)}
      >
        <Tab label="Clients" value="clients">
          <ClientTab history={history}/>
        </Tab>
        <Tab label="Projects" value="activities">
          <ActivityTab history={history}/>
        </Tab>
        <Tab label="Bills" value="bills">
          <BillTab history={history}/>
        </Tab>
      </Tabs>
    </div>
    : <LoginForm />)
  
export default connect(mapStateToProps, mapDispatchToProps)(Home);
