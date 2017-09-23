import React from 'react';

import { Link } from 'react-router-dom'

import Chip from 'material-ui/Chip';

const ActivityChip = ({
        activity,
    }) => {

    return (
        <Link to={`/activity/${activity.id}`}>
            <Chip className="chip">                    
                {activity.name}
            </Chip>
        </Link>
    )        
}

export default ActivityChip;
