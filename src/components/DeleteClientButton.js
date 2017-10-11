import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    deleteClient,
} from '../actions';

import DeleteButton from './DeleteButton';

class DeleteClientButton extends Component {
    render() {
        const {
            deleteClient,
        } = this.props;

        return (
            <DeleteButton
                buttonLabel="Delete"
                dialogMessage={`Are you sure to delete client "${client.name}?"`}
                dialogOptionText="delete client's projects"
                deleteAction={(deleteActivities) => deleteClient(client, deleteActivities)}
            />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteClientButton);
