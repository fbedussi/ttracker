import React, { Component } from 'react';

class EditableTextArea extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: props.text,
            editing: false
        }
    }

    setHeight() {
        this.textarea.style.height = `${this.textarea.scrollHeight}px`;
    }

    componentDidMount() {
        this.setHeight();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            text: nextProps.text,
        });    
    }

    handleLocalChange(text) {
        this.setState({
            text,
            editing: true
        });

        this.setHeight();
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
            className = '',
            text,
            handleChange
        } = this.props;

        return (
            <textarea
                ref={(textarea) => { this.textarea = textarea; }}
                className={className + ' editableTextArea'}
                value={this.state.text}
                onChange={(e) => this.handleLocalChange(e.target.value)}
                onBlur={(e) => this.save(e.target.value)}
            />
        );
    }
}

export default EditableTextArea;