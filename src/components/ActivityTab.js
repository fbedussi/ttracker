import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    createNewActivity,
    deleteActivity,
    startActivity,
    stopActivity,
    updateActivity,
} from '../actions';

import {formatTime} from '../helpers/helpers';

import Subheader from 'material-ui/Subheader';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import DetailsIcon from 'material-ui/svg-icons/action/pageview';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';

import EditableText from './EditableText';
import TimerBox from './TimerBox';

const styles = {
    chip: {
        margin: 4,
    },
    wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
    },
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
    deleteActivity: (activity) => dispatch(deleteActivity(activity)),
    startActivity: (activity) => dispatch(startActivity(activity)),
    stopActivity: (activityId) => dispatch(stopActivity(activityId)),
    changeActivityName: (activity, newName) => dispatch(updateActivity(activity, {name: newName})),
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
            lastCreatedActivityId       
        } = this.props;
        styles.fab.display = activeTab === 'activities' ? 'block' : 'none';

        return (
            <div>
                {activities.map((activity) => {
                    return <Card
                        key={activity.id}
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
                                editable={lastCreatedActivityId === activity.id}
                                text={activity.name}
                                handleChange={(text) => changeActivityName(activity, text)}
                            />
                            <div>{activity.client && activity.client.name ? 'Client: ' + activity.client.name : ''}</div>
                        </CardHeader>
                        <CardActions>
                            <FlatButton
                                label="Details"
                                icon={<DetailsIcon />}
                                onClick={() => history.push(`/activity/${activity.id}`)}
                            />
                            <FlatButton
                                label="Delete"
                                icon={<DeleteIcon />}
                                onClick={() => deleteActivity(activity)}
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
                            
                            <h2 className="sectionSubtitle">Tasks</h2>
                            <div style={styles.wrapper}>
                                {activity.subactivities.map((subactivity) => <Chip
                                    style={styles.chip}
                                    onRequestDelete={() => { }}
                                >
                                    {subactivity.name}
                                </Chip>)}
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