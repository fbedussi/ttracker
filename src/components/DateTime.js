import React from 'react';

import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

function addHoursAndMinutesToDate(date, hours = 0, minutes = 0) {
    return date.getTime() + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
}

const DateTime = ({
            time,
    updateTime,
        }) => (
        <div className="dateTime">
            {time > 0 ?
                <span>
                    <DatePicker
                        name="datePicker"
                        value={new Date(time)}
                        onChange={(e, date) => {
                            var newTime = addHoursAndMinutesToDate(
                                date,
                                new Date(time).getHours(),
                                new Date(time).getMinutes()
                            );

                            updateTime(newTime);
                        }}
                    />
                    <TimePicker
                        name="timePicker"
                        value={new Date(time)}
                        onChange={(e, date) => {
                            updateTime(date.getTime());
                        }}
                    />
                </span>
                : ''}
        </div>
    )

export default DateTime;
