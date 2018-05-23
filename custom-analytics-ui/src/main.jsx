import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import picasso from 'picasso.js';
import picassoQ from 'picasso-plugin-q';

import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AcceptCookies from './components/acceptCookies';
import LandingPage from './components/landingPage';
import App from './components/app';
import Login from './components/login';
import PrivateRoute from './components/privateRoute';

import './main.css';

picasso.use(picassoQ);

const qliktiveRedirectParam = 'redirect_url=/#/app';

const auth = {

  isAuthenticated:
    fetch('/is-authenticated', {
      credentials: 'same-origin',
    }).then(response => response.json()),
  idp:
    fetch('/idp')
      .then(response => response.text()),
  authenticate() {
    window.location.href = `/login/github?${qliktiveRedirectParam}`;
  },
  localAuthenticate(username, password) {
    window.location.href = `/login/local/callback?username=${username}&password=${password}&${qliktiveRedirectParam}`;
  },
  signout(cb) {
    fetch('/logout', {
      credentials: 'same-origin',
    }).then(cb);
  },
};

// Main component responsible for rendering the routes when
// the path matches the route.
const Main = ({ isAuthenticated, notAuthorizedCallback }) => (
  <main>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <PrivateRoute path="/app" component={App} isAuthenticated={isAuthenticated} notAuthorizedCallback={notAuthorizedCallback} />
    </Switch>
  </main>
);

Main.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  notAuthorizedCallback: PropTypes.func,
};

Main.defaultProps = {
  notAuthorizedCallback: () => { },
};

const AppBarButtonStyle = { color: 'white' };

class ThePage extends React.Component {

  constructor(...args) {
    super(...args);

    this.state = {
      authMode: null,
      isAuthenticated: null,
      dialogIsOpen: false,
      cookieAccepted: document.cookie.indexOf('apqlikcoreaccept') !== -1,
    };

    auth.idp.then((authMode) => {
      this.setState({ authMode });
    });

    auth.isAuthenticated.then((authenticated) => {
      this.setState({ isAuthenticated: authenticated });
    });
  }

  signinClicked = () => {
    if (this.state.authMode === 'local') {
      this.setState({ dialogIsOpen: true });
    } else if (this.state.authMode === 'github') {
      auth.authenticate();
    }
  }

  signoutClicked = () => {
    auth.signout(() => { this.setState({ isAuthenticated: false }); });
  }

  notAuthorizedCallback = () => {
    if (this.state.authMode === 'local') {
      this.setState({ dialogIsOpen: true });
    } else if (this.state.authMode === 'github') {
      alert('Please sign in to access this page'); // eslint-disable-line no-alert
    }
  }

  cancelLoginClicked = () => {
    this.setState({ dialogIsOpen: false });
  }

  loginClicked = (username, password) => {
    auth.localAuthenticate(username, password);
  }

  acceptClicked = () => {
    const cookie = `apqlikcoreaccept=true; expires=${new Date('2050-01-01').toUTCString()}; path=/`;
    document.cookie = cookie;
    this.setState({ cookieAccepted: true });
  }

  navigateToLandingPage = () => {
    window.location.replace('#/');
  }

  navigateToAppPage = () => {
    window.location.replace('#/app');
  }

  render() {
    if (this.state.isAuthenticated === null) {
      return null;
    }
    return (
      <div>
        <AppBar
          className="ca-app-bar"
          showMenuIconButton={false}
          title={<div className="pointer app-bar-title">
          Qlik Core
            <span className="app-bar-title-dash"> /</span>
            <span className="app-bar-subtitle"> Assisted Prescription</span>
          </div>}
          onTitleTouchTap={this.navigateToLandingPage}
          zDepth={3}
          iconElementRight={
            <div style={
            { marginTop: '6px',
              marginRight: '0px',
              marginLeft: 'auto' }}
            >
              <FlatButton label="App" labelStyle={AppBarButtonStyle} onClick={this.navigateToAppPage} />
              {
                this.state.isAuthenticated ?
                (<FlatButton label="Sign Out" labelStyle={AppBarButtonStyle} onClick={this.signoutClicked} />)
                :
                (<FlatButton label="Sign In" labelStyle={AppBarButtonStyle} onClick={this.signinClicked} />)
              }
            </div>
          }
        />
        <Main
          isAuthenticated={this.state.isAuthenticated}
          notAuthorizedCallback={this.notAuthorizedCallback}
        />
        <Login
          open={this.state.dialogIsOpen}
          onCancel={this.cancelLoginClicked}
          onLogin={this.loginClicked}
        />
        <AcceptCookies
          open={!this.state.cookieAccepted}
          onAccept={this.acceptClicked}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <MuiThemeProvider>
    <HashRouter>
      <ThePage />
    </HashRouter>
  </MuiThemeProvider>,
  document.getElementById('root'),
);
