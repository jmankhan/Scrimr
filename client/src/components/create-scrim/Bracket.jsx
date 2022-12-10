import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Center,
  Flex,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  VStack
} from '@chakra-ui/react';
import Member from './Member';
import BracketControls from './BracketControls';
import { DRAFT_CONTROLS_VIEW_CAPTAIN, DRAFT_CONTROLS_VIEW_TEAM } from '../../utils';
import Team from './Team';

const Bracket = ({ teams }) => {
  const [tournament, setTournament] = useState();
  const [draftControls, setDraftControls] = useState({ viewBy: DRAFT_CONTROLS_VIEW_CAPTAIN.value });

  useEffect(() => {
    setTournament(
      format(createRoundRobinTournament(teams))
    );
  }, [teams]);

  const format = (rounds) => {
    return {
      name: 'Round Robin Tournament',
      matchesPerRound: rounds[0].length,
      rounds: rounds.map((round, i) => ({
        id: `round-${i}`,
        name: `Round ${i + 1}`,
        numMatches: round.length,
        matches: round
      }))
    } 
  }

  const createRoundRobinTournament = (teams) => {
    const matchTeams = [...teams];
    if (matchTeams.length % 2 === 1) {
      matchTeams.push(null);
    }

    const numTeams = matchTeams.length;
    const rounds = numTeams - 1;
    const half = numTeams / 2;

    const tournamentRounds = [];
    const indices = matchTeams.map((t, i) => i).slice(1);

    for (let round=0; round < rounds; round++) {
      const match = [];
      const newIndices = [0].concat(indices);

      const firstHalf = newIndices.slice(0, half);
      const secondHalf = newIndices.slice(half, numTeams).reverse();
      for (let i=0; i<firstHalf.length; i++) {
        match.push([
          matchTeams[firstHalf[i]]?.id, 
          matchTeams[secondHalf[i]]?.id
        ]);
      }

      indices.push(indices.shift());
      tournamentRounds.push(match);
    }

    return tournamentRounds;
  }

  return (
    <VStack>
      <BracketControls controls={draftControls} onChange={setDraftControls} />
      <TableContainer>
        {tournament &&
          <Table>
            <Thead>
              <Tr>
                {tournament.rounds.map(round => (
                  <Th key={round.id}>
                    {round.name}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {[...Array(tournament.matchesPerRound).keys()].map(matchIndex => (
                <Tr key={matchIndex}>
                  {
                    tournament.rounds.map(round => (
                      <Td key={round.id + '_' + matchIndex}>
                        <Flex direction='row' flex='1 1 0' justifyContent='space-between'>
                          {(draftControls?.viewBy === DRAFT_CONTROLS_VIEW_CAPTAIN.value ?? true) &&
                            <>
                              {round.matches[matchIndex][0] ? <Member {...teams.find(t => t.id === round.matches[matchIndex][0]).members[0].summoner} /> : <Member name='Bye' rank={-1} />} 
                              <Center>VS</Center>
                              {round.matches[matchIndex][1] ? <Member {...teams.find(t => t.id === round.matches[matchIndex][1]).members[0].summoner} /> : <Member name='Bye' rank={-1} />}
                            </>
                          }
                          {(draftControls?.viewBy === DRAFT_CONTROLS_VIEW_TEAM.value ?? false) &&
                            <>
                              {round.matches[matchIndex][0] ? <Team summoners={teams.find(t => t.id === round.matches[matchIndex][0]).members.map(m => m.summoner)} /> : <Member name='Bye' rank={-1} />}
                              VS
                              {round.matches[matchIndex][1] ? <Team summoners={teams.find(t => t.id === round.matches[matchIndex][1]).members.map(m => m.summoner)} /> : <Member name='Bye' rank={-1} />}
                            </>
                          }
                        </Flex>
                      </Td>
                    ))
                  }
                </Tr>
              ))}
            </Tbody>
          </Table>
        }
        {!tournament && <Spinner />}
      </TableContainer>
    </VStack>
  )
}

Bracket.propTypes = {
  teams: PropTypes.array.isRequired
};

export default Bracket;