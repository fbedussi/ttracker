import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    createNewActivity,
    deleteActivity,
    startActivity,
    stopActivity,
    updateActivity,
    disableEditActivity,
    enabelEditActivityName    
} from '../actions';
import Subheader from 'material-ui/Subheader';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import DetailsIcon from 'material-ui/svg-icons/action/pageview';
import RecordIcon from 'material-ui/svg-icons/av/fiber-manual-record';
import StopIcon from 'material-ui/svg-icons/av/stop';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';

import Timer from './Timer';
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
    clients: state.clients,
    activities: state.activities,
    activeTab: state.activeTab
});

const mapDispatchToProps = (dispatch) => ({
    createNewActivity: () => dispatch(createNewActivity()),
    deleteActivity: (activity) => dispatch(deleteActivity(activity)),
    startActivity: (activity) => dispatch(startActivity(activity)),
    stopActivity: (activityId) => dispatch(stopActivity(activityId)),
    changeActivityName: (activity, newName) => dispatch(updateActivity(activity, {name: newName})),
    disableEdit: (id) => dispatch(disableEditActivity(id)),
    enabelEditActivityName: (id) => dispatch(enabelEditActivityName(id))    
});


class ActivityTab extends Component {
    render() {
        const {
            history,
            activeTab,
            clients,
            activities,
            createNewActivity,
            deleteActivity,
            startActivity,
            stopActivity,
            changeActivityName,
            enabelEditActivityName,
            disableEdit
        } = this.props;
        styles.fab.display = activeTab === 'activities' ? 'block' : 'none';

        return (
            <div>
                {activities.map((activity) => {
                    const client = clients
                        .filter((client) => client
                            .activities
                            .some((clientActivity) => clientActivity.id === activity.id)
                        )
                        .reduce((acc, item) => item, null)
                        ;

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
                                editable={activity.editableName}
                                text={activity.name}
                                handleChange={(text) => changeActivityName(activity, text)}
                                disableEdit={() => disableEdit(activity.id)}
                                enableEdit={() => enabelEditActivityName(activity.id)}
                            />
                            <div>{client ? client.name : ''}</div>
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
                                startActivity={startActivity}
                                stopActivity={stopActivity}
                            />

                        </CardActions>
                        <CardText expandable={true}>
                            <Subheader>Total time</Subheader>
                            {/* <p>{new Date(activity.getTotalTime()).toLocaleString()}</p> */}
                            <Subheader>Total cost</Subheader>
                            {/* <p>{`€ ${activity.getTotalCost()}`}</p> */}
                            {/* <Subheader>Last billed date</Subheader>
                            <p>{new Date(client.lastBilledDate()).toLocaleString()}</p>
                            <Subheader>Next invoice subtotal</Subheader>
                            <p>€ 1,000</p> */}
                            <Subheader>Tasks</Subheader>
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