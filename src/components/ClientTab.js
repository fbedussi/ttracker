import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createNewClient, 
    deleteClient,
    addNewActivityToClient, 
    updateClient,
    changeClientName,
    disableEditClient
} from '../actions';

import Subheader from 'material-ui/Subheader';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import DetailsIcon from 'material-ui/svg-icons/action/pageview';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';

import EditableText from './EditableText';
import ActivityChip from './ActivityChip';

const styles = {
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
    changeClientName: (client, newName) => dispatch(changeClientName(client, newName)),
    disableEdit: (id) => dispatch(disableEditClient(id))
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
            disableEdit
        } = this.props;
        styles.fab.display = activeTab === 'clients' ? 'block' : 'none';

        return (
            <div>
                {clients.map((client) => <Card 
                        key={client.id}
                        expandable={false}
                        expanded={true}
                        onClick={() => {
                            disableEdit(client.id);
                        }}
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
                                disableEdit={() => disableEdit(client.id)}
                            />
                    </CardHeader>
                    <CardActions>
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
                            {[].concat(client.activities).filter((i) => i).map((activityId) => <ActivityChip
                                key={activityId}
                                activities={activities}
                                activityId={activityId}
                            />)}
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
