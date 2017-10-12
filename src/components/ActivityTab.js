import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

import {
    createNewActivity,
    deleteActivity,
    startActivity,
    stopActivity,
    updateActivity,
    addSubactivity,
} from '../actions';

import { formatTime, objHasDeepProp } from '../helpers/helpers';

import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import DetailsIcon from 'material-ui/svg-icons/action/pageview';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';

import EditableText from './EditableText';
import TimerBox from './TimerBox';
import ActivityChip from './ActivityChip';
import DeleteActivityButton from './DeleteActivityButton';

const styles = {
    fab: {
        display: 'none',
        position: 'fixed',
        right: '2em',
        bottom: '2em',
        zIndex: '1'
    }
};

const mapStateToProps = (state) => ({
    clients: state.data.clients,
    activities: state.data.activities,
    activeTab: state.ui.activeTab,
    currency: state.options.currency,
    ongoingActivities: state.ui.ongoingActivities,
    lastCreatedActivityId: state.ui.lastCreatedActivityId,
});

const mapDispatchToProps = (dispatch) => ({
    createNewActivity: () => dispatch(createNewActivity()),
    deleteActivity: (activity, deleteSubactivities) => dispatch(deleteActivity(activity, deleteSubactivities)),
    startActivity: (activity) => dispatch(startActivity(activity)),
    stopActivity: (activityId) => dispatch(stopActivity(activityId)),
    changeActivityName: (activity, newName) => dispatch(updateActivity(activity, { name: newName })),
    addSubactivity: (activity) => dispatch(addSubactivity(activity)),   
});


class ActivityTab extends Component {
    render() {
        const {
            currency,
            history,
            activeTab,
            clients,
            activities,
            createNewActivity,
            deleteActivity,
            startActivity,
            stopActivity,
            changeActivityName,
            ongoingActivities,
            lastCreatedActivityId,
            addSubactivity,
        } = this.props;
        styles.fab.display = activeTab === 'activities' ? 'block' : 'none';

        return (
            <div className="tabContent cardsWrapper">
                {activities
                    .filter((activity) => !activity.parentActivity || !activity.parentActivity.id)
                    .map((activity) => {
                        return <Card
                            className="card"
                            key={'activity_' + activity.id}
                            style={{ position: 'relative' }}
                            expandable={false}
                            expanded={true}

                        >
                            <CardHeader
                                actAsExpander={false}
                                showExpandableButton={false}
                                textStyle={{ paddingRight: '0' }}
                            >
                                <EditableText
                                    className="cardTitle"
                                    editable={activeTab === 'projects' && lastCreatedActivityId === activity.id}
                                    text={activity.name}
                                    handleChange={(text) => changeActivityName(activity, text)}
                                />
                                <div className="cardClientName" style={objHasDeepProp(activity, 'client.name') ? { display: 'block' } : { display: 'none' }}>
                                    <span>Client: </span>
                                    <Link to={`/client/${activity.client.id}`}>
                                        {activity.client.name}
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardActions>
                                <FlatButton
                                    label="Details"
                                    icon={<DetailsIcon />}
                                    onClick={() => history.push(`/activity/${activity.id}`)}
                                />
                                <DeleteActivityButton
                                    deleteActivity={deleteActivity}
                                    activity={activity}
                                />
                                <TimerBox
                                    activity={activity}
                                    isOngoing={ongoingActivities.includes(activity.id)}
                                    startActivity={startActivity}
                                    stopActivity={stopActivity}
                                />

                            </CardActions>
                            <CardText expandable={true}>
                                <div className="row">
                                    <span className="label">Total time: </span>
                                    <span className="totaleTime">{formatTime(activity.totalTime)}</span>
                                </div>
                                <div className="totalCostWrapper row">
                                    <span className="totalCostLabel">{`Total cost: ${currency}`} </span>
                                    <span className="totalCost">{Math.round(activity.totalCost)}</span>
                                </div>

                                <div className="row">
                                    <span className="label">Total time to bill: </span>
                                    <span className="totalTimeToBill">{formatTime(activity.totalTimeToBill)}</span>
                                </div>

                                <div className="totalCostWrapper row">
                                    <span className="label">{`Total cost: ${currency}`} </span>
                                    <span className="totalCostToBill">{Math.round(activity.totalCostToBill)}</span>
                                </div>

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

                            </CardText>
                        </Card>
                    }
                    )}

                <FloatingActionButton
                    style={styles.fab}
                    onClick={() => createNewActivity()}
                >
                    <ContentAdd />
                </FloatingActionButton>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityTab);