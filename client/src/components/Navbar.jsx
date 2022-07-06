import { createMedia } from '@artsy/fresnel';
import PropTypes from 'prop-types';
import React, { Component, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button, Container, Dropdown, Icon, Menu, Segment, Sidebar, Visibility } from 'semantic-ui-react';
import useAuth from '../contexts/Auth';

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
});

const DesktopContainer = (props) => {
  const [fixed, setShowFixedMenu] = useState(false);
  const location = useLocation();

  return (
    <Media greaterThan="mobile" secondary>
      <Visibility
        once={false}
        onBottomPassed={() => setShowFixedMenu(false)}
        onBottomPassedReverse={() => setShowFixedMenu(true)}
      >
        <Segment inverted textAlign="center" style={{ minHeight: 75, padding: '1em 0em' }} vertical>
          <Menu fixed={fixed ? 'top' : null} inverted={!fixed} pointing={!fixed} secondary={!fixed} size="large">
            <Container>
              <Menu.Item active={location.pathname === '/'} as={Link} to="/">
                Home
              </Menu.Item>
              <Menu.Item active={/\/in-house(\/\w)?/.test(location.pathname)} as={Link} to="/in-house">
                In House
              </Menu.Item>
              {/* <Menu.Item active={location.pathname === '/my-scrims'} as={Link} to="/my-scrims">
                My Scrims
              </Menu.Item> */}
              <Menu.Item position="right">
                {props.user && (
                  <Dropdown item text={props.user.name}>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to="/profile" text="Profile" />
                      <Dropdown.Item as={Link} to="/logout" text="Logout" />
                    </Dropdown.Menu>
                  </Dropdown>
                )}

                {!props.user && (
                  <>
                    <Button as={Link} inverted={!fixed} to="/login">
                      Log in
                    </Button>
                    <Button as={Link} inverted={!fixed} primary={fixed} style={{ marginLeft: '0.5em' }} to="/register">
                      Sign Up
                    </Button>
                  </>
                )}
              </Menu.Item>
            </Container>
          </Menu>
        </Segment>
      </Visibility>

      {props.children}
    </Media>
  );
};

DesktopContainer.propTypes = {
  children: PropTypes.node,
  user: PropTypes.object,
};

class MobileContainer extends Component {
  state = {};

  handleSidebarHide = () => this.setState({ sidebarOpened: false });

  handleToggle = () => this.setState({ sidebarOpened: true });

  render() {
    const { children } = this.props;
    const { sidebarOpened } = this.state;

    return (
      <Media as={Sidebar.Pushable} at="mobile">
        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            animation="overlay"
            inverted
            onHide={this.handleSidebarHide}
            vertical
            visible={sidebarOpened}
          >
            <Menu.Item as="a" active>
              Home
            </Menu.Item>
            <Menu.Item as="a">Work</Menu.Item>
            <Menu.Item as="a">Company</Menu.Item>
            <Menu.Item as="a">Careers</Menu.Item>
            <Menu.Item as="a">Log in</Menu.Item>
            <Menu.Item as="a">Sign Up</Menu.Item>
          </Sidebar>

          <Sidebar.Pusher dimmed={sidebarOpened}>
            <Segment inverted textAlign="center" style={{ minHeight: 75, padding: '1em 0em' }} vertical>
              <Container>
                <Menu inverted pointing secondary size="large">
                  <Menu.Item onClick={this.handleToggle}>
                    <Icon name="sidebar" />
                  </Menu.Item>
                  <Menu.Item position="right">
                    <Button as="a" inverted>
                      Log in
                    </Button>
                    <Button as="a" inverted style={{ marginLeft: '0.5em' }}>
                      Sign Up
                    </Button>
                  </Menu.Item>
                </Menu>
              </Container>
            </Segment>
            {children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Media>
    );
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
};

const ResponsiveContainer = ({ children, user }) => (
  /* Heads up!
   * For large applications it may not be best option to put all page into these containers at
   * they will be rendered twice for SSR.
   */
  <MediaContextProvider>
    <DesktopContainer user={user}>{children}</DesktopContainer>
    <MobileContainer user={user}>{children}</MobileContainer>
  </MediaContextProvider>
);

ResponsiveContainer.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node,
};

const NavBar = (props) => {
  const auth = useAuth();
  return <ResponsiveContainer {...props} user={auth.value.user}></ResponsiveContainer>;
};

export default NavBar;
