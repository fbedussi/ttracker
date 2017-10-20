import React from 'react';
import { connect } from 'react-redux';

import {
    deleteTimeEntry
} from '../actions';

import { formatTime } from '../helpers/helpers';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import IconButton from 'material-ui/IconButton';


const mapStateToProps = (state) => ({
    currency: state.options.currency,
    activities: state.data.activities
});

const mapDispatchToProps = (dispatch) => ({
    deleteTimeEntry: (activity, timeEntry) => dispatch(deleteTimeEntry(activity, timeEntry))
});

const TimeEntriesAsTable = ({
            activity,
            currency,
            deleteTimeEntry
        }) => (
            <Table
                selectable={false}
            >
                <TableHeader
                    adjustForCheckbox={false}
                    displaySelectAll={false}
                >
                    <TableRow>
                        <TableHeaderColumn>Start time</TableHeaderColumn>
                        <TableHeaderColumn>End time</TableHeaderColumn>
                        <TableHeaderColumn>Duration (h:mm:ss)</TableHeaderColumn>
                        <TableHeaderColumn>Cost</TableHeaderColumn>
                        <TableHeaderColumn>Delete</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody
                    displayRowCheckbox={false}
                >
                    {activity.timeEntries.map((timeEntry) => {
                        
                        return <TableRow
                            key={timeEntry.id}
                            selectable={false}
                        >
                            <TableRowColumn>{new Date(timeEntry.startTime).toLocaleString()}</TableRowColumn>
                            <TableRowColumn>{timeEntry.endTime > 0 ? new Date(timeEntry.endTime).toLocaleString() : ''}</TableRowColumn>
                            <TableRowColumn>{timeEntry.duration > 0 ? formatTime(timeEntry.duration) : ''}</TableRowColumn>
                            <TableRowColumn>{currency + ' ' + Math.round(timeEntry.cost)}</TableRowColumn>
                            <TableRowColumn>
                                <IconButton
                                    onClick={() => deleteTimeEntry(activity, timeEntry)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </TableRowColumn>
                        </TableRow>
                    }
                    )}
                </TableBody>
            </Table>
        )

export default connect(mapStateToProps, mapDispatchToProps)(TimeEntriesAsTable);
