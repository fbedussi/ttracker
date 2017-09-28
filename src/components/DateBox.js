import React from 'react';

import DatePicker from 'material-ui/DatePicker';

const DateBox = ({
            time,
            updateDate,
        }) => (
        <div className="date">
            {time > 0 ?
                <span>
                    <DatePicker
                        name="datePicker"
                        value={new Date(time)}
                        onChange={(e, date) => {
                            updateDate(date.getTime());
                        }}
                    />
                </span>
                : ''}
        </div>
    )

export default DateBox;
