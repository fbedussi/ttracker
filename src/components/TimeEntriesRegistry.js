import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    toggleTimeEntriesRegistryAsTable
} from '../actions';

import Toggle from 'material-ui/Toggle';

import TimeEntriesAsTable from './TimeEntriesAsTable';
import TimeEntriesAsCards from './TimeEntriesAsCards';

const mapStateToProps = (state) => ({
    timeEntriesRegistryAsTable: state.timeEntriesRegistryAsTable,
    activities: state.activities
});

const mapDispatchToProps = (dispatch) => ({
    toggleTimeEntriesRegistryAsTable: () => dispatch(toggleTimeEntriesRegistryAsTable())
});

class TimeEntriesRegistry extends Component {
    render() {
        const {
            activity,
            timeEntriesRegistryAsTable,
            toggleTimeEntriesRegistryAsTable
        } = this.props;

        return (
            <div className="timeEntriesRegistry">
                {activity.timeEntries.length ?
                    <div className="row">
                        <h2 className="sectionTitle">Timesheet</h2>
                        <Toggle
                            label="view as table"
                            labelPosition="right"
                            onToggle={toggleTimeEntriesRegistryAsTable}
                        />
                    </div>
                    : null}
                {!timeEntriesRegistryAsTable ?
                    <TimeEntriesAsCards
                        activity={activity}
                    />
                    : <TimeEntriesAsTable
                        activity={activity}
                    />
                }
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeEntriesRegistry);
