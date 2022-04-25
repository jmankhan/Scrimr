import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Header, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Home = ({ mobile }) => (
  <Container text>
    <Header
      as='h1'
      content='Scrimr'
      style={{
        fontSize: mobile ? '2em' : '4em',
        fontWeight: 'normal',
        marginBottom: 0,
        marginTop: mobile ? '1.5em' : '3em',
      }}
    />
    <Header
      as='h2'
      content='Actually have fun in League of Legends.'
      style={{
        fontSize: mobile ? '1.5em' : '1.7em',
        fontWeight: 'normal',
        marginTop: mobile ? '0.5em' : '1.5em',
      }}
    />
    <Link to='/find-scrim'>
        <Button primary size='huge'>
            Find a Scrim
            <Icon name='right arrow' />
        </Button>
    </Link>
  </Container>
)

Home.propTypes = {
  mobile: PropTypes.bool,
}

export default Home;