import React from 'react';
import useAuth from '../contexts/Auth';

const Logout = () => {
  const auth = useAuth();

  // should redirect after there is no more user creds
  auth.logout();

  return (<></>)
}

export default Logout;
