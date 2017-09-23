import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    createNewClient,
    deleteClient,
    addNewActivityToClient,
    updateClient,
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
    fab: {
        display: 'none',
        position: 'fixed',
        right: '2em',
        bottom: '2em'
    }
};

const mapStateToProps = (state) => ({
    clients: state.data.clients,
    activities: state.data.activities,
    activeTab: state.ui.activeTab,
    currency: state.options.currency,
    lastCreatedClientId: state.ui.lastCreatedClientId,
});

const mapDispatchToProps = (dispatch) => ({
    createNewClient: () => dispatch(createNewClient()),
    deleteClient: (client) => dispatch(deleteClient(client)),
    addNewActivityToClient: (client) => dispatch(addNewActivityToClient(client)),
    updateClient: (client, newName) => dispatch(updateClient(client, newName)),
});

class ClientTab extends Component {
    render() {
        const {
            history,
            activeTab,
            clients,
            activities,
            createNewClient,
            deleteClient,
            addNewActivityToClient,
            updateClient,
            currency,
            lastCreatedClientId,
        } = this.props;
        styles.fab.display = activeTab === 'clients' ? 'block' : 'none';

        return (
            <div>
                {clients.map((client) => <Card
                    key={client.id}
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
                            editable={activeTab === 'clients' && lastCreatedClientId === client.id}
                            text={client.name}
                            handleChange={(text) => updateClient({
                                id: client.id,
                                name: text
                            })}
                        />
                    </CardHeader>
                    <CardActions>
                        <FlatButton
                                label="Details"
                                icon={<DetailsIcon />}
                                onClick={() => history.push(`/client/${client.id}`)}
                        />
                        <FlatButton
                            label="Delete"
                            icon={<DeleteIcon />}
                            onClick={() => deleteClient(client)}
                        />
                    </CardActions>
                    <CardText expandable={true}>
                        <div className="row">
                            <span className="label">Last billed date </span>
                            <span>{new Date(client.lastBilledTime).toLocaleString()}</span>
                        </div>
                        <div className="row">
                            <span className="label">{`Total to bill: ${currency}`}</span>
                            <span>{Math.round(client.totalCostToBill)}</span>
                        </div>
                        
                        <h2 className="sectionSubtitle">Projects
                            <FlatButton
                                icon={<ContentAdd />}
                                onClick={() => {
                                    addNewActivityToClient(client);
                                }}
                            />
                        </h2>
                        <div className="chipWrapper">
                            {client.activities.map((activity) => <ActivityChip
                                key={activity.id}
                                activity={activity}
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
