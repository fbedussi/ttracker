import React, { Component } from 'react';

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
            this.input.focus();
            this.input.select();
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({text: nextProps.text});        
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
        this.setState({
            text,
            editing: false
        });

        this.props.handleChange(text);
    }

    render() {
        var {
            className,
            text,
            handleChange
        } = this.props;

        return (
            <input
                ref={(input) => { this.input = input; }}
                className={className}
                value={this.state.text}
                onChange={(e) => this.handleLocalChange(e.target.value)}
                onBlur={(e) => this.save(e.target.value)}
                onKeyUp={(e) => this.handleKeyUp(e.keyCode)}
            />
        );
    }
}

export default EditableText;