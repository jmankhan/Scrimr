import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import API from '../../api';
import {
  Box,
  Divider,
  Flex,
  HStack,
  Image,
  Input,
  Kbd,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalOverlay,
  Text,
  VisuallyHidden,
  VStack,
  chakra,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons'
import { ERROR_TOAST, handleError } from '../../utils';
import useRankImages from '../../hooks/useRankImage';
import useKeyPress from '../../hooks/useKeypress';
import { useOutsideClick } from '../../hooks/useOutsideClick';

const ACTION_KEY_DEFAULT = ['Ctrl', 'Control'];
const ACTION_KEY_APPLE = ['⌘', 'Command'];

const AutoComplete = ({ label, placeholder, onSelect }) => {
  const [options, setOptions] = useState([]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState();
  const [actionKey, setActionKey] = useState(ACTION_KEY_DEFAULT);

  const toast = useToast(ERROR_TOAST);
  const inputRef = useRef();
  const containerRef = useRef();
  const arrowUpPressed = useKeyPress('ArrowUp');
  const arrowDownPressed = useKeyPress('ArrowDown');
  const enterPressed = useKeyPress('Enter');
  const hotkeyPressed = useKeyPress('k', true);
  const closePressed = useKeyPress('Escape');

  // initial load, check if using mac
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
      if (isMac) {
        setActionKey(ACTION_KEY_APPLE);
      }
    }
  }, []);

  // handle search
  useEffect(() => {
    const doSearch = async (v) => {
      try {
        setLoading(true);
        const response = await API.search(v);
        const result = response.results.map(r => {
          const [imageSrc, title] = useRankImages(r.rank);
          return {
            label: r.name,
            imageSrc: imageSrc,
            title: title,
            value: r.id,
            summoner: r
          }
        }) ?? [];

        result.push({ label: v, value: null });
        setOptions(result);
      } catch(err) {
        toast({ title: 'Error', description: handleError(err).message });
      } finally {
        setLoading(false);
      }
    }

    if (value) {
      doSearch(value);
    } else {
      setOptions([]);
      setLoading(false);
    }
  }, [value]);

  // handle up key
  useEffect(() => {
    if (arrowUpPressed && options && options.length > 0) {
      const index = selectedOptionIndex - 1;
      setSelectedOptionIndex((index % options.length + options.length) % options.length);
    }
  }, [arrowUpPressed]);

  // handle down key
  useEffect(() => {
    if (arrowDownPressed && options && options.length > 0) {
      const index = selectedOptionIndex + 1;
      setSelectedOptionIndex((index % options.length + options.length) % options.length);
    }
  }, [arrowDownPressed]);

  // handle enter key
  useEffect(() => {
    if (enterPressed && options && options.length > 0 && selectedOptionIndex >= 0 && selectedOptionIndex < options.length) {
      handleSelect(options[selectedOptionIndex]);
    }
  }, [enterPressed]);

  useEffect(() => {
    if (hotkeyPressed) {
      inputRef.current.focus();
    }
  }, [hotkeyPressed])

  useEffect(() => {
    if (closePressed) {
      inputRef.current.blur();
      setOptions([]);
    }
  }, [closePressed]);

  useOutsideClick(containerRef.current, () => {
    inputRef?.current?.blur();
    setOptions([]);
   });
 

  const handleAdd = async (name) => {
    try {
      const response = await API.createSummoner(name);  
      onSelect(response.summoner);
    } catch(err) {
      toast({ title: 'Error', description: handleError(err).message, });
    }
  }

  const handleSelect = (searchResult) => {
    if (searchResult.summoner) {
      onSelect(searchResult.summoner);
    } else {
      handleAdd(searchResult.label);
    }
    setOptions([]);
    setValue(null);
  }

  return (
    <VStack w="100%" ref={containerRef}>
      <chakra.button
        flex='1'
        type='button'
        mx='6'
        lineHeight='1.2'
        w='100%'
        bg='white'
        whiteSpace='nowrap'
        display='flex'
        alignItems='center'
        color='gray.600'
        _dark={{ bg: 'gray.700', color: 'gray.400' }}
        py='3'
        px='4'
        boxSizing='border-box'
        outline='0'
        _focus={{ shadow: 'outline' }}
        shadow='base'
        rounded='md'
      >
        <SearchIcon />
        <HStack w='full' ml='3' spacing='4px'>
          <Input 
            textAlign='left' 
            flex='1' 
            border='0' 
            _focus={{ boxShadow: 'none', outlineStyle: 'none', borderColor: 'transparent' }} 
            ref={inputRef}
            placeholder={placeholder} 
            label={label} 
            value={value || ''} 
            onChange={(e) => setValue(e.target.value)} />
            <VisuallyHidden>
              Press {actionKey[1] + ' and K'} to search.
            </VisuallyHidden>
          <HStack display={['none', 'none', 'none', 'flex']}>
            <Kbd as='p' rounded='2px'>
              <chakra.div
                  as='abbr'
                  title={actionKey[1]}
                  textDecoration='none !important'
                >
                {actionKey[0]}
              </chakra.div>
            </Kbd>
            <Kbd as='p' rounded='2px'>K</Kbd>
          </HStack>
        </HStack>
      </chakra.button>
      {options.length > 0 && <Modal isOpen={options.length > 0}>
        <ModalOverlay
          bg='blackAlpha.300'
        />
        <ModalBody>
          <chakra.div
            position='fixed'
            w={{ base: '50%', lg: '40vw' }}
            h='25rem'
            maxH={{ base: '50%', lg: '100%' }}
            top='12rem'
            zIndex={1400}
            // - 20 for the padding in parent
            left={containerRef ? containerRef.current.offsetLeft - 20 : null}
            mx='6'
            lineHeight='1.2'
            bg='white'
            whitespace='nowrap'
            alignItems='center'
            color='gray.600'
            _dark={{ bg: 'gray.700', color: 'gray.400' }}
            py='3'
            px='4'
            outline='0'
            rounded='md'>
              <List>
                {options.map((option, index) => (
                  <ListItem key={option.value}
                    _hover={{ bg: useColorModeValue('gray.200', 'gray.600') }}
                    bg={selectedOptionIndex === index ? useColorModeValue('gray.200', 'gray.600') : null}
                    display="flex"
                    mt={2}
                    py={2}
                    borderRadius='lg'
                    minH={16}
                    px={4}
                    alignItems="center"
                    cursor="pointer"
                    onClick={() => handleSelect(options[index])}>
                      <Flex ml={4}>
                        {
                          option.imageSrc ? 
                          <Image src={option.imageSrc} alt={option.iconTitle} boxSize='2rem' sx={{ display: 'inline-block' }} mr={3} /> : 
                          <Box w='2rem' h='2rem' mr={3}>&nbsp;</Box>
                        }
                        <Text sx={{ display: 'inline' }}>{option.label}</Text>
                      </Flex>
                  </ListItem>
                ))}
              </List>
            </chakra.div>
        </ModalBody>
      </Modal>}
    </VStack>
  )
}


AutoComplete.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  items: PropTypes.array,
  onSelect: PropTypes.func.isRequired
}
export default AutoComplete;