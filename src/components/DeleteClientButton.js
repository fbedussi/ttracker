import React from 'react';

import DeleteButton from './DeleteButton';

const DeleteClientButton = ({
            history,
            client,
            deleteClient,
            redirectToHome = false
        }) => (
            <DeleteButton
                buttonLabel="Delete"
                dialogMessage={`Are you sure to delete client "${client.name}?"`}
                dialogOptionText="delete client's projects"
                deleteAction={(deleteActivities) => {
                    deleteClient(client, deleteActivities);
                    if (redirectToHome) {
                        history.push('/');
                    }
                }}
            />
        )
    
export default DeleteClientButton;
