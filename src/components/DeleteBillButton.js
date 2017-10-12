import React from 'react';

import DeleteButton from './DeleteButton';

const DeleteBillButton = ({
            history,
            bill,
            deleteBill,
            redirectToHome = false
        }) => (
            <DeleteButton
                buttonLabel="Delete"
                dialogMessage={`Are you sure to delete bill n.${bill.id} dated ${new Date(bill.date).toLocaleDateString()} for the client "${bill.client.name}"?`}
                deleteAction={() => {
                    deleteBill(bill.id);
                    if (redirectToHome) {
                        history.push('/');
                    }
                }}
            />
        )
    
export default DeleteBillButton;
