import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

import {
    deleteBill,
    updateBill,
    refreshBillText,
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
    refreshBillText: (billId) => dispatch(refreshBillText(billId)),
});


class SingleBill extends Component {
    render() {
        const {
            history,
            bills,
            deleteBill,
            updateBill,
            refreshBillText,
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
                <h1 className="titleBar">
                    <span className="row">Invoice number {bill.id}</span>
                    {bill.client.bills[bill.client.bills.length - 1].id === bill.id ?
                        <span>
                            <FlatButton
                                onClick={() => deleteBill(bill.id)}
                                fullWidth={true}
                                label="delete"
                                icon={<DeleteIcon />}
                            >
                            </FlatButton>
                        </span>
                        : null
                    }
                </h1>

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
                        onClick={() => refreshBillText(bill.id)}
                    />
                </div>
                : null }

                <div className="row">
                    <h2 className="sectionSubtitle">Client data</h2>
                    <p>
                        <span className="label">Name: </span>
                        <span className="data">
                            <Link to={`/client/${bill.client.id}`}>
                                {bill.client.name}
                            </Link>
                        </span>
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
                
                <h2 className="sectionSubtitle">Bill text</h2>
                <BillText 
                        text={bill.text}
                        className="billText"
                        handleChange={(text) => updateBill(Object.assign({}, bill, {text}))}
                />
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleBill);