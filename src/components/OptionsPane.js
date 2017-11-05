import React from 'react';
import { connect } from 'react-redux';

import {
    updateOptions,
    exportData,
    importData,
} from '../actions';

import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';

import EditableText from './EditableText';
import EditableTextArea from './EditableTextArea';
import ImportDataWidget from './ImportDataWidget'

const mapStateToProps = (state) => ({
    currency: state.options.currency,
    defaultHourlyRate: state.options.defaultHourlyRate,
    allowZeroTotalBill: state.options.allowZeroTotalBill,
    billTextTemplate: state.options.billTextTemplate,
});

const mapDispatchToProps = (dispatch) => ({
    updateOptions: (newOption) => dispatch(updateOptions(newOption)),
    exportData: () => dispatch(exportData()),
    importData: (jsonData) => dispatch(importData(jsonData)),
});

const OptionsPane = ({
            currency,
            defaultHourlyRate,
            allowZeroTotalBill,
            billTextTemplate,
            updateOptions,
            exportData,
            importData,
        }) => (
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
                            className="billTextTemplate"
                            text={billTextTemplate}
                            handleChange={(billTextTemplate) => updateOptions({billTextTemplate})}
                    />
                </div>

                <div className="row">
                    <RaisedButton
                            label="export data"
                            onClick={exportData}
                    />
                </div>

                <div className="row">
                    <ImportDataWidget 
                        onSave={importData}
                    />
                </div>
            </div>
        )

export default connect(mapStateToProps, mapDispatchToProps)(OptionsPane);
