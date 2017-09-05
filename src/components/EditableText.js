import React, { Component } from 'react';

class EditableText extends Component {
    componentDidMount() {
        if (this.props.editable) {
            this.input.focus();
            this.input.select();
        } else {
            this.input.blur();
        }
    }

    render() {
        return (
            <input
                ref={(input) => { this.input = input; }}
                className={this.props.className}
                value={this.props.text}
                onChange={(e) => this.props.handleChange(e.target.value)}
            />
        );
    }
}

export default EditableText;