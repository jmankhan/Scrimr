import React, { useEffect, useState } from "react";
import {
  Accordion,
  Container,
  Grid,
  Label,
  Segment,
  SegmentGroup,
} from "semantic-ui-react";
import { STEPS } from "../utils/constants.js";
import { chunkMembers } from "../utils/index.js";
import Member from "./Member.jsx";

const CreateScrimSpectator = (props) => {
  const [panels, setPanels] = useState([]);

  useEffect(() => {
    renderPanels(props.data);
  }, [props.data]);

  const renderPanels = (data) => {
    const currentStepIndex = STEPS.findIndex((step) => step.name === data.step);
    const allPanels = [
      {
        key: 0,
        title: "Pool",
        content: {
          content: (
            <Grid columns={5}>
              {chunkMembers(data.pool, 5).map((group) => (
                <Grid.Row key={group.id}>
                  {group.members.map((member) => (
                    <Grid.Column key={member.id}>
                      <Member {...member} />
                    </Grid.Column>
                  ))}
                </Grid.Row>
              ))}
            </Grid>
          ),
        },
      },
      {
        key: 1,
        title: "Select Captains",
        content: {
          content: (
            <Grid columns={2}>
              <Grid.Row>
                {data.pool
                  .filter((member) => member.isCaptain)
                  .map((member) => (
                    <Grid.Column key={member.id}>
                      <Member {...member} />
                    </Grid.Column>
                  ))}
              </Grid.Row>
            </Grid>
          ),
        },
      },
      {
        key: 2,
        title: "Prize Wheel",
        content: {
          content: (
            <Grid columns={data.teams.length}>
              {data.teams
                .sort((a, b) => (a.draftOrder > b.draftOrder ? 1 : -1))
                .map((team) => (
                  <Grid.Column key={team.id}>
                    <Segment>{team.name}</Segment>
                  </Grid.Column>
                ))}
            </Grid>
          ),
        },
      },
      {
        key: 3,
        title: "Draft",
        content: {
          content: (
            <Grid columns={data.teams.length}>
              {data.teams
                .sort((a, b) => (a.draftOrder > b.draftOrder ? 1 : -1))
                .map((team) => (
                  <Grid.Column key={team.id}>
                    <SegmentGroup>
                      <Segment>{team.name}</Segment>
                      {team.members.map((member) => (
                        <Segment key={member.id}>
                          <Member {...member} />
                        </Segment>
                      ))}
                    </SegmentGroup>
                  </Grid.Column>
                ))}
            </Grid>
          ),
        },
      },
      {
        key: 4,
        title: "Play",
        content: {
          content: (
            <Grid columns={data.teams.length}>
              <Grid.Row>
                {data.teams
                  .sort((a, b) => (a.draftOrder > b.draftOrder ? -1 : 1))
                  .map((team) => (
                    <Grid.Column key={team.id}>
                      <SegmentGroup>
                        <Segment>{team.name}</Segment>
                        {team.members.map((member) => (
                          <Segment key={member.id}>
                            <Member {...member} />
                          </Segment>
                        ))}
                      </SegmentGroup>
                    </Grid.Column>
                  ))}
              </Grid.Row>
            </Grid>
          ),
        },
      },
    ];

    const p = allPanels.filter((panel) => panel.key <= currentStepIndex);
    p[currentStepIndex].title = {
      content: (
        <span>
          {p[currentStepIndex].title} <Label>Current</Label>
        </span>
      ),
    };
    setPanels(p);
  };

  return (
    <Container style={{ textAlign: "left", marginTop: "3rem" }}>
      <Accordion fluid styled exclusive={false} panels={panels}></Accordion>
    </Container>
  );
};

export default CreateScrimSpectator;
