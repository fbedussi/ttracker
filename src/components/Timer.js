import React, { Component } from 'react';

import Paper from 'material-ui/Paper';

import {formatTime} from '../helpers/helpers';

const getTime = (startTime) => Date.now() - startTime;

class Timer extends Component {
  constructor(props) {
    super(props);

    this.tick = null;

    this.state = {
      timer: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tick) {
      this.tick = setInterval(() => this.setState({
        timer: getTime(this.props.startTime)
      }), 1000);
    } else {
      clearInterval(this.tick);
    }
  }

  render() {
    return (
      <Paper 
        className="timer"
        zDepth={1}
      >
        {formatTime(this.state.timer)}
      </Paper>
    );
  }
}

export default Timer;
