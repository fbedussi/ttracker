import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

import { convertMsToH } from '../helpers/helpers';

import { formatTime } from '../helpers/helpers';

import {
    deleteBill,
    updateBill
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
    updateBill: (bill) => dispatch(updateBill(bill))
});

class Bill extends Component {
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
                    <p className="row">Invoice number {bill.id}</p>
                    <Link to={`/bill/${bill.id}`}>
                        <FlatButton
                            label="Details"
                            icon={<DetailsIcon />}
                        />
                    </Link>
                    <div className="row">Date:
                        <DateBox
                            time={bill.date}
                            updateDate={(newDate) => updateBill(
                                Object.assign({}, bill, {
                                    date: newDate
                                })
                            )}
                        />
                    </div>
                    <div className="row">Total: {bill.currency + ' ' + bill.total}</div>
                </CardText>
                {bill.client.bills[bill.client.bills.length - 1].id === bill.id ? 
                <CardActions>
                    <FlatButton
                        onClick={() => deleteBill(bill.id)}
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

export default connect(mapStateToProps, mapDispatchToProps)(Bill);
