import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Textarea,
  useDisclosure
} from '@chakra-ui/react';
import { Icon } from '@chakra-ui/icons';
import { BsUpload } from 'react-icons/bs';
import API from '../../api';
import { handleError } from '../../utils';

const MemberGroupImport = ({ onChange }) => {
  const [pasteValue, setPasteValue] = useState();
  const [loading, setLoading] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSave = async () => {
    const summonerNames = pasteValue
      .split('\n') //consider each line
      .filter(line => line.indexOf(' joined the lobby') !== -1) // remove non lobby join messages
      .map(line => line.split(' joined the lobby')[0].trim()); // parse summoner names

    if (summonerNames.length > 100) {
      toast({ description: 'Too many summoner names' });
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await API.createSummoners(summonerNames);
      onChange(response.summoners);
      onClose();
    } catch(err) {
      setErrorMessage(handleError(err).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        w='4rem'
        h='4rem'
        px={4}
        py={2}
        ml='1rem'
        transition='all 0.2s'
        onClick={onOpen}>
          <Icon as={BsUpload} boxSize={5} />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size='xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Bulk Upload Summoners</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {loading && 
              <Center>
                <Spinner size='xl' />
              </Center>
            }
            {!loading && 
              <FormControl>
                <FormLabel>Paste Lobby chat</FormLabel>
                <Textarea 
                  isInvalid={errorMessage}
                  placeholder='Paste summoner names from lobby chat' 
                  size='lg'
                  h='10rem'
                  resize='vertical'
                  value={pasteValue} 
                  onChange={(e) => setPasteValue(e.target.value)} />
                <FormHelperText>Max 100 names</FormHelperText>
                <FormErrorMessage>{errorMessage}</FormErrorMessage>
              </FormControl>      
            }
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

MemberGroupImport.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default MemberGroupImport;