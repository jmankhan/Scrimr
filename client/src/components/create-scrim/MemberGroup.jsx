import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Member from './Member';
import {
  Box,
  
  HStack,
  Select,
  SimpleGrid,
  VStack
} from '@chakra-ui/react';
import { CREATEPOOL_SORT_NAME, CREATEPOOL_SORT_RANK } from '../../utils';

const MemberGroup = ({ filters, members, canRemove = false, onRemove, canUpdate = false, onUpdate, canAdd = false, onAdd }) => {
  const [visibleMembers, setVisibleMembers] = useState([]);

  useEffect(() => {
    let m = members;
    if (filters) {
      if (filters.sortBy === CREATEPOOL_SORT_NAME.value) {
        m.sort((a, b) => a.name < b.name ? -1 : 1);
      } else if (filters.sortBy === CREATEPOOL_SORT_RANK.value) {
        m.sort((a, b) => a.rank < b.rank && a.rank >= 0 ? -1 : 1);
      }

      if (filters.roleBy && filters.roleBy != 'all') {
        m = m.filter(member => member.role === filters.roleBy);
      }
    }
    setVisibleMembers(m);
  }, [filters, members]);

  return (
    <SimpleGrid columns={{ sm: 1, md: 3, lg: 5 }} spacing={{ base: 3, lg: 8 }} >
      {visibleMembers.map(member => (
        <Member 
          key={member.id} 
          {...member} 
          canRemove={canRemove} 
          onRemove={onRemove} 
          canUpdate={canUpdate}
          onUpdate={onUpdate} 
          canAdd={canAdd} 
          onAdd={onAdd} />
      ))}
    </SimpleGrid>
  )
}

MemberGroup.propTypes = {
  cols: PropTypes.number,
  filters: PropTypes.object,
  members: PropTypes.array.isRequired,
  onRemove: PropTypes.func
}

export { MemberGroup }