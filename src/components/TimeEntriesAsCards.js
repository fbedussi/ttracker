import React from 'react';

import TimeEntry from './TimeEntry';

const TimeEntriesAsCards = ({
            activity,
        }) => (
        <div className="timeEntriesCards">
            {activity.timeEntries.map((timeEntry, i) =>
                <TimeEntry
                    key={timeEntry.id}
                    activity={activity}
                    timeEntry={timeEntry}
                />
            )}
        </div>
    );

export default TimeEntriesAsCards;
