import React from 'react';
import { connect } from 'react-redux';

import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';

import SearchBox from './SearchBox';

const mapStateToProps = (state) => ({
    toolbarOpen: state.ui.toolbarOpen,
    clients: state.data.clients,
    currency: state.options.currency,
});

const mapDispatchToProps = (dispatch) => ({
});

const AppToolbar = ({toolbarOpen, currency, clients}) => (
    toolbarOpen ?
    <Toolbar>
        <ToolbarGroup>
            <SearchBox/>
        </ToolbarGroup>

        <ToolbarGroup
            lastChild={true}
        >
            <ToolbarTitle text={'Grand total to bill ' + currency + Math.round(clients.reduce((total, client) => total + client.totalCostToBill, 0))} />
        </ToolbarGroup>
    </Toolbar>
    : null
) 

export default connect(mapStateToProps, mapDispatchToProps)(AppToolbar);