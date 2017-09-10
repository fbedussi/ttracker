import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    deleteActivity,
    updateActivity,    
    deleteTimeEntry,
    startActivity,
    stopActivity,
    disableEditActivity,
    enabelEditActivityName
} from '../actions';
import { Link } from 'react-router-dom'

import { convertMsToH } from '../helpers/helpers';

import {formatTime} from '../helpers/helpers';

import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
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
import TimerBox from './TimerBox';
import BackToHome from './BackToHome';

const mapStateToProps = (state) => ({
    clients: state.clients,
    activities: state.activities
});

const mapDispatchToProps = (dispatch) => ({
    deleteTimeEntry: (timeEntry, activity) => dispatch(deleteTimeEntry(timeEntry, activity)),
    changeActivityName: (activity, newName) => dispatch(updateActivity(activity, {name: newName})),    
    deleteActivity: (activity) => dispatch(deleteActivity(activity)),    
    startActivity: (activity) => dispatch(startActivity(activity)),
    stopActivity: (activityId) => dispatch(stopActivity(activityId)),
    disableEdit: (id) => dispatch(disableEditActivity(id)),
    enabelEditActivityName: (id) => dispatch(enabelEditActivityName(id)),
    changeActivityHourlyRate: (activity, hourlyRate) => dispatch(updateActivity(activity, {hourlyRate: Number(hourlyRate)}))
});


class SingleActivity extends Component {
    render() {
        const {
            clients,
            activities,
            deleteActivity,
            deleteTimeEntry,
            changeActivityName,
            startActivity,
            stopActivity,
            disableEdit,
            changeActivityHourlyRate,
            enabelEditActivityName
        } = this.props;
        const activityId = Number(this.props.match.params.activityId);
        const activity = activities
            .filter((activity) => activity.id === activityId)
            .reduce((acc, i) => i, null)

        if (!activity) {
            return (
                <div>
                    <BackToHome />
                    <div>{`ERROR: no activity with id ${activityId}`}</div>
                </div>
            );
        }

        return (
            <div className="mainWrapper">
                <BackToHome />
                <div className="activityId">
                    Activity Id: {activity.id}
                </div>
                <h1 className="activityTitleBar">
                    <EditableText
                        className="activityName row"
                        editable={activity.editableName}
                        text={activity.name}
                        handleChange={(text) => changeActivityName(activity, text)}
                        disableEdit={() => disableEdit(activity.id)}
                        enableEdit={() => enabelEditActivityName(activity.id)}
                    />
                    <FlatButton
                        label="Delete"
                        icon={<DeleteIcon />}
                        onClick={() => deleteActivity(activity)}
                    />
                </h1>
                <div className="hourlyRateWrapper row">
                    <span className="hourlyRateLabel">Hourly rate: €</span>
                    <EditableText
                        className="hourlyRate"
                        editable={false}
                        text={activity.hourlyRate}
                        handleChange={(hourlyRate) => changeActivityHourlyRate(activity, hourlyRate)}
                        disableEdit={() => {}}
                        enableEdit={() => {}}
                    />
                </div>
                <div className="totalCostWrapper row">
                    <span className="totalCostLabel">Total cost: </span>
                    <span className="totalCost">{activity.totalCost}</span>
                </div>
                <TimerBox 
                    activity={activity}
                    startActivity={startActivity}
                    stopActivity={stopActivity}
                />
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
                                <TableRowColumn>{'€ ' + convertMsToH(totalTime) * activity.hourlyRate}</TableRowColumn>
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