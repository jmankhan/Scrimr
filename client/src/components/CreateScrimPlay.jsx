import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Grid,
  Header,
  SegmentGroup,
  Segment,
  Card,
} from "semantic-ui-react";
import Member from "./Member";
import "./CreateScrimPlay.css";

const CreateScrimPlay = (props) => {
  const [teamGroups, setTeamGroups] = useState([]);

  useEffect(() => {
    setTeamGroups(
      props.teams.reduce((result, team, index) => {
        const chunkIdx = Math.floor(index / 2);
        if (!result[chunkIdx]) {
          result[chunkIdx] = { id: chunkIdx, teams: [] };
        }
        result[chunkIdx].teams.push(team);
        return result;
      }, [])
    );
  }, [props.teams]);

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

  const handleSwapTeams = (id) => {
    const group = teamGroups.find((g) => g.id === id);
    group.teams = [group.teams[1], group.teams[0]];
    setTeamGroups([...teamGroups]);
  };

  return (
    <Container>
      <Grid columns={2}>
        {teamGroups.map((group, game) => (
          <Grid.Row key={group.id}>
            <Card className="cardContent" fluid>
              <Card.Content>
                <Grid columns={3}>
                  <Grid.Row>
                    {group.teams.map((team, index) => (
                      <>
                        <Grid.Column>
                          <SegmentGroup>
                            <Segment
                              className={index === 0 ? "team1" : "team2"}
                            >
                              <Header>Team {index + 1}</Header>
                            </Segment>
                            {team.members.map((member) => (
                              <Member key={member.id} {...member} />
                            ))}
                          </SegmentGroup>
                        </Grid.Column>
                        {index === 0 && (
                          <Grid.Column>
                            <div className="header">
                              <strong>Game {game + 1}</strong>
                            </div>
                            <Button
                              className="swapTeams"
                              icon="arrows alternate horizontal"
                              onClick={() => handleSwapTeams(group.id)}
                            />
                          </Grid.Column>
                        )}
                      </>
                    ))}
                  </Grid.Row>
                </Grid>
              </Card.Content>
            </Card>
          </Grid.Row>
        ))}
      </Grid>
    </Container>
  );
};

export default CreateScrimPlay;
