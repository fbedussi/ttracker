import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import IconButton from 'material-ui/IconButton';
import BackIcon from 'material-ui/svg-icons/hardware/keyboard-backspace';

const BackToHome = () => (
  <div className="backToWrapper">
    <Link to="/">
      <IconButton>
        <BackIcon />
      </IconButton>
    </Link>
  </div>
);

export default BackToHome;
