import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

import { convertMsToH } from '../helpers/helpers';

import { formatTime } from '../helpers/helpers';

import {
    deleteBill,
    updateBill,
    requestConfirmation,
    resetDialog,
} from '../actions';

import DeleteIcon from 'material-ui/svg-icons/action/delete';
import FlatButton from 'material-ui/FlatButton';
import { Card, CardActions, CardText } from 'material-ui/Card';
import DetailsIcon from 'material-ui/svg-icons/action/pageview';

import DateBox from './DateBox';

const mapStateToProps = (state) => ({
    currency: state.options.currency
});

const mapDispatchToProps = (dispatch) => ({
    deleteBill: (billId) => dispatch(deleteBill(billId)),
    updateBill: (bill) => dispatch(updateBill(bill)),
    requestConfirmation: (request) => dispatch(requestConfirmation(request)),
    resetDialog: () => dispatch(resetDialog()),  
});

class BillCard extends Component {
    render() {
        const { 
            history,
            bill,
            deleteBill,
            updateBill,
            requestConfirmation,
            resetDialog,
        } = this.props;

        return (
            <Card
                className="bill card"
                expandable={false}
                expanded={true}
            >
                <CardText className="bill-details">
                    <div className="row billCardHeader">
                        <span>Invoice number {bill.id}</span>
                        <Link to={`/bill/${bill.id}`}>
                            <FlatButton
                                label="Details"
                                icon={<DetailsIcon />}
                            />
                        </Link>
                    </div>
                    <div className="row">
                        <span className="label">Date: </span>
                        <span className="field">{new Date(bill.date).toLocaleDateString()}</span>
                    </div>
                    <div>Total: {bill.currency + ' ' + bill.total}</div>
                </CardText>
                {bill.client.bills[bill.client.bills.length - 1].id === bill.id ? 
                <CardActions>
                    <FlatButton
                        onClick={() => requestConfirmation({
                            title: 'Delete confrmation',
                            text: `Are you sure to delete bill n.${bill.id} dated ${new Date(bill.date).toLocaleDateString()} for the client ${bill.client.name}?`,
                            action: () => {
                                deleteBill(bill.id);
                                resetDialog();
                            }
                        })}
                        fullWidth={true}
                        label="delete"
                        icon={<DeleteIcon />}
                    >
                    </FlatButton>
                </CardActions>
                : null }
            </Card>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BillCard);
