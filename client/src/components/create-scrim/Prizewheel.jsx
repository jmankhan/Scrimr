import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import WheelComponent from './WheelComponent';
import { 
  Center,
  Flex,
  Heading,
  List,
  ListItem,
  chakra,
  useColorModeValue,
  useToken
} from '@chakra-ui/react';
import Member from './Member';
import { getRandomElement } from '../../utils';

const Prizewheel = ({ pool, scrimId, onChange }) => {
  const [captains, setCaptains] = useState(pool.filter(m => m.isCaptain));
  const [draftOrder, setDraftOrder] = useState([]);
  const [spins, setSpins] = useState(0);

  useEffect(() => {
    setDraftOrder([...captains.sort(() => 0.5 - Math.random())]);
  }, []);

  const maxSpins = draftOrder.length - 1;

  const createTeam = (captainId) => {
    return {
      scrimId,
      draftOrder: draftOrder.findIndex(m => m.id === captainId),
      members: [pool.find(m => m.id === captainId)]
    };
  }

  const selectWinner = () => {
    setCaptains(draftOrder.slice(spins));
    setSpins(spins + 1);

    if (spins + 1 === maxSpins) {
      const teams = draftOrder.map(captain => createTeam(captain.id));
      onChange(teams);
    }
  }

  const [primaryColor, contrastColor] = useToken('colors', [useColorModeValue("gray.900", "gray.100"), useColorModeValue("gray.100", "gray.900")]);
  const [fontFamily] = useToken('fonts', ['body']);

  return (
    <Flex 
      direction='row'
      w='75%' 
      h='100%'
      flex='1 1 0'
      justify='space-evenly' 
      align='flex-start'>
      <chakra.div spacing={4} w='100%' h='100%'>
        <WheelComponent 
          segments={draftOrder.slice(spins).map(d => ({ label: d.summoner.name, value: d.id }))}
          segColors={captains.map(() => contrastColor)}
          winningSegment={draftOrder[spins]}
          primaryColor={primaryColor}
          contrastColor={contrastColor}
          fontFamily={fontFamily}
          textColor={useColorModeValue('black', 'white')}
          canSpin={spins < draftOrder.length - 1}
          onFinished={selectWinner}
        />
      </chakra.div>
      <List spacing={4} w='100%'>
        <Center>
          <Heading>
            Draft Order
          </Heading>
        </Center>
        {draftOrder.slice(0, spins === maxSpins ? spins + 1 : spins).map(member => (
          <ListItem 
            key={member.id}
            w='50%' 
            mx='auto'
            rounded='md'>
              <Member {...member.summoner} />
          </ListItem>
        ))}
      </List>
    </Flex>
  )
}

Prizewheel.propTypes = {
  pool: PropTypes.array.isRequired,
  numTeams: PropTypes.number,
  onChange: PropTypes.func
};

export default Prizewheel;