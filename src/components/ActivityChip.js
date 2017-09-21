import React from 'react';

import { Link } from 'react-router-dom'

import Chip from 'material-ui/Chip';

const styles = {
    chip: {
        margin: 4,
    }
};

const ActivityChip = ({
        activity,
    }) => {

    return (
        <Link to={`/activity/${activity.id}`}>
            <Chip
                style={styles.chip}
            >                    
                {activity.name}
            </Chip>
        </Link>
    )        
}

export default ActivityChip;
