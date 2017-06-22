import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import './navbar.css';

const customContentStyle = {
  width: '25%',
};

export default class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = { username: '', password: '' };
  }

  handleUsernameChange(e) {
    this.setState({ username: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  // export default function Login({ open, onCancel, onLogin }) {
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.props.onCancel}
        key={1}
      />,
      <FlatButton
        label="Sign in"
        primary
        onTouchTap={() => this.props.onLogin(this.state.username, this.state.password)}
        key={2}
      />,
    ];
    return (
      <Dialog
        title="Sign in"
        modal={false}
        open={this.props.open}
        contentStyle={customContentStyle}
      >
        <form
          action="/"
          method="POST"
          onSubmit={this.props.onLogin}
        >
          <TextField name="username" hintText="User ID" value={this.state.username} onChange={e => this.handleUsernameChange(e)} />
          <br />
          <TextField name="password" type="password" hintText="Password" value={this.state.password} onChange={e => this.handlePasswordChange(e)} />
          <div style={{ textAlign: 'right', padding: 8, margin: '24px -24px -24px -24px' }}>
            {actions}
          </div>
        </form>
      </Dialog>
    );
  }
}

Login.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
};