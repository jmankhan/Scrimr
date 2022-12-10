import PropTypes from 'prop-types';
import { CREATEPOOL_SORT_ADDED, CREATEPOOL_SORT_OPTIONS, ROLE_OPTIONS } from '../../utils';
import {
  FormControl,
  FormLabel,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Radio,
  RadioGroup,
  Stack,
  useRadioGroup
} from '@chakra-ui/react';
import { Icon } from '@chakra-ui/icons';
import { RiFilterLine } from 'react-icons/ri';
import RadioCard from './RadioCard';

const MemberGroupFilters = ({ filters, onChange }) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'role',
    defaultValue: 'all',
    onChange: (value) => onChange({ roleBy: value }),
  })
  const roleGroup = getRootProps()

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
        <Icon as={RiFilterLine} boxSize={5} />
      </MenuButton>
      <MenuList p={4}>
        <FormControl>
          <FormLabel>Sort By</FormLabel>
          <RadioGroup onChange={sortBy => onChange({ sortBy })} value={filters ? filters.sortBy : CREATEPOOL_SORT_ADDED.value}>
            <Stack direction='row'>
              {CREATEPOOL_SORT_OPTIONS.map(option => (
                <Radio 
                  key={option.value}
                  value={option.value}>{option.label}</Radio>
              ))}
            </Stack>
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel>Filter Role</FormLabel>
          <HStack {...roleGroup}>
            {[{ label: 'All', value: 'all' }].concat(ROLE_OPTIONS).map(option => {
              const radio = getRadioProps({ value: option.value })
              return (
                <RadioCard key={option.value} {...radio}>
                  {option.label}
                </RadioCard>
              )
            })}
          </HStack>
        </FormControl>
      </MenuList>
    </Menu>
  )
}

MemberGroupFilters.propTypes = {
  filters: PropTypes.object,
  onChange: PropTypes.func
}

export default MemberGroupFilters;