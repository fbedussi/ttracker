import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    deleteActivity,
    updateActivity,    
    deleteTimeEntry,
    updateTimeEntry,
    startActivity,
    stopActivity,
    
} from '../actions';

import DeleteIcon from 'material-ui/svg-icons/action/delete';
import FlatButton from 'material-ui/FlatButton';

import EditableText from './EditableText';
import TimerBox from './TimerBox';
import BackToHome from './BackToHome';
import TimeEntriesRegistry from './TimeEntriesRegistry';

const mapStateToProps = (state) => ({
    clients: state.data.clients,
    activities: state.data.activities,
    currency: state.options.currency,
    ongoingActivities: state.ui.ongoingActivities,
    lastCreatedActivityId: state.ui.lastCreatedActivityId,        
});

const mapDispatchToProps = (dispatch) => ({
    deleteTimeEntry: (timeEntry, activity) => dispatch(deleteTimeEntry(timeEntry, activity)),
    changeActivityName: (activity, newName) => dispatch(updateActivity(activity, {name: newName})),    
    deleteActivity: (activity) => dispatch(deleteActivity(activity)),    
    startActivity: (activity) => dispatch(startActivity(activity)),
    stopActivity: (activity) => dispatch(stopActivity(activity)),
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
            changeActivityHourlyRate,
            updateTimeEntry,
            ongoingActivities,
            lastCreatedActivityId,
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
                <h1 className="activityTitleBar titleBar">
                    <EditableText
                        className="activityName row"
                        editable={lastCreatedActivityId === activity.id}
                        text={activity.name}
                        handleChange={(text) => changeActivityName(activity, text)}
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
                <div className="clientWrapper row">
                    <span className="clientLabel">Client: </span>
                    <span className="clientName">{activity.client.name}</span>
                </div>
                <div className="hourlyRateWrapper row">
                    <span className="hourlyRateLabel">{`Hourly rate: ${currency}`} </span>
                    <EditableText
                        className="hourlyRate"
                        editable={false}
                        text={activity.hourlyRate}
                        handleChange={(hourlyRate) => changeActivityHourlyRate(activity, hourlyRate)}
                    />
                </div>
                <div className="totalCostWrapper row">
                    <span className="totalCostLabel">{`Total cost: ${currency}`} </span>
                    <span className="totalCost">{Math.round(activity.totalCost)}</span>
                </div>
                <TimerBox 
                    activity={activity}
                    isOngoing={ongoingActivities.includes(activity.id)}
                    startActivity={startActivity}
                    stopActivity={stopActivity}
                />
                <TimeEntriesRegistry 
                    activity={activity}
                    currency={currency}
                    updateTimeEntry={updateTimeEntry}
                    deleteTimeEntry={deleteTimeEntry}
                />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleActivity);