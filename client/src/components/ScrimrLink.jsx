import React from 'react';
import { Link as RouteLink } from 'react-router-dom';
import { Link as UILink } from '@chakra-ui/react';

export const ScrimrLink = ({ children, href, negative }) => {
  return (
    <RouteLink to={href}>
      <UILink as='span' color={negative ? 'red.400' : 'blue.400'}>{children}</UILink>
    </RouteLink>
  )
}