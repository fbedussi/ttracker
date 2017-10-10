    import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    deleteBill,
    updateBill,
    refreshBillText,    
} from '../actions';

import { objHasDeepProp } from '../helpers/helpers';

import PrintIcon from 'material-ui/svg-icons/action/print';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import RaisedButton from 'material-ui/RaisedButton';
import SvgIconFace from 'material-ui/svg-icons/action/face';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import { blue300, indigo900 } from 'material-ui/styles/colors';

import EditableText from './EditableText';
import BackTo from './BackTo';
import DateBox from './DateBox';
import EditableTextArea from './EditableTextArea';
import DeleteButton from './DeleteButton';


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

                <div className="chipWrapper row hideInPrint">
                    {objHasDeepProp(bill, 'client.id') ?
                        <Chip className="chip"
                            backgroundColor={blue300}
                            onClick={() => history.push(`/client/${bill.client.id}`)}
                        >
                            <Avatar color="#fff" icon={<SvgIconFace />} backgroundColor={indigo900} />
                            {bill.client.name}
                        </Chip>
                        : null
                    }
                </div>

                <h1 className="titleBar hideInPrint">
                    <span className="row">Invoice</span>
                    {bill.client.bills[bill.client.bills.length - 1].id === bill.id ?
                        <span>
                            <DeleteButton
                                buttonLabel="Delete"
                                dialogMessage={`Are you sure to delete bill n.${bill.id} dated ${new Date(bill.date).toLocaleDateString()} for the client ${bill.client.name}?`}
                                deleteAction={() => {
                                    deleteBill(bill.id);
                                    history.push('/');
                                }}
                            />
                        </span>
                        : null
                    }
                </h1>

                <div className="row hideInPrint">Number: {bill.id}</div>

                <div className="row hideInPrint">Date:
                        <DateBox
                        time={bill.date}
                        updateDate={(newDate) => updateBill(
                            Object.assign({}, bill, {
                                date: newDate
                            })
                        )}
                    />
                </div>

                <div className="row hideInPrint">
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
                        label="Refresh bill text hideInPrint"
                        icon={<RefreshIcon />}
                        onClick={() => refreshBillText(bill.id)}
                    />
                </div>
                : null }
                
                <h2 className="sectionSubtitle hideInPrint">Bill text</h2>
                <div className="row">
                    <EditableTextArea 
                            text={bill.text}
                            className="billText print"
                            handleChange={(text) => updateBill(Object.assign({}, bill, {text}))}
                    />
                </div>

                <div className="row hideInPrint">
                    <RaisedButton
                        label="Print"
                        icon={<PrintIcon/>}
                        onClick={() => window.print()}
                    />
                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleBill);