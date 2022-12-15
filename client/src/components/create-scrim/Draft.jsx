import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Center,
  Flex,
  Heading,
  List,
  ListItem,
  VStack
} from '@chakra-ui/react';
import Member from './Member';
import MemberGroup from './MemberGroup';

const Draft = ({ pool, teams, onChange }) => {
  const [members, setMembers] = useState(pool.filter(m => !m.isCaptain & m.teamId != null));
  const [memberMapping, setMemberMapping] = useState({});
  const [turn, setTurn] = useState(0);
  const [sortedTeams, setSortedTeams] = useState([]);

  useEffect(() => {
    const nextMembers = pool.filter( m => !m.isCaptain && m.teamId == null);
    const nextMapping = {};
    if (nextMembers.length > 0) {
      nextMembers.forEach(m => {
        nextMapping[m.id] = m.teamId;
      });
    }

    setSortedTeams([...teams.sort((a, b) => a.draftOrder - b.draftOrder)]);
    setMembers(nextMembers);
    setMemberMapping(nextMapping);
  }, [teams]);

  const handleAdd = (summonerId) => {
    const team = sortedTeams[turn];
    const member = members.find(m => m.summoner.id === summonerId);
    team.members.push(member);

    const nextMembers = members.filter(m => m.summoner.id !== summonerId);
    setMembers(nextMembers);
    setTurn((turn + 1) % teams.length);
    setMemberMapping({ [member.id]: team.id });

    if (nextMembers.length === 0) {
      const pool = members.map(m => ({ ...m, teamId: memberMapping[m.id] }));
      onChange({ teams: sortedTeams, pool });
    }
  }

  const getTitle = () => {
    return members.length > 0 && sortedTeams.length > 0 ? `${sortedTeams[turn].name}'s turn` : null;
  }

  return (
    <VStack h='100%' w='100%'>
      <Flex 
        direction='row'
        w='75%' 
        maxH='50%'
        flex='1 1 0'
        justify='space-evenly' 
        align='flex-start'>
        {sortedTeams.map(team => (
          <List key={team.id} spacing={1} w='100%'>
            <Heading>
              <Center>
                {team.name}
              </Center>
            </Heading>
            {team.members.map(member => (
              <ListItem key={member.id} w='50%' mx='auto'>
                <Member {...member.summoner} />
              </ListItem>
            ))}
          </List>
        ))}
      </Flex>

      <Heading>
        <Center>
          {getTitle()}
        </Center>
      </Heading>
      <MemberGroup 
        members={members.map(m => m.summoner)} 
        canAdd
        onAdd={handleAdd}
        />
    </VStack>
  )
}

Draft.propTypes = {
  pool: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired,
  teamSize: PropTypes.number,
  onChange: PropTypes.func.isRequired
};

export default Draft;