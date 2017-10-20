import React, { Component } from 'react';

import TextField from 'material-ui/TextField';

const selectText = (inputEl) => {
    inputEl.focus();
    inputEl.select();
}

class EditableText extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: props.text,
            editing: props.editable
        }
    }

    componentDidMount() {
        if (this.props.editable) {
            selectText(this.input);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            text: nextProps.text,
            editing: nextProps.editable
        });    
        
        if (nextProps.editable) {
            selectText(this.input);
        }    
    }

    handleKeyUp(keyCode) {
        if (keyCode !== 13) {
            return;
        }
        this.input.blur();
    }

    handleLocalChange(text) {
        this.setState({
            text,
            editing: true
        });
    }

    save(text) {
        if (!this.state.editing) {
            return;
        }
        
        this.setState({
            text,
            editing: false
        });

        this.props.handleChange(text);
    }

    render() {
        var {
            className,
        } = this.props;

        return (
            <TextField
                ref={(input) => { this.input = input; }}
                name={className}
                className={className + ' editableText'}
                value={this.state.text}
                onChange={(e) => this.handleLocalChange(e.target.value)}
                onBlur={(e) => this.save(e.target.value)}
                onKeyUp={(e) => this.handleKeyUp(e.keyCode)}
            />
        );
    }
}

export default EditableText;