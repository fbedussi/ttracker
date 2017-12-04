import React from 'react';
import { connect } from 'react-redux';

import {
    closeUndoSnackbar,
    undoLastAction,
} from '../actions';

import Snackbar from 'material-ui/Snackbar';


const mapStateToProps = (state) => ({
    undoSnackbarOpen: state.ui.undoSnackbarOpen,
    undoMessage: state.ui.undoMessage,
    undoSnackbarAutoHideDuration: state.options.undoSnackbarAutoHideDuration,
    clients: state.data.clients,
    currency: state.options.currency,
});

const mapDispatchToProps = (dispatch) => ({
    closeUndoSnackbar: () => dispatch(closeUndoSnackbar()),
    undoLastAction: () => dispatch(undoLastAction()),
});

const UndoSnackbar = ({
        undoSnackbarOpen,
        undoMessage,
        clients,
        undoSnackbarAutoHideDuration,
        undoLastAction,
        closeUndoSnackbar,
    }) => (
    <Snackbar
    open={undoSnackbarOpen}
    message={undoMessage}
    action="undo"
    autoHideDuration={undoSnackbarAutoHideDuration}
    onActionTouchTap={undoLastAction}
    onRequestClose={closeUndoSnackbar}
  />
) 

export default connect(mapStateToProps, mapDispatchToProps)(UndoSnackbar);