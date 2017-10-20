import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

import {
    deleteBill,
    updateBill,
} from '../actions';

import FlatButton from 'material-ui/FlatButton';
import { Card, CardActions, CardText } from 'material-ui/Card';
import DetailsIcon from 'material-ui/svg-icons/action/pageview';

import DeleteBillButton from './DeleteBillButton';

const mapStateToProps = (state) => ({
    currency: state.options.currency
});

const mapDispatchToProps = (dispatch) => ({
    deleteBill: (billId) => dispatch(deleteBill(billId)),
    updateBill: (bill) => dispatch(updateBill(bill)), 
});

const BillCard = ({ 
            bill,
            deleteBill,
        }) => (
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

export default connect(mapStateToProps, mapDispatchToProps)(BillCard);
