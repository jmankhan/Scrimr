import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ScrimrLink } from "./ScrimrLink";
import useAuth from "../contexts/Auth";
import { handleError } from "../utils";
import {
  Alert,
  AlertIcon,
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState();
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleInput = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await auth.login(data.email, data.password);
      // go to previous page or go home if there is no previous
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err) {
      setError(handleError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      minH={'calc(100vh - 4rem)'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'xl'} w={'xl'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Login</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            {error && error.message && 
              <Alert status='error'>
                <AlertIcon />
                {error.message}
              </Alert>
            }
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" name="email" onChange={handleInput} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" name="password" onChange={handleInput} />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Checkbox>Remember me</Checkbox>
                <ScrimrLink href="/forgot-password">Forgot password?</ScrimrLink>
              </Stack>
              <Button
                isLoading={isLoading}
                loadingText="Logging In"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={handleLogin}>
                Sign in
              </Button>
              <Stack pt={6}>
                <Text align={'center'}>
                  Trying to register instead? <ScrimrLink href="/register">Register</ScrimrLink>
                </Text>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default LoginForm;
