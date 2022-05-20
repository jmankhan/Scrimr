import React from 'react';
import { Button, Container, Icon, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const InHouseLanding = () => {
  return (
    <Container text>
      <Header
        as='h1'
        content='Play with friends'
        style={{
          fontSize: '4em',
          fontWeight: 'normal',
          marginBottom: 0,
          marginTop: '3em',
        }}
      />
      <Link to='create-scrim'>
          <Button primary size='huge'>
              Create a Scrim
              <Icon name='right arrow' />
          </Button>
      </Link>
    </Container>
  )
}

export default InHouseLanding;
