import React from 'react';
import { Link } from 'react-router-dom'

import IconButton from 'material-ui/IconButton';
import BackIcon from 'material-ui/svg-icons/hardware/keyboard-backspace';
import HomeIcon from 'material-ui/svg-icons/action/home';

const BackTo = ({history, title}) => (
  <div className="backToWrapper">
      <IconButton
        onClick={() => history.goBack()}
      >
        <BackIcon />
      </IconButton>
      {title? title : null}
      {/* <Link to="/">
        <IconButton>
          <HomeIcon />
        </IconButton>
    </Link> */}
  </div>
);

export default BackTo;
