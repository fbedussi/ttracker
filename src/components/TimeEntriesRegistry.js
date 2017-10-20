import React from 'react';
import { connect } from 'react-redux';

import {
    updateOptions
} from '../actions';

import Toggle from 'material-ui/Toggle';

import TimeEntriesAsTable from './TimeEntriesAsTable';
import TimeEntriesAsCards from './TimeEntriesAsCards';

const mapStateToProps = (state) => ({
    timeEntriesRegistryAsTable: state.options.timeEntriesRegistryAsTable,
    activities: state.data.activities
});

const mapDispatchToProps = (dispatch) => ({
    toggleTimeEntriesRegistryAsTable: (timeEntriesRegistryAsTable) => dispatch(updateOptions({timeEntriesRegistryAsTable: !timeEntriesRegistryAsTable}))
});

const TimeEntriesRegistry = ({
            activity,
            timeEntriesRegistryAsTable,
            toggleTimeEntriesRegistryAsTable
        }) => (
            activity.timeEntries.length ? <div className="timeEntriesRegistry">
                <div className="row">
                    <h2 className="sectionTitle">Timesheet</h2>
                    <Toggle
                        label="view as table"
                        labelPosition="right"
                        toggled={timeEntriesRegistryAsTable}
                        onToggle={() => toggleTimeEntriesRegistryAsTable(timeEntriesRegistryAsTable)}
                    />
                </div>
                {timeEntriesRegistryAsTable ?
                    <TimeEntriesAsTable
                        activity={activity}
                    />
                    : <TimeEntriesAsCards
                        activity={activity}
                    />
                }
            </div>
            : null
        )

export default connect(mapStateToProps, mapDispatchToProps)(TimeEntriesRegistry);
