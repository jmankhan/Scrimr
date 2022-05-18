import React, { useState } from 'react';
import { Button, Form, Grid, Header, Icon, Image, Input, Message, Segment } from 'semantic-ui-react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../contexts/Auth';
import API from '../api';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [message, setMessage] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handlePasswordReveal = () => {
    setShowPassword(!showPassword);
  }

  const handleInput = (e, eventData) => {
    setData({ ...data, [e.target.name]: eventData.value });
  }

  const handleMessageClear = () => {
    setMessage('');
  }

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await auth.login(data.email, data.password);
      // go to previous page or go home if there is no previous
      navigate(location.key !== 'default' ? -1 : '/');
    } catch(err) {
      setMessage(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Grid textAlign='center' style={{ height: '80vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h1' textAlign='center'>
          Log In
        </Header>
        <Form size='large' error={message !== ''}>
          <Segment>
            <Form.Field>
              <Input name='email' label='Email' type='email' onChange={handleInput} />
            </Form.Field>
            <Form.Field>
              <Input
                name='password'
                fluid
                icon={<Icon name={showPassword ? 'eye' : 'eye slash'} link onClick={handlePasswordReveal} />}
                label='Password'
                type={showPassword ? 'text' : 'password'}
                onChange={handleInput} />
             </Form.Field>
            <Button primary fluid size='large' loading={isLoading} onClick={handleLogin}>
              Login
            </Button>
            <Message
              error
              header='Error'
              content={message}
            />
          </Segment>
        </Form>
        <Message>
          New to us? <Link to='/register'>Sign Up</Link>
        </Message>
      </Grid.Column>
    </Grid>
  )
}

export default LoginForm;
