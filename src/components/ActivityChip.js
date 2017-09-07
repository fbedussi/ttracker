import React from 'react';

import { Link } from 'react-router-dom'

import Chip from 'material-ui/Chip';

const styles = {
    chip: {
        margin: 4,
    }
};

const ActivityChip = ({
        activities,
        activityId,
    }) => {
    
    const activity = activities.find((activity) => activity.id === activityId);

    return (
        <Link to={`/activity/${activityId}`}>
            <Chip
                style={styles.chip}
            >                    
                {activity.name}
            </Chip>
        </Link>
    )        
}

export default ActivityChip;