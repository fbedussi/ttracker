import React, { Component } from 'react';

import DeleteIcon from 'material-ui/svg-icons/action/delete';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';

class DeleteButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dialogOpen: false,
            dialogOptionValue: this.props.dialogDefaultOptionValue
        }
    }

    openDialog() {
        this.setState({
            dialogOpen: true
        });
    }

    closeDialog() {
        this.setState({
            dialogOpen: false
        });
    }

    setOption(optionValue) {
        this.setState({
            dialogOptionValue: optionValue
        })
    }

    handleDelete() {
        this.closeDialog();
        this.props.deleteAction(this.state.dialogOptionValue);
    }

    render() {
        const {
            buttonLabel,
            dialogMessage,
            dialogOptionText,
        } = this.props;

        return (
            <div>
                <FlatButton
                    label={buttonLabel}
                    icon={<DeleteIcon />}
                    onClick={() => this.openDialog()}
                />
                <Dialog
                    title="Delete confrmation"
                    modal={true}
                    open={this.state.dialogOpen}
                    actions={[
                        <RaisedButton
                            label="Ok"
                            primary={true}
                            onClick={() => this.handleDelete()}
                            style={{ marginRight: '1em' }}
                        />,
                        <RaisedButton
                            label="cancel"
                            onClick={() => this.closeDialog()}
                        />
                    ]}
                >
                    {dialogMessage}
                    {dialogOptionText && dialogOptionText.length ? <div>
                        <Checkbox
                            label={dialogOptionText}
                            checked={this.state.dialogOptionValue}
                            onCheck={(e, optionValue) => this.setOption(optionValue)}
                        />
                    </div>
                        : null}
                </Dialog>
            </div>
        )
    }
}

export default DeleteButton;
