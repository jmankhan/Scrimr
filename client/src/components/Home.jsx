import React from 'react';
import Hero from './Hero';
import { Flex } from '@chakra-ui/react';

const Home = ({ mobile }) => (
  <Flex
    direction="column"
    align="center"
    maxW={{ xl: "1200px" }}
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
