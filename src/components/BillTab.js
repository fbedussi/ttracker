import React, { Component } from 'react';
import { connect } from 'react-redux';

import BillCard from './BillCard';

const mapStateToProps = (state) => ({
    bills: state.data.bills,
});

const mapDispatchToProps = (dispatch) => ({
});

class BillTab extends Component {
    render() {
        const {
            history,
            bills,
        } = this.props;

        return (
            <div className="tabContent cardsWrapper">
                {bills.map((bill) => <BillCard
                    key={'bill_' + bill.id}
                    bill={bill}
                />)}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BillTab);