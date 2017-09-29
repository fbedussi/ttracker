import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    deleteBill,
    updateBill,
} from '../actions';

import { formatTime } from '../helpers/helpers';

import DeleteIcon from 'material-ui/svg-icons/action/delete';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import EditableText from './EditableText';
import BackTo from './BackTo';
import DateBox from './DateBox';
import BillText from './BillText';


const mapStateToProps = (state) => ({
    bills: state.data.bills,
    lastUpdatedBillId: state.ui.lastUpdatedBillId,
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
            lastUpdatedBillId,
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

                <div className="row">
                    <span className="label">Total: {bill.currency} </span>
                    <EditableText
                        className="billTotal"
                        editable={false}
                        text={bill.total}
                        handleChange={(total) => updateBill(Object.assign({}, bill, {
                            total: Number(total) 
                        }))}
                    />    
                </div>

                {lastUpdatedBillId === bill.id ? <div className="row">
                    <RaisedButton
                        label="Refresh bill text"
                        icon={<RefreshIcon />}
                    />
                </div>
                : null }

                <div className="row">
                    <p>Cilient data</p>
                    <p>
                        <span className="label">Name: </span>
                        <span className="data">{bill.client.name}</span>
                    </p>
                    <p>
                        <span className="label">Address: </span>
                        <span className="data">{bill.client.billingInfo.address}</span>
                    </p>
                    <p>
                        <span className="label">VAT number: </span>
                        <span className="data">{bill.client.billingInfo.vatNumber}</span>
                    </p>
                    <p>
                        <span className="label">E-mail: </span>
                        <span className="data">{bill.client.billingInfo.email}</span>
                    </p>
                    <p>
                        <span className="label">Phone: </span>
                        <span className="data">{bill.client.billingInfo.phone}</span>
                    </p>
                </div>

                <BillText 
                        text={bill.text}
                        className="billText"
                        handleChange={(text) => updateBill(Object.assign({}, bill, {text}))}
                />

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