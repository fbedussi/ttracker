import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createNewClient, deleteClient, addNewActivityToClient, 
        updateClient, changeClientName, changeActivityName, disableEditClient } from '../actions';
import { Link } from 'react-router-dom'

import Subheader from 'material-ui/Subheader';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import DetailsIcon from 'material-ui/svg-icons/action/pageview';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';

import EditableText from './EditableText';

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
    createNewClient: () => dispatch(createNewClient()),
    deleteClient: (client) => dispatch(deleteClient(client)),
    addNewActivityToClient: (clientId) => dispatch(addNewActivityToClient(clientId)),
    updateClient: (client) => dispatch(updateClient(client)),
    changeClientName: (client, newName) => dispatch(changeClientName(client, newName)),
    disableEdit: (id) => dispatch(disableEditClient(id)),
    changeActivityName: (activity, newName, client) => dispatch(changeActivityName(activity, newName, client))    
});

class ClientTab extends Component {
    render() {
        const { 
            activeTab,
            clients,
            activities,
            createNewClient,
            deleteClient,
            addNewActivityToClient,
            updateClient,
            changeClientName,
            disableEdit,
            changeActivityName
        } = this.props;
        styles.fab.display = activeTab === 'clients' ? 'block' : 'none';

        return (
            <div>
                {clients.map((client) => <Card 
                        key={client.id}
                        expandable={false}
                        expanded={true}
                        onClick={() => disableEdit(client.id)}
                    >
                    <CardHeader
                        actAsExpander={false}
                        showExpandableButton={false}
                        textStyle={{paddingRight: '0'}}
                    >
                    <EditableText
                                className="cardTitle"
                                editable={client.editableName}
                                text={client.name}
                                handleChange={(text) => changeClientName(client, text)}
                            />
                    </CardHeader>
                    <CardActions>
                        <FlatButton label="Edit" icon={<EditIcon />} />
                        <FlatButton
                            label="Delete"
                            icon={<DeleteIcon />}
                            onClick={() => deleteClient(client)}
                        />
                    </CardActions>
                    <CardText expandable={true}>
                        <Subheader>Last billed date</Subheader>
                        <p>{new Date(client.lastBilledTime).toLocaleString()}</p>
                        <Subheader>Next invoice subtotal</Subheader>
                        <p>€ 1,000</p>
                        <Subheader>Projects
                        <FlatButton
                            icon={<ContentAdd />}
                            onClick={() => {
                                addNewActivityToClient(client.id);
                            }}
                        />
                        </Subheader>
                        <div style={styles.wrapper}>
                            {[].concat(client.activities).filter((i) => i).map((activityId) => <Link to={`/activity/${activityId}`} key={activityId}>
                            <Chip
                                style={styles.chip}
                                onRequestDelete={() => { }}
                            >
                                <EditableText
                                    className="chipText"
                                    editable={true}
                                    text={activities.find((activity) => activity.id === activityId).name}
                                    handleChange={(text) => changeActivityName(activities.find((activity) => activity.id === activityId), text)}
                                />
                            </Chip>
                            </Link>)}
                        </div>

                    </CardText>
                </Card>
                )}

                <FloatingActionButton
                    style={styles.fab}
                    onClick={() => createNewClient()}
                >
                    <ContentAdd />
                </FloatingActionButton>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientTab);
