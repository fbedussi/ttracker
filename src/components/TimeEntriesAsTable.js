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
    currency: state.options.currency,
    activities: state.data.activities
});

const mapDispatchToProps = (dispatch) => ({
    deleteTimeEntry: (timeEntry, activity) => dispatch(deleteTimeEntry(timeEntry, activity))
});

class TimeEntriesAsTable extends Component {
    render() {
        const {
            activity,
            currency,
            deleteTimeEntry
        } = this.props;

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
                    {activity.timeEntries.map((timeEntry, i) => {
                        
                        return <TableRow
                            key={i}
                            selectable={false}
                        >
                            <TableRowColumn>{new Date(timeEntry.startTime).toLocaleString()}</TableRowColumn>
                            <TableRowColumn>{timeEntry.endTime > 0 ? new Date(timeEntry.endTime).toLocaleString() : ''}</TableRowColumn>
                            <TableRowColumn>{timeEntry.duration > 0 ? formatTime(timeEntry.duration) : ''}</TableRowColumn>
                            <TableRowColumn>{currency + ' ' + Math.round(convertMsToH(timeEntry.duration) * activity.hourlyRate)}</TableRowColumn>
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
