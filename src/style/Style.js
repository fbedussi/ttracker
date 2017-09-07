import React from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

const style = (props) => (
  <style>
      {`input:focus {
          border-color: ${props.muiTheme.palette.accent1Color};
      }`}
  </style>
);

export default muiThemeable()(style);