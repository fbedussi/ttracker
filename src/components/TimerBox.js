import React from 'react';

import RecordIcon from 'material-ui/svg-icons/av/fiber-manual-record';
import StopIcon from 'material-ui/svg-icons/av/stop';
import FlatButton from 'material-ui/FlatButton';

import Timer from './Timer';

const TimerBox = ({
        activity,
        startActivity,
        stopActivity,
    }) => (
        <div className="timerBox">
            <FlatButton
                label="Start"
                icon={<RecordIcon />}
                onClick={() => startActivity(activity)}
                style={activity.active ? { display: 'none' } : { display: 'block' }}
            />
            <FlatButton
                label="Stop"
                icon={<StopIcon />}
                onClick={() => stopActivity(activity.id)}
                style={activity.active ? { display: 'block' } : { display: 'none' }}
            />
            <Timer
                startTime={activity.timeEntries.length ? activity.timeEntries[activity.timeEntries.length - 1].startTime : 0}
                tick={activity.active}
            />
        </div>
    )

export default TimerBox;