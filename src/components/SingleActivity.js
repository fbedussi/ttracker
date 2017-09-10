import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    deleteActivity,
    updateActivity,    
    deleteTimeEntry,
    updateTimeEntry,
    startActivity,
    stopActivity,
    disableEditActivity,
    enabelEditActivityName
} from '../actions';

import DeleteIcon from 'material-ui/svg-icons/action/delete';
import FlatButton from 'material-ui/FlatButton';

import EditableText from './EditableText';
import TimerBox from './TimerBox';
import BackToHome from './BackToHome';
import TimeEntriesRegistry from './TimeEntriesRegistry';

const mapStateToProps = (state) => ({
    clients: state.clients,
    activities: state.activities,
    currency: state.currency
});

const mapDispatchToProps = (dispatch) => ({
    deleteTimeEntry: (timeEntry, activity) => dispatch(deleteTimeEntry(timeEntry, activity)),
    changeActivityName: (activity, newName) => dispatch(updateActivity(activity, {name: newName})),    
    deleteActivity: (activity) => dispatch(deleteActivity(activity)),    
    startActivity: (activity) => dispatch(startActivity(activity)),
    stopActivity: (activityId) => dispatch(stopActivity(activityId)),
    disableEdit: (id) => dispatch(disableEditActivity(id)),
    enabelEditActivityName: (id) => dispatch(enabelEditActivityName(id)),
    changeActivityHourlyRate: (activity, hourlyRate) => dispatch(updateActivity(activity, {hourlyRate: Number(hourlyRate)})),
    updateTimeEntry: (props) => dispatch(updateTimeEntry(props))
});


class SingleActivity extends Component {
    render() {
        const {
            history,
            activities,
            currency,
            deleteActivity,
            deleteTimeEntry,
            changeActivityName,
            startActivity,
            stopActivity,
            disableEdit,
            changeActivityHourlyRate,
            updateTimeEntry,
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
                        onClick={() => {
                            deleteActivity(activity);
                            history.push('/');
                        }}
                    />
                </h1>
                <div className="hourlyRateWrapper row">
                    <span className="hourlyRateLabel">{`Hourly rate: ${currency}`} </span>
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
                    <span className="totalCostLabel">{`Total cost: ${currency}`} </span>
                    <span className="totalCost">{Math.round(activity.totalCost)}</span>
                </div>
                <TimerBox 
                    activity={activity}
                    startActivity={startActivity}
                    stopActivity={stopActivity}
                />
                <TimeEntriesRegistry 
                    activityId={activity.id}
                    currency={currency}
                    updateTimeEntry={updateTimeEntry}
                    deleteTimeEntry={deleteTimeEntry}
                />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleActivity);