import React from 'react';

import { Link } from 'react-router-dom'

import Chip from 'material-ui/Chip';

import EditableText from './EditableText';

const styles = {
    chip: {
        margin: 4,
    }
};



const ActivityChip = ({
            activities,
            activityId,
            changeActivityName
        }) => {
        const activity = activities.find((activity) => activity.id === activityId);

        return (
            <Link to={`/activity/${activityId}`}>
                <Chip
                    style={styles.chip}
                    onRequestDelete={() => { }}
                >
                    <EditableText
                        className="chipText"
                        editable={activity.editableName}
                        text={activity.name}
                        handleChange={(text) => changeActivityName(activity, text)}
                    />
                </Chip>
            </Link>)
        }

export default ActivityChip;
