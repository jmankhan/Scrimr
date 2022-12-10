import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Menu,
  MenuButton,
  MenuList,
  Textarea 
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const MemberGroupImport = () => {
  const [pasteValue, setPasteValue] = useState();

  const handlePaste = (e) => {
    const value = e.target.value;
    
  }

  return (
    <Menu>
      <MenuButton
        w='4rem'
        h='4rem'
        px={4}
        py={2}
        ml='1rem'
        transition='all 0.2s'
        borderRadius='md'
        borderWidth='1px'
        color='gray.600'
        _dark={{ bg: 'gray.700', color: 'gray.400' }}
        _hover={{ bg: 'gray.400' }}
        _expanded={{ bg: 'blue.400' }}
        _focus={{ boxShadow: 'outline' }}
      >
        <AddIcon />
      </MenuButton>
      <MenuList>
        <FormControl>
          <FormLabel>Paste</FormLabel>
          <Textarea 
            placeholder='Paste summoner names from lobby chat' 
            value={pasteValue} 
            onChange={handlePaste} />
        </FormControl>
      </MenuList>
    </Menu>
  )
}

MemberGroupImport.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default MemberGroupImport;