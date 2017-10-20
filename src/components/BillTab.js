import React from 'react';
import { connect } from 'react-redux';

import BillCard from './BillCard';
import AppToolbar from './AppToolbar';

const mapStateToProps = (state) => ({
    bills: state.data.bills,
});

const mapDispatchToProps = (dispatch) => ({
});

const BillTab = ({
            history,
            bills,
        }) => (
            <div className="tabContent">
                <AppToolbar />
                <div className="cardsWrapper">
                    {bills.map((bill) => <BillCard
                        key={'bill_' + bill.id}
                        bill={bill}
                    />)}
                </div>
            </div>
        )
    
export default connect(mapStateToProps, mapDispatchToProps)(BillTab);