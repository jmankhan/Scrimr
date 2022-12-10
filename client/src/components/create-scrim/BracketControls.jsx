import PropTypes from 'prop-types';
import { SettingsIcon } from '@chakra-ui/icons';
import { DRAFT_CONTROLS_VIEW_CAPTAIN, DRAFT_CONTROLS_VIEW_OPTIONS } from '../../utils';
import RadioCard from './RadioCard';
import {
  HStack,
  FormControl,
  FormLabel,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useRadioGroup
} from '@chakra-ui/react';

const BracketControls = ({ controls, onChange }) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'view',
    defaultValue: controls?.viewBy || DRAFT_CONTROLS_VIEW_CAPTAIN.value,
    onChange: (value) => onChange({ viewBy: value }),
  })
  const viewGroup = getRootProps()

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
        <SettingsIcon />
      </MenuButton>
      <MenuList p={4}>
        <MenuItem>
          <FormControl>
            <FormLabel>View By</FormLabel>
            <HStack {...viewGroup}>
              {DRAFT_CONTROLS_VIEW_OPTIONS.map(option => {
                const radio = getRadioProps({ value: option.value })
                return (
                  <RadioCard key={option.value} {...radio}>
                    {option.label}
                  </RadioCard>
                )
              })}
            </HStack>
          </FormControl>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

BracketControls.propTypes = {
  controls: PropTypes.object,
  onChange: PropTypes.func
}
export default BracketControls;