import React from 'react';
import { Link } from 'react-router-dom'

import IconButton from 'material-ui/IconButton';
import BackIcon from 'material-ui/svg-icons/hardware/keyboard-backspace';

const BackTo = ({history}) => (
  <div className="backToWrapper">
      <IconButton
        onClick={() => history.goBack()}
      >
        <BackIcon />
      </IconButton>
  </div>
);

export default BackTo;
