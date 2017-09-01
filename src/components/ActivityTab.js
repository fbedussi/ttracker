import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createNewActivity, deleteActivity, startActivity, stopActivity } from '../actions';
import {convertMsToH} from '../helpers/helpers';
import Subheader from 'material-ui/Subheader';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import DetailsIcon from 'material-ui/svg-icons/action/pageview';
import RecordIcon from 'material-ui/svg-icons/av/fiber-manual-record';
import StopIcon from 'material-ui/svg-icons/av/stop';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';

const styles = {
    chip: {
        margin: 4,
    },
    wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    fab:  {
        display: 'none',
        position: 'fixed',
        right: '2em',
        bottom: '2em'
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
    stopActivity: (activity) => dispatch(stopActivity(activity))
});


class ActivityTab extends Component {
    render() {
        const { activeTab, clients, activities, createNewActivity, deleteActivity, startActivity, stopActivity } = this.props;
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

                    return <Card key={activity.id} style={{position: 'relative'}}>
                        <CardHeader
                            title={activity.name}
                            subtitle={client ? client.name : ''}
                            actAsExpander={true}
                            showExpandableButton={true}
                        />
                        <CardActions>
                            <FlatButton label="Edit" icon={<EditIcon />} />
                            <FlatButton
                                label="Delete"
                                icon={<DeleteIcon />}
                                onClick={() => deleteActivity(activity)}
                            />
                            <FlatButton
                                label="Start"
                                icon={<RecordIcon />}
                                onClick={() => startActivity(activity)}
                                style={activity.active ? {display: 'none'} : {display: 'block'}}
                            />
                            <FlatButton
                                label="Stop"
                                icon={<StopIcon />}
                                onClick={() => stopActivity(activity)}
                                style={activity.active ? {display: 'block'} : {display: 'none'}}
                            />
                        </CardActions>
                        <CardText expandable={true}>
                            <Subheader>Total time</Subheader>
                            <p>{new Date(activity.getTotalTime()).toLocaleString()}</p>
                            <Subheader>Total cost</Subheader>
                            <p>{`€ ${activity.getTotalCost()}`}</p>
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
