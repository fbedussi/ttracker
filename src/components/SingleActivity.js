import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

import {
    deleteActivity,
    updateActivity,    
    deleteTimeEntry,
    updateTimeEntry,
    startActivity,
    stopActivity,
    addSubactivity,    
} from '../actions';

import DeleteIcon from 'material-ui/svg-icons/action/delete';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import EditableText from './EditableText';
import TimerBox from './TimerBox';
import BackToHome from './BackToHome';
import TimeEntriesRegistry from './TimeEntriesRegistry';
import ActivityChip from './ActivityChip';

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
    updateTimeEntry: (props) => dispatch(updateTimeEntry(props)),
    addSubactivity: (activity) => dispatch(addSubactivity(activity)),    
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
            addSubactivity,            
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
                <div className="activityId row">
                    Activity Id: {activity.id}
                </div>
                {activity.parentActivity && activity.parentActivity.id ? <div>
                    <span>Parent activity: </span>
                    <Link to={`/activity/${activity.parentActivity.id}`}>
                        {activity.parentActivity.name}
                    </Link>
                </div>
                : null}
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
                    <Link to={`/client/${activity.client.id}`}>
                        <span className="clientName">{activity.client.name}</span>
                    </Link>
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

                <h2 className="sectionSubtitle">Tasks 
                    <FlatButton
                        icon={<ContentAdd />}
                        onClick={() => {
                            addSubactivity(activity);
                        }}
                    />
                </h2>
                
                <div className="chipWrapper">
                    {activity.subactivities.map((activity) => <ActivityChip
                        key={activity.id}
                        activity={activity}
                    />)}
                </div>

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