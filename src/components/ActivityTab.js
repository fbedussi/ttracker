import React from 'react';
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
import AppToolbar from './AppToolbar';

const mapStateToProps = (state) => ({
    clients: state.data.clients,
    activities: state.data.activities,
    activeTab: state.ui.activeTab,
    currency: state.options.currency,
    ongoingActivities: state.ui.ongoingActivities,
    lastCreatedActivityId: state.ui.lastCreatedActivityId,
    searchText: state.ui.searchText,    
});

const mapDispatchToProps = (dispatch) => ({
    createNewActivity: () => dispatch(createNewActivity()),
    deleteActivity: (activity, deleteSubactivities) => dispatch(deleteActivity(activity, deleteSubactivities)),
    startActivity: (activity) => dispatch(startActivity(activity)),
    stopActivity: (activityId) => dispatch(stopActivity(activityId)),
    changeActivityName: (activity, newName) => dispatch(updateActivity(activity, { name: newName })),
    addSubactivity: (activity) => dispatch(addSubactivity(activity)),
});


const ActivityTab = ({
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
            searchText,
        }) => (
            <div className="tabContent">
                <AppToolbar />
                <div className="cardsWrapper">
                    {activities
                        .filter((activity) => !activity.parentActivity || !activity.parentActivity.id)
                        .filter((activity) => activity.name.toLowerCase().match(searchText.toLowerCase()))
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
                                        editable={activeTab === 'activities' && lastCreatedActivityId === activity.id}
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
                        className="fab"
                        style={{display: activeTab === 'activities' ? 'block' : 'none'}}
                        onClick={() => createNewActivity()}
                    >
                        <ContentAdd />
                    </FloatingActionButton>
                </div>
            </div>
        )

export default connect(mapStateToProps, mapDispatchToProps)(ActivityTab);