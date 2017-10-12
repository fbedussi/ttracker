import React from 'react';

import DeleteButton from './DeleteButton';

const DeleteActivityButton = ({
            history,
            activity,
            deleteActivity,
            redirectToHome = false
        }) => (
            <DeleteButton
                buttonLabel="Delete"
                dialogMessage={`Are you sure to delete activity "${activity.name}"?`}
                dialogOptionText="delete project's tasks"
                deleteAction={(deleteSubactivities) => {
                    deleteActivity(activity, deleteSubactivities);
                    if (redirectToHome) {
                        history.push('/');
                    }
                }}
            />
        )
    
export default DeleteActivityButton;
