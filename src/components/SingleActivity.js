import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    deleteActivity,
    changeActivityName,    
    deleteTimeEntry,
    disableEditActivity    
} from '../actions';
import { Link } from 'react-router-dom'

import { convertMsToH } from '../helpers/helpers';

import {formatTime} from '../helpers/helpers';

import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import CloseIcon from 'material-ui/svg-icons/content/clear';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import EditableText from './EditableText';

const mapStateToProps = (state) => ({
    clients: state.clients,
    activities: state.activities
});

const mapDispatchToProps = (dispatch) => ({
    deleteTimeEntry: (timeEntry, activity) => dispatch(deleteTimeEntry(timeEntry, activity)),
    changeActivityName: (activity, newName) => dispatch(changeActivityName(activity, newName)),    
    disableEdit: (id) => dispatch(disableEditActivity(id))    
});


class SingleActivity extends Component {
    render() {
        const {
            clients,
            activities,
            deleteTimeEntry,
            changeActivityName,
            disableEdit            
        } = this.props;
        const activityId = Number(this.props.match.params.activityId);
        const activity = activities
            .filter((activity) => activity.id === activityId)
            .reduce((acc, i) => i, null)

        if (!activity) {
            return (<div>{`ERROR: no activity with id ${activityId}`}</div>)
        }

        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Link to="/">
                        <IconButton>
                            <CloseIcon />
                        </IconButton>
                    </Link>
                </div>
                <div>
                    Activity Id: {activity.id}
                </div>
                <h1>
                    <EditableText
                        className="cardTitle"
                        editable={activity.editableName}
                        text={activity.name}
                        handleChange={(text) => changeActivityName(activity, text)}
                        disableEdit={() => disableEdit(activity.id)}
                    />
                </h1>
                <Subheader>Time entries</Subheader>
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
                            <TableHeaderColumn>Duration</TableHeaderColumn>
                            <TableHeaderColumn>Cost</TableHeaderColumn>
                            <TableHeaderColumn>Edit</TableHeaderColumn>
                            <TableHeaderColumn>Delete</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        displayRowCheckbox={false}
                    >
                        {activity.timeEntries.map((timeEntry) => {
                            var totalTime = timeEntry.getTotalTime();
                            return <TableRow 
                                key={timeEntry.id}
                                selectable={false}
                            >
                                <TableRowColumn>{new Date(timeEntry.startTime).toLocaleString()}</TableRowColumn>
                                <TableRowColumn>{timeEntry.endTime > 0 ? new Date(timeEntry.endTime).toLocaleString() : ''}</TableRowColumn>
                                <TableRowColumn>{totalTime > 0 ? formatTime(totalTime) : ''}</TableRowColumn>
                                <TableRowColumn>{'€ ' + convertMsToH(totalTime) * activity.hourlyRate}</TableRowColumn>
                                <TableRowColumn><EditIcon /></TableRowColumn>
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
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleActivity);
