import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';

class ImportDataWidget extends Component {
    constructor(props) {
        super(props);

        this.state = {
            panelOpen: false,
        }
    }

    render() {
        return (
            <div className={`importJsonPanel ${this.state.panelOpen ? 'is-open' : 'is-closed'}`}>
                <RaisedButton
                    className={this.state.panelOpen ? 'hide' : 'show'}
                    label="Import data"
                    onClick={() => this.setState({panelOpen: !this.state.panelOpen})}
                />
            
                <div className="importJsonArea">
                    <p>Paste JSON to import here:</p>
                    <textarea
                        ref={(textarea) => { this.textarea = textarea; }}
                        className="jsonPanelTextArea"
                    />
                    <RaisedButton
                        label="Import data"
                        onClick={() => this.props.onSave(this.textarea.value)}
                    />
                </div>
            </div>
        );
    }
}

export default ImportDataWidget;