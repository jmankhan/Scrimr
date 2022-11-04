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
import { chunkMembers } from "../utils";

const CreateScrimPlay = (props) => {
  const [teamGroups, setTeamGroups] = useState([]);

  useEffect(() => {
    const groups = chunkMembers(props.teams, 2, "teams");
    groups.forEach((group) => {
      group.teams.sort((a, b) => (a.sideOrder > b.sideOrder ? 1 : -1));
    });
    setTeamGroups(groups);
  }, [props.teams]);

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
                      <React.Fragment key={team.id}>
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
                      </React.Fragment>
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
