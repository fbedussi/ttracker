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
    currency: state.currency
});

const mapDispatchToProps = (dispatch) => ({
    deleteTimeEntry: (timeEntry, activity) => dispatch(deleteTimeEntry(timeEntry, activity)),
    updateTimeEntry: (props) => dispatch(updateTimeEntry(props))
});

class TimeEntry extends Component {
    render() {
        const { 
            activity,
            timeEntry,
            currency,
            updateTimeEntry,
            deleteTimeEntry,
        } = this.props;

        const totalTime = timeEntry.endTime > 0 ? timeEntry.endTime - timeEntry.startTime : 0;

        return (
            <Card
                className="timeEntry"
                expandable={false}
                expanded={true}
            >
                <CardText className="timeEntry-details">
                    <div className="row">Start time:
                        <DateTime
                            time={timeEntry.startTime}
                            updateTime={(newTime) => updateTimeEntry(
                                Object.assign({}, timeEntry, {
                                    startTime: newTime
                                })
                            )}
                        />
                    </div>
                    <div className="row">End time:
                        <DateTime
                            time={timeEntry.endTime}
                            updateTime={(newTime) => updateTimeEntry(
                                Object.assign({}, timeEntry, {
                                    endTime: newTime
                                })
                            )}
                        />
                    </div>
                    <div className="row">Time (h:mm:ss): {totalTime > 0 ? formatTime(totalTime) : ''}</div>
                    <div>Cost: {currency + ' ' + Math.round(convertMsToH(totalTime) * activity.hourlyRate)}</div>
                </CardText>
                <CardActions>
                    <FlatButton
                        onClick={() => deleteTimeEntry(timeEntry, activity)}
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

export default connect(mapStateToProps, mapDispatchToProps)(TimeEntry);
