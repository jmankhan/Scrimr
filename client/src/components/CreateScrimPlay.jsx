import React from 'react';
import { Container, Grid, Header, SegmentGroup, Segment } from 'semantic-ui-react';
import Member from './Member';

const CreateScrimPlay = (props) => {
  let teams = [];
  if(props.autoBalance) {
    const numTeams = Math.floor(props.pool.length / props.teamSize);
    const members = props.pool.sort((a, b) => a.rank > b.rank ? -1 : 1);
    for(let i=0; i<numTeams; i++) {
      members[i].isCaptain = true;
      teams.push({
        id: i,
        name: `${members[i].name}'s Team`,
        members: members.filter((member,index) => index % props.teamSize === 0),
      });
    }
  } else if(props.autoDraft) {
    const numTeams = Math.floor(props.pool.length / props.teamSize);
    const members = props.pool.sort(() => Math.random() < 0.5 ? -1 : 1);
    for(let i=0; i<numTeams; i++) {
      members[i].isCaptain = true;

      teams.push({
        id: i,
        name: `${members[i].name}'s Team`,
        members: members.slice(i, i+props.teamSize*numTeams),
      });
    }
  } else {
    teams = props.teams;
  }

  return (
    <Container>
      <Grid centered columns={props.pool.length / props.teamSize}>
        <Grid.Row>
          {teams.map(team => (
            <Grid.Column key={team.id}>
              <SegmentGroup>
                <Segment>
                  <Header style={{ textAlign: 'center' }}>{team.name}</Header>
                </Segment>
                {team.members.map(member => (
                  <Member key={member.id} {...member} />
                ))}
              </SegmentGroup>
            </Grid.Column>
          ))}
        </Grid.Row>
        <Grid.Row>
          <Header>{props.members.find(member => member.id === props.draftFirst).summoner.name + ' will draft first.'}</Header>
        </Grid.Row>
      </Grid>
    </Container>
  )
}

export default CreateScrimPlay;
