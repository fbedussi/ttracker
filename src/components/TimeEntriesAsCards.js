import React, { Component } from 'react';
import { connect } from 'react-redux';

import TimeEntry from './TimeEntry';

const mapStateToProps = (state) => ({
    activities: state.activities
});

const mapDispatchToProps = (dispatch) => ({
});

class TimeEntriesAsCards extends Component {
    render() {
        const {
            activityId,
            activities
        } = this.props;

        const activity = activities
            .filter((activity) => activity.id === activityId)
            .reduce((acc, i) => i, null)
        ;

        return (
            <div className="timeEntriesCards">
                {activity.timeEntries.map((timeEntry) =>
                    <TimeEntry
                        key={timeEntry.id}
                        activity={activity}
                        timeEntry={timeEntry}
                    />
                )}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeEntriesAsCards);
