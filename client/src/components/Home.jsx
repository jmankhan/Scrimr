import React from 'react';
import Hero from './Hero';
import { Flex } from '@chakra-ui/react';

const Home = ({ mobile }) => (
  <Flex
    direction="column"
    align="center"
    w='100%'
    m="0 auto"
  >
    <Hero
      title="Scrimr"
      subtitle="Get to the next level"
      image="https://images.unsplash.com/photo-1669389755712-743c368ccc11"
      ctaText="Create your account now"
      ctaLink="/register"
    />
  </Flex>
)

export default Home;
