import React, { Component } from 'react';
import { connect } from 'react-redux';

import { convertMsToH } from '../helpers/helpers';

import { formatTime } from '../helpers/helpers';

import {
    deleteTimeEntry,
    updateTimeEntry
} from '../actions';

import DeleteIcon from 'material-ui/svg-icons/action/delete';
import FlatButton from 'material-ui/FlatButton';
import { Card, CardActions, CardText } from 'material-ui/Card';

import DateTime from './DateTime';

const mapStateToProps = (state) => ({
    currency: state.options.currency
});

const mapDispatchToProps = (dispatch) => ({
    deleteTimeEntry: (activity, timeEntry) => dispatch(deleteTimeEntry(activity, timeEntry)),
    updateTimeEntry: (activity, props) => dispatch(updateTimeEntry(activity, props))
});

class Bill extends Component {
    render() {
        const { 
            bill,
        } = this.props;

        return (
            <Card
                className="bill"
                expandable={false}
                expanded={true}
            >
                <CardText className="bill-details">
                    <p className="row">Invoice number {bill.id}</p>
                    <div className="row">Date:
                        <DateTime />
                            time={bill.date}
                            updateTime={(newDate) => updateBill(
                                Object.assign({}, bill, {
                                    date: newDate
                                })
                            )}
                        />
                    </div>
                    <div className="row">Total: {bill.currency + ' ' + bill.total}</div>
                    <p className="row">
                        Cilient data: <br/>
                        {client.name}<br />
                        {client.billingInfo.address}<br />
                        {client.billingInfo.vatNumber}
                    </p>
                </CardText>
                <CardActions>
                    <FlatButton
                        onClick={() => deleteTimeEntry(activity, timeEntry)}
                        fullWidth={true}
                        label="delete"
                        icon={<DeleteIcon />}
                    >
                    </FlatButton>
                </CardActions>
            </Card>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bill);
