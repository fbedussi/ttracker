import React, { Component } from 'react';
import { connect } from 'react-redux';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import { login } from '../actions';

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  login: (loginData) => dispatch(login(loginData))
});

class LoginForm extends Component {

  submitHandler() {
    this.props.login({ email: this.email.input.value, password: this.password.input.value })
  }

  render() {
    return (
      <Paper className="loginForm" zDepth={1} >
        <TextField
          ref={(input) => { this.email = input; }}
          hintText="E-mail"
          floatingLabelText="E-mail"
          type="email"
        />
        <TextField
          ref={(input) => { this.password = input; }}
          hintText="Password"
          floatingLabelText="Password"
          type="password"
        />
        <RaisedButton
          label="Login"
          onClick={() => this.submitHandler()}
        />
      </Paper>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
