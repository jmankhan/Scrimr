import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonGroup,
  Center,
  Heading,
  Flex,
  List,
  ListItem,
  VStack,
  chakra
} from '@chakra-ui/react';
import { GoArrowBoth } from 'react-icons/go';
import { FaRandom } from 'react-icons/fa';
import Member from './Member';

const SelectCaptains = ({ pool, numTeams, onChange }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [members, setMembers] = useState(pool);

  useEffect(() => {
    onChange(members);
  }, [members]);
  const randomize = () => {
    const randomCaptains = new Set([...members].map(m => m.id).sort(() => 0.5 - Math.random()).slice(0, +numTeams || 2));
    setMembers(members.map(m => ({ ...m, isCaptain: randomCaptains.has(m.id) })));
  }

  const swapCaptain = () => {
    setMembers(members.map(m => ({ 
      ...m, 
      isCaptain: selectedMembers.find(id => id === m.id) ? !m.isCaptain : m.isCaptain 
    })));
    setSelectedMembers([]);
  }

  const toggleMember = (e) => {
    const memberId = +e.currentTarget.dataset.id;
    let s = [...selectedMembers];
    if (selectedMembers.find(id => id === memberId)) {
      s = selectedMembers.filter(id => id !== memberId);
    } else {
      s.push(memberId);
    }
    setSelectedMembers(s);
  }

  return (
    <Flex 
      direction='row'
       w='50%'
       maxH='100%' 
       overflowY='scroll'
       flex='1 1 0'
       justify='space-evenly' 
       align='flex-start'>
      <List spacing={4} w='100%'>
        <Center>
          <Heading>
            Members
          </Heading>
        </Center>
        {members
          .filter(member => !member.isCaptain)
          .map(member => (
            <ListItem 
              key={member.id} 
              w='50%' 
              mx='auto'
              boxShadow={selectedMembers.find(id => id === member.id) ? 'outline' : null}
              rounded='md'
              data-id={member.id}
              onClick={toggleMember}>
                <Member {...member.summoner} />
              </ListItem>
          ))
        }
      </List>
      <VStack alignSelf='center' spacing={4}>
        <Button onClick={swapCaptain}>
          <GoArrowBoth />
        </Button>
        <Button onClick={randomize}>
          <FaRandom />
        </Button>
      </VStack>
      <List spacing={4} w='100%'>
        <Center>
          <Heading>
            Captains
          </Heading>
        </Center>
        {members
          .filter(m => m.isCaptain)
          .map(member => (
            <ListItem key={member.id}
              w='50%' 
              mx='auto'
              boxShadow={selectedMembers.find(id => id === member.id) ? 'outline' : null}
              rounded='md'
              data-id={member.id}
              onClick={toggleMember}>
              <Member {...member.summoner} />
            </ListItem>
          ))
        }
      </List>
    </Flex>
  )
}

SelectCaptains.propTypes = {
  pool: PropTypes.array,
  numTeams: PropTypes.number,
  onChange: PropTypes.func
};

export default SelectCaptains;