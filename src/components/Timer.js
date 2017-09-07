import React, { Component } from 'react';

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
      <div className="timer">
        {formatTime(this.state.timer)}
      </div>
    );
  }
}

export default Timer;
