import PropTypes from 'prop-types';
import {
  FormControl,
  FormLabel,
  HStack,
  NumberInput,
  NumberInputField,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  RadioGroup,
  useRadioGroup
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';
import { DEFAULT_SCRIM_MODE, SCRIM_MODE_OPTIONS } from '../../utils';
import RadioCard from './RadioCard';

const MemberGroupSettings = ({ settings, onChange }) => {
  const validateSettings = () => {
    const teamSize = (settings?.teamSize ?? 5) || 5;
    const numTeams = (settings?.numTeams ?? 2) || 2;
    onChange({ teamSize, numTeams });
  }

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'mode',
    defaultValue: DEFAULT_SCRIM_MODE.value,
    onChange: (value) => onChange({ mode: value }),
  })
  const roleGroup = getRootProps()

  return (
    <>
      <Menu closeOnSelect={false} onClose={validateSettings}>
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
        <MenuList px={4}>
          <FormControl>
            <FormLabel>Mode</FormLabel>
            <HStack {...roleGroup}>
              {SCRIM_MODE_OPTIONS.map(option => {
                const radio = getRadioProps({ value: option.value })
                return (
                  <RadioCard key={option.value} {...radio}>
                    {option.label}
                  </RadioCard>
                )
              })}
            </HStack>
          </FormControl>
          <FormControl>
            <FormLabel>Team Size</FormLabel>
            <NumberInput min={1} max={10} defaultValue={settings?.teamSize ?? 5} onChange={e => onChange({ teamSize: +e })}>
              <NumberInputField tabIndex={1} />
            </NumberInput> 
          </FormControl>
          <FormControl>
            <FormLabel>Number of Teams</FormLabel>
            <NumberInput min={2} max={10} defaultValue={settings?.numTeams ?? 2} onChange={e => onChange({ numTeams: +e })}>
              <NumberInputField tabIndex={2} />
            </NumberInput> 
          </FormControl>
        </MenuList>
      </Menu>
    </>
  )
}

MemberGroupSettings.propTypes = {
  settings: PropTypes.object,
  onChange: PropTypes.func
}

export default MemberGroupSettings;