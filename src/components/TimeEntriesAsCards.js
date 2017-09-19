import React, { Component } from 'react';
import { connect } from 'react-redux';

import TimeEntry from './TimeEntry';

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

class TimeEntriesAsCards extends Component {
    render() {
        const {
            activity,
        } = this.props;

        return (
            <div className="timeEntriesCards">
                {activity.timeEntries.map((timeEntry, i) =>
                    <TimeEntry
                        key={i}
                        activity={activity}
                        timeEntry={timeEntry}
                    />
                )}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeEntriesAsCards);
