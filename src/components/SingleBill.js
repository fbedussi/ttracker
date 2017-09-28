import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    deleteBill,
    updateBill,
} from '../actions';

import { formatTime } from '../helpers/helpers';

import DeleteIcon from 'material-ui/svg-icons/action/delete';
import FlatButton from 'material-ui/FlatButton';

import EditableText from './EditableText';
import BackTo from './BackTo';
import DateBox from './DateBox';


const mapStateToProps = (state) => ({
    bills: state.data.bills,
});

const mapDispatchToProps = (dispatch) => ({
    deleteBill: (billId) => dispatch(deleteBill(billId)),
    updateBill: (bill) => dispatch(updateBill(bill)),
});


class SingleBill extends Component {
    render() {
        const {
            history,
            bills,
            deleteBill,
            updateBill,
        } = this.props;
        const billId = Number(this.props.match.params.billId);
        const bill = bills
            .filter((bill) => bill.id === billId)
            .reduce((acc, i) => i, null)
            ;

        if (!bill) {
            return (
                <div>
                    <BackTo history={history} />
                    <div>{`ERROR: no bill with id ${billId}`}</div>
                </div>
            );
        }

        return (
            <div className="mainWrapper">
                <BackTo
                    history={history}
                    title={`Bill id:${bill.id}`}
                />
                <p className="row">Invoice number {bill.id}</p>

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

                <p className="row">
                    Cilient data: <br />
                    {bill.client.name}<br />
                    {bill.client.billingInfo.address}<br />
                    {bill.client.billingInfo.vatNumber}<br />
                    {bill.client.billingInfo.email}<br />
                    {bill.client.billingInfo.phone}
                </p>

                <textarea className="row billText" defaultValue={bill.text}>
                    
                </textarea>

                {bill.client.bills[bill.client.bills.length - 1].id === bill.id ?
                    <FlatButton
                        onClick={() => deleteBill(bill.id)}
                        fullWidth={true}
                        label="delete"
                        icon={<DeleteIcon />}
                    >
                    </FlatButton>
                    : null
                }
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleBill);