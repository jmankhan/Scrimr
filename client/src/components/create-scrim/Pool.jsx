import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Member from './Member';
import {
  Alert,
  AlertIcon,
  Center,
  SimpleGrid,
  VStack,
  useToast 
} from '@chakra-ui/react';
import AutoComplete from './AutoComplete';
import { MemberGroup } from './MemberGroup';
import MemberGroupFilters from './MemberGroupFilters';
import { ERROR_TOAST } from '../../utils';
import MemberGroupSettings from './MemberGroupSettings';

const Pool = ({ pool = [], numTeams, teamSize, onChange }) => {
  const [summoners, setSummoners] = useState(pool?.map(m => m.summoner) ?? []);
  const [filters, setFilters] = useState();
  const [settings, setSettings] = useState({ numTeams, teamSize });
  const toast = useToast(ERROR_TOAST);

  useEffect(() => {
    onChange({ 
      summoners, 
      numTeams: settings.numTeams, 
      teamSize: settings.teamSize 
    });
  }, [summoners, settings]);


  const addSummoner = (newSummoner) => {
    if(!summoners.find(summoner => summoner.id === newSummoner.id)) {
      setSummoners(summoners.concat(newSummoner));
    } else {
      toast({ title: 'Error', description: 'This member has already been added' });
    }
  }

  const removeMember = (summonerId) => {
    setSummoners(summoners.filter(summoner => summoner.id !== summonerId));
  }

  return (
    <VStack h='100%' w='100%'>
      <Center w='100%' maxW={{ base: '100%', lg: '40vw' }} mx='auto' mb={[0,0,0,'10rem']}>
        <AutoComplete placeholder="Search for a summoner" onSelect={addSummoner} />
        <MemberGroupFilters onChange={data => setFilters({ ...filters, ...data })} filters={filters} />
        <MemberGroupSettings onChange={data => setSettings({...settings, ...data })} settings={settings} />
        {/* <MemberGroupImport onChange={data => setSummoners({ summoners: summoners.concat(data)})} /> */}
      </Center>
      <MemberGroup filters={filters} members={summoners} canRemove onRemove={removeMember} canUpdate />
    </VStack>
  )
}

Pool.propTypes = {
  pool: PropTypes.array,
  numTeams: PropTypes.number,
  teamSize: PropTypes.number,
  onChange: PropTypes.func
};

export default Pool;