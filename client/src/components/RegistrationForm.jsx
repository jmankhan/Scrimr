import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../contexts/Auth";
import { ScrimrLink } from "./ScrimrLink";
import { handleError } from "../utils";
import {
  Alert,
  AlertIcon,
  Flex,
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState();
  const auth = useAuth();
  const navigate = useNavigate();

  const handleInput = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { email, summonerName, password } = data;
      if (!email || !summonerName || !password) {
        setError({ message: "All fields are required." });
      } else {
        const message = await auth.register({ email, summonerName, password });
        navigate("/");
      }
    } catch (err) {
      setError(handleError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      minH='calc(100vh - 4rem)'
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'xl'} w={'xl'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Register 
          </Heading>
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
            <FormControl id="summonerName" isRequired isInvalid={error?.fields?.summonerName}>
              <FormLabel>Summoner Name</FormLabel>
              <Input type="text" name="summonerName" onChange={handleInput}  />
              {error?.fields?.summonerName && <FormErrorMessage>{error.fields.summonerName}</FormErrorMessage>}
            </FormControl>
            <FormControl id="email" isRequired isInvalid={error?.fields?.email}>
              <FormLabel>Email address</FormLabel>
              <Input type="email" name="email" onChange={handleInput} />
              {error?.fields?.email && <FormErrorMessage>{error.fields.email}</FormErrorMessage>}
            </FormControl>
            <FormControl id="password" isRequired isInvalid={error?.fields?.password}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} name="password" onChange={handleInput} />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {error?.fields?.password && <FormErrorMessage>{error.fields.password}</FormErrorMessage>}
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                isLoading={isLoading}
                loadingText="Submitting"
                size="lg"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={handleSubmit}>
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user? <ScrimrLink href="/login">Login</ScrimrLink>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
  </Flex>
  );
};

export default RegistrationForm;
