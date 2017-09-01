import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createNewClient, deleteClient, addNewActivity, updateClient } from '../actions';
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
    activeTab: state.activeTab
});

const mapDispatchToProps = (dispatch) => ({
    createNewClient: () => dispatch(createNewClient()),
    deleteClient: (client) => dispatch(deleteClient(client)),
    addNewActivity: (activity) => dispatch(addNewActivity(activity)),
    updateClient: (client) => dispatch(updateClient(client))
});

class ClientTab extends Component {
    render() {
        const { activeTab, clients, createNewClient, deleteClient, addNewActivity, updateClient } = this.props;
        styles.fab.display = activeTab === 'clients' ? 'block' : 'none';

        return (
            <div>
                {clients.map((client) => <Card key={client.id}>
                    <CardHeader
                        title={client.name}
                        actAsExpander={true}
                        showExpandableButton={true}
                    />
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
                                const activity = client.addActivity();
                                //client.activities = client.activities.concat(activity);
                                addNewActivity(activity);
                                updateClient(client);
                            }}
                        />
                        </Subheader>
                        <div style={styles.wrapper}>
                            {[].concat(client.activities).filter((i) => i).map((activity) => <Link to={`/activity/${activity.id}`} key={activity.id}>
                            <Chip
                                style={styles.chip}
                                onRequestDelete={() => { }}

                            >
                                {activity.name}
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
