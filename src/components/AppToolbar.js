import React from 'react';
import { connect } from 'react-redux';

import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';

import SearchBox from './SearchBox';

const mapStateToProps = (state) => ({
    toolbarOpen: state.ui.toolbarOpen,
});

const mapDispatchToProps = (dispatch) => ({
});

const AppToolbar = ({toolbarOpen}) => (
    toolbarOpen ?
    <Toolbar>
        <ToolbarGroup/>
        <ToolbarGroup>
            <SearchBox/>
        </ToolbarGroup>
        <ToolbarGroup/>
    </Toolbar>
    : null
) 

export default connect(mapStateToProps, mapDispatchToProps)(AppToolbar);