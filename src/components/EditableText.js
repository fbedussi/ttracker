import React, { Component } from 'react';

class EditableText extends Component {
    componentDidMount() {
        if (this.props.editable) {
            this.input.focus();
            this.input.select();
        }
    }

    // componentDidUpdate(prevProps) {
    //     if (!this.props.editable) {
    //         this.input.blur();
    //     }
    // }

    handleKeyUp(keyCode) {
        if (keyCode !== 13) {
            return;
        }
        this.input.blur();
        
        //this.props.disableEdit();
    }

    render() {
        return (
            <input
                ref={(input) => { this.input = input; }}
                className={this.props.className}
                value={this.props.text}
                onChange={(e) => this.props.handleChange(e.target.value)}
                onKeyUp={(e) => this.handleKeyUp(e.keyCode)}
                
            />
        );
    }
}

export default EditableText;