import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

const InHouseLanding = () => {
  return (
    <Link to='create-scrim'>
      <Button size='xl'>
        Create a scrim
      </Button>
    </Link>
  )
}

export default InHouseLanding;
