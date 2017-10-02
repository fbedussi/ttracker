import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    toggleTimeEntriesRegistryAsTable,
    updateOptions,
} from '../actions';

import Toggle from 'material-ui/Toggle';
import Checkbox from 'material-ui/Checkbox';

import EditableText from './EditableText';
import EditableTextArea from './EditableTextArea';

const mapStateToProps = (state) => ({
    currency: state.options.currency,
    defaultHourlyRate: state.options.defaultHourlyRate,
    allowZeroTotalBill: state.options.allowZeroTotalBill,
    billTextTemplate: state.options.billTextTemplate,
});

const mapDispatchToProps = (dispatch) => ({
    updateOptions: (newOption) => dispatch(updateOptions(newOption)),
});

class OptionsPane extends Component {
    render() {
        const {
            currency,
            defaultHourlyRate,
            allowZeroTotalBill,
            billTextTemplate,
            updateOptions,
        } = this.props;

        return (
            <div className="optionsWrapper">
                <h2 className="sectionSubtitle">Options</h2>
                <div className="row">
                    <span className="label">{`Currency: `} </span>
                    <EditableText
                        className="currencyField"
                        editable={false}
                        text={currency}
                        handleChange={(currency) => updateOptions({
                            currency
                        })}
                    />
                </div>

                <div className="row">
                    <div className="hourlyRateLabel label">{`Default hourly rate: `} </div>
                    <div>
                        {currency}
                        <EditableText
                            className="hourlyRateField"
                            editable={false}
                            text={defaultHourlyRate}
                            handleChange={(defaultHourlyRate) => updateOptions({
                                defaultHourlyRate: Number(defaultHourlyRate)
                            })}
                        />
                    </div>
                </div>

                <div className="row">
                    <span className="label">{`Allow zero total bills: `} </span>
                    <span>
                        <Checkbox 
                            checked={allowZeroTotalBill}
                            onCheck={(e, allowZeroTotalBill) => updateOptions({
                                allowZeroTotalBill
                            })}
                        />
                    </span>
                </div>

                <div className="row">
                    <div className="label">{`Bill text template: `} </div>
                    <EditableTextArea 
                            text={billTextTemplate}
                            handleChange={(billTextTemplate) => updateOptions({billTextTemplate})}
                    />
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OptionsPane);
