import React, { Component } from 'react';

class EditableText extends Component {
    componentDidMount() {
        if (this.props.editable) {
            this.input.focus();
            this.input.select();
        }
    }

    handleKeyUp(keyCode) {
        if (keyCode !== 13) {
            return;
        }
        this.input.blur();
    }

    render() {
        const {
            className,
            text,
            handleChange
        } = this.props;

        return (
            <input
                ref={(input) => { this.input = input; }}
                className={className}
                value={text}
                onChange={(e) => handleChange(e.target.value)}
                onKeyUp={(e) => this.handleKeyUp(e.keyCode)}
            />
        );
    }
}

export default EditableText;