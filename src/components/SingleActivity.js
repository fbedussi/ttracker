import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    deleteActivity,
    updateActivity,
    deleteTimeEntry,
    updateTimeEntry,
    startActivity,
    stopActivity,
    addSubactivity,
    requestConfirmation,
    resetDialog,
} from '../actions';

import { formatTime, objHasDeepProp } from '../helpers/helpers';

import DeleteIcon from 'material-ui/svg-icons/action/delete';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import SvgIconFace from 'material-ui/svg-icons/action/face';
import HubIcon from 'material-ui/svg-icons/hardware/device-hub';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import { blue300, indigo900 } from 'material-ui/styles/colors';

import EditableText from './EditableText';
import TimerBox from './TimerBox';
import BackToHome from './BackToHome';
import BackTo from './BackTo';
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
    deleteTimeEntry: (activity, timeEntry) => dispatch(deleteTimeEntry(activity, timeEntry)),
    changeActivityName: (activity, newName) => dispatch(updateActivity(activity, { name: newName })),
    deleteActivity: (activity) => dispatch(deleteActivity(activity)),
    startActivity: (activity) => dispatch(startActivity(activity)),
    stopActivity: (activity) => dispatch(stopActivity(activity)),
    changeActivityHourlyRate: (activity, hourlyRate) => dispatch(updateActivity(activity, { hourlyRate: Number(hourlyRate) })),
    updateTimeEntry: (props) => dispatch(updateTimeEntry(props)),
    addSubactivity: (activity) => dispatch(addSubactivity(activity)),
    requestConfirmation: (request) => dispatch(requestConfirmation(request)),
    resetDialog: () => dispatch(resetDialog()),    
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
            requestConfirmation,
            resetDialog,
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

        var parentActivities = [];
        var parentActivity = activity.parentActivity;
        while (objHasDeepProp(parentActivity, 'id')) {
            parentActivities = parentActivities.concat(parentActivity);
            parentActivity = parentActivity.parentActivity;
        }

        return (
            <div className="mainWrapper">
                <BackTo
                    history={history}
                    title={`Activity id:${activity.id}`}
                />

                <div className="chipWrapper row">
                    {objHasDeepProp(activity, 'client.id') ?
                        <Chip className="chip"
                            backgroundColor={blue300}
                            onClick={() => history.push(`/client/${activity.client.id}`)}
                        >
                            <Avatar color="#fff" icon={<SvgIconFace />} backgroundColor={indigo900} />
                            {activity.client.name}
                        </Chip>
                        : null
                    }
                    {parentActivities.map((parentActivity) => (
                        <Chip
                            key={parentActivity.id}
                            className="chip"
                            onClick={() => history.push(`/activity/${parentActivity.id}`)}
                        >
                            <Avatar color="#444" icon={<HubIcon />} />
                            {parentActivity.name}
                        </Chip>
                    ))}
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
                        onClick={() => requestConfirmation({
                            title: 'Delete confrmation',
                            text: `Are you sure to delete activity ${activity.name}?`,
                            action: () => {
                                deleteActivity(activity);
                                resetDialog();
                                history.push('/');
                            }
                        })}
                    />
                </h1>

                <div className="hourlyRateWrapper row">
                    <span className="hourlyRateLabel">{`Hourly rate: ${currency}`} </span>
                    <EditableText
                        className="hourlyRate"
                        editable={false}
                        text={activity.hourlyRate}
                        handleChange={(hourlyRate) => changeActivityHourlyRate(activity, hourlyRate)}
                    />
                </div>

                <div className="totalTimeWrapper row">
                    <span className="totalTimeLabel">{'Total time: (h:mm:ss)'} </span>
                    <span className="totalTime">{formatTime(activity.totalTime)}</span>
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