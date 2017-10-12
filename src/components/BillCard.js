import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

import { convertMsToH } from '../helpers/helpers';

import { formatTime } from '../helpers/helpers';

import {
    deleteBill,
    updateBill,
} from '../actions';

import FlatButton from 'material-ui/FlatButton';
import { Card, CardActions, CardText } from 'material-ui/Card';
import DetailsIcon from 'material-ui/svg-icons/action/pageview';

import DateBox from './DateBox';
import DeleteBillButton from './DeleteBillButton';

const mapStateToProps = (state) => ({
    currency: state.options.currency
});

const mapDispatchToProps = (dispatch) => ({
    deleteBill: (billId) => dispatch(deleteBill(billId)),
    updateBill: (bill) => dispatch(updateBill(bill)), 
});

class BillCard extends Component {
    render() {
        const { 
            history,
            bill,
            deleteBill,
            updateBill,
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
                    <DeleteBillButton
                        bill={bill}
                        deleteBill={deleteBill}
                    />
                </CardActions>
                : null }
            </Card>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BillCard);
