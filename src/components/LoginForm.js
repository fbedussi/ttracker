import React, { Component } from 'react';
import { connect } from 'react-redux';

import {login} from '../actions';

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  login: (loginData) => dispatch(login(loginData))
});

class LoginForm extends Component {
  render() {
    const { login } = this.props;

    return (<form 
        className="loginForm"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target;
          login({email: form.querySelector('#email').value, password: form.querySelector('#password').value})
        }}
      >
        <label htmlFor="email">E-mail address</label>
        <input id="email" type="email" placeholder="mail@example.com" />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" />
        <button type="submit">Login</button>
      </form>    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
