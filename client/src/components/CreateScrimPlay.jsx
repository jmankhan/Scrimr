import React from "react";
import {
  Container,
  Grid,
  Header,
  SegmentGroup,
  Segment,
} from "semantic-ui-react";
import Member from "./Member";

const CreateScrimPlay = (props) => {
  let teams = [];
  if (props.autoBalance) {
    const numTeams = Math.floor(props.members.length / props.teamSize);
    const members = props.members.sort((a, b) => (a.rank > b.rank ? -1 : 1));
    for (let i = 0; i < numTeams; i++) {
      members[i].isCaptain = true;
      teams.push({
        id: i,
        name: `${members[i].summoner.name}'s Team`,
        members: members.filter((member, index) => index % i === 0),
      });
    }
  } else if (props.autoDraft) {
    const members = props.members.sort(() => (Math.random() < 0.5 ? -1 : 1));
    for (let i = 0; i < members.length; i += props.teamSize) {
      const teamMembers = members.slice(i, i + props.teamSize);
      teamMembers[0].isCaptain = true;

      teams.push({
        id: i,
        name: `${teamMembers[0].summoner.name}'s Team`,
        members: teamMembers,
      });
    }
  } else {
    teams = props.teams;
  }

  return (
    <Container>
      <Grid columns={2}>
        <Grid.Row>
          {teams.map((team, index) => (
            <Grid.Column key={team.id}>
              <SegmentGroup>
                <Segment>
                  <Header style={{ textAlign: "center" }}>
                    {team.name} - Team {index + 1}
                  </Header>
                </Segment>
                {team.members.map((member) => (
                  <Member key={member.id} {...member} />
                ))}
              </SegmentGroup>
            </Grid.Column>
          ))}
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default CreateScrimPlay;
