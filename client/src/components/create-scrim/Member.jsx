import PropTypes from 'prop-types';
import useRankImages from "../../hooks/useRankImage";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Heading,
  HStack,
  Image,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';

const Member = ({ id, name, rank, role, canRemove = false, onRemove, canUpdate = false, onUpdate, canAdd = false, onAdd }) => {
  const [imageSrc, title] = useRankImages(rank);
  return (
    <Card 
      variant="elevated" 
      direction={{ base: 'column', sm: 'row' }}
      p={4} 
      overflow='hidden'>
      <Image src={imageSrc} alt={title} alignSelf='center' boxSize='4rem' objectFit='fit' maxW={{ base: '100%', sm: '200px' }} />
      <CardBody>
        <Heading size='md'>{name}</Heading>
        {role}
      </CardBody>
      <CardFooter>
        <ButtonGroup>
          <VStack spacing={1}>
            {canRemove && 
              <Button variant='solid' size="sm" onClick={() => onRemove(id)}>
                <CloseIcon />
              </Button>
            }
            {canUpdate &&
              <Button variant='solid' size='sm' onClick={() => onUpdate(id)}>
                <EditIcon />
              </Button>
            }
            {canAdd &&
              <Button variant='solid' size='sm' onClick={() => onAdd(id)}>
                <AddIcon />
              </Button>
            }
          </VStack>
        </ButtonGroup>
      </CardFooter>
    </Card>
  )
}

Member.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rank: PropTypes.number,
  onAdd: PropTypes.func,
  canRemove: PropTypes.bool,
  onRemove: PropTypes.func,
  canUpdate: PropTypes.bool,
  onUpdate: PropTypes.func
};

export default Member;