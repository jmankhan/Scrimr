import {
  Avatar,
  Box,
  Flex,
  Image,
  Link,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { NavLink } from 'react-router-dom';
import useAuth from '../contexts/Auth';
import { ScrimrLink } from './ScrimrLink';
import logo from '../assets/logo.png';

const NavbarLink = ({ children, href }) => (
  <NavLink to={href}>
    <Link
      as='span'
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      cursor='pointer'>
      {children}
    </Link>
  </NavLink>
);

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const auth = useAuth();
  const isLoggedIn = auth?.value?.user?.id ?? false;
  const avatarSeed = isLoggedIn ? auth.value.user.id : Math.random();
  const pages = [{ label: 'In-House', value: '/in-house/create-scrim'}];

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <HStack spacing={8} alignItems={'center'}>
          <NavLink to='/'><Image src={logo} alt='logo' boxSize='3rem' /></NavLink>
          <HStack
            as={'nav'}
            spacing={4}
            display={{ base: 'none', md: 'flex' }}>
            {pages.map(page => (
              <NavbarLink key={page.value} href={page.value}>{page.label}</NavbarLink>
            ))}
          </HStack>
        </HStack>

        <Flex alignItems={'center'}>
          <Stack direction={'row'} spacing={7}>
            <Button onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar
                  size={'sm'}
                  src={`https://avatars.dicebear.com/api/bottts/${avatarSeed}.svg`}
                />
              </MenuButton>
              <MenuList alignItems={'center'}>
                <br />
                <Center>
                  <Avatar
                    size={'2xl'}
                    src={`https://avatars.dicebear.com/api/bottts/${avatarSeed}.svg`}
                  />
                </Center>
                <br />
                <Center>
                  <p>{auth?.value?.user?.name}</p>
                </Center>
                <br />
                <MenuDivider />
                <MenuItem>Settings</MenuItem>
                <MenuItem>{isLoggedIn ? <ScrimrLink negative href="/logout">Logout</ScrimrLink> : <ScrimrLink href="/login">Login</ScrimrLink>}</MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}
