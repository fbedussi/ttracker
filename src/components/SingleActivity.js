import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createNewActivity, deleteActivity, deleteTimeEntry } from '../actions';
import { Link } from 'react-router-dom'

import { convertMsToH } from '../helpers/helpers';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import DetailsIcon from 'material-ui/svg-icons/action/pageview';
import CloseIcon from 'material-ui/svg-icons/content/clear';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

const styles = {
    chip: {
        margin: 4,
    },
    wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    fab: {
        display: 'none',
        position: 'fixed',
        right: '2em',
        bottom: '2em'
    }
};

const mapStateToProps = (state) => ({
    clients: state.clients,
    activities: state.activities
});

const mapDispatchToProps = (dispatch) => ({
    deleteTimeEntry: (timeEntry) => dispatch(deleteTimeEntry(timeEntry))
});


class SingleActivity extends Component {
    render() {
        const { clients, activities, deleteTimeEntry } = this.props;
        const activityId = Number(this.props.match.params.activityId);
        const activity = activities
            .filter((activity) => activity.id === activityId)
            .reduce((acc, i) => i, null)

        if (!activity) {
            return (<div>{`ERROR: no activity with id ${activityId}`}</div>)
        }

        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Link to="/">
                        <IconButton>
                            <CloseIcon />
                        </IconButton>
                    </Link>
                </div>
                Id: {activity.id}
                Name: {activity.name}
                <Subheader>Time entries</Subheader>
                <Table>
                    <TableHeader
                        adjustForCheckbox={false}
                    >
                        <TableRow>
                            <TableHeaderColumn>Start time</TableHeaderColumn>
                            <TableHeaderColumn>End time</TableHeaderColumn>
                            <TableHeaderColumn>Duration</TableHeaderColumn>
                            <TableHeaderColumn>Cost</TableHeaderColumn>
                            <TableHeaderColumn>Edit</TableHeaderColumn>
                            <TableHeaderColumn>Delete</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {activity.timeEntries.map((timeEntry) => {
                            const hours = convertMsToH(timeEntry.getTotalTime());
                            return <TableRow key={timeEntry.id}>
                                <TableRowColumn>{new Date(timeEntry.startTime).toLocaleString()}</TableRowColumn>
                                <TableRowColumn>{new Date(timeEntry.endTime).toLocaleString()}</TableRowColumn>
                                <TableRowColumn>{hours + 'hrs'}</TableRowColumn>
                                <TableRowColumn>{'€ ' + hours * activity.hourlyRate}</TableRowColumn>
                                <TableRowColumn><EditIcon /></TableRowColumn>
                                <TableRowColumn>
                                    <IconButton
                                        onclick={() => deleteTimeEntry(timeEntry, activity)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableRowColumn>
                            </TableRow>
                        }
                        )}
                    </TableBody>
                </Table>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleActivity);
