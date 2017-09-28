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

class TimeEntry extends Component {
    render() {
        const { 
            activity,
            timeEntry,
            currency,
            updateTimeEntry,
            deleteTimeEntry,
        } = this.props;

        return (
            <Card
                className="timeEntry card"
                expandable={false}
                expanded={true}
            >
                <CardText className="timeEntry-details">
                    <div className="row">Start time:
                        <DateTime
                            time={timeEntry.startTime}
                            updateTime={(newTime) => updateTimeEntry(
                                activity,
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
                                activity,
                                Object.assign({}, timeEntry, {
                                    endTime: newTime
                                })
                            )}
                        />
                    </div>
                    <div className="row">Time (h:mm:ss): {timeEntry.duration > 0 ? formatTime(timeEntry.duration) : ''}</div>
                    <div>Cost: {currency + ' ' + Math.round(timeEntry.cost)}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(TimeEntry);
