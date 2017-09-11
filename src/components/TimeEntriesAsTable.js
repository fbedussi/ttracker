import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    deleteTimeEntry
} from '../actions';

import { convertMsToH } from '../helpers/helpers';

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
    currency: state.currency,
    activities: state.activities
});

const mapDispatchToProps = (dispatch) => ({
    deleteTimeEntry: (timeEntry, activity) => dispatch(deleteTimeEntry(timeEntry, activity))
});

class TimeEntriesAsTable extends Component {
    render() {
        const {
            activities,
            activityId,
            currency,
            deleteTimeEntry
        } = this.props;

        const activity = activities
            .filter((activity) => activity.id === activityId)
            .reduce((acc, i) => i, null)
        ;

        return (
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
                        var totalTime = timeEntry.endTime > 0 ? timeEntry.endTime - timeEntry.startTime : 0;
                        return <TableRow
                            key={timeEntry.id}
                            selectable={false}
                        >
                            <TableRowColumn>{new Date(timeEntry.startTime).toLocaleString()}</TableRowColumn>
                            <TableRowColumn>{timeEntry.endTime > 0 ? new Date(timeEntry.endTime).toLocaleString() : ''}</TableRowColumn>
                            <TableRowColumn>{totalTime > 0 ? formatTime(totalTime) : ''}</TableRowColumn>
                            <TableRowColumn>{currency + ' ' + Math.round(convertMsToH(totalTime) * activity.hourlyRate)}</TableRowColumn>
                            <TableRowColumn>
                                <IconButton
                                    onClick={() => deleteTimeEntry(timeEntry, activity)}
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeEntriesAsTable);
