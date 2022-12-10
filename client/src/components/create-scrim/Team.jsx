import {
  List,
  ListItem
} from '@chakra-ui/react';
import Member from './Member';

const Team = ({ summoners }) => {
  return (
    <List spacing={1} w='100%'>
      {summoners.map(summoner => (
        <ListItem 
          key={summoner.id}
          mx='auto'
          rounded='md'>
            <Member {...summoner} />
        </ListItem>
      ))}
    </List>
  )
}

export default Team;