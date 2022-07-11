import React, { useEffect, useState } from "react";
import "./CreateScrimDraft.css";
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Segment,
  SegmentGroup,
} from "semantic-ui-react";
import Member from "./Member";
import { chunkMembers } from "../utils";

const CreateScrimDraft = (props) => {
  const [teams, setTeams] = useState([]);
  const [turn, setTurn] = useState(0);
  const [sequence, setSequence] = useState([]);
  const captains = props.draftOrder.map((captainId) =>
    props.members.find((m) => m.id === captainId)
  );

  useEffect(() => {
    setTeams(props.teams);
  }, [props.teams]);

  const getUnassignedMembers = () => {
    const assignedMemberIds = new Set(
      teams
        .map((team) => team.members)
        .flat()
        .map((member) => member.id)
    );
    return chunkMembers(
      props.members.filter((member) => !assignedMemberIds.has(member.id)),
      5
    );
  };

  const addMember = (memberId) => {
    const team = teams.find((t) => t.members[0].id === captains[turn].id);
    team.members = [
      ...team.members,
      props.members.find((m) => m.id === memberId),
    ];
    setTeams([...teams]);
    setTurn((turn + 1) % captains.length);
    setSequence([...sequence, { memberId, teamId: team.id }]);

    props.onChange(teams);
  };

  const handleUndo = () => {
    if (sequence.length <= 0) {
      return;
    }

    const lastTurn = sequence.pop();
    const team = teams.find((team) => team.id === lastTurn.teamId);
    team.members = team.members.filter(
      (member) => member.id !== lastTurn.memberId
    );
    setTeams([...teams]);
    const prevTurn =
      (((turn - 1) % captains.length) + captains.length) % captains.length;
    setTurn(prevTurn);
    setSequence([...sequence]);

    props.onChange(teams);
  };

  return (
    <>
      <Container>
        <Grid columns={teams.length}>
          <Grid.Row>
            {teams.length > 0 &&
              teams.map((team, i) => (
                <Grid.Column key={team.id}>
                  <SegmentGroup>
                    <Segment
                      inverted={captains[turn].id === team.members[0].id}
                    >
                      <Header style={{ textAlign: "center" }}>
                        {team.name}
                      </Header>
                    </Segment>
                    {team.members.map((member) => (
                      <Member key={member.id} {...member} />
                    ))}
                    {new Array(props.teamSize - team.members.length)
                      .fill(0)
                      .map((e, i) => (
                        <Segment key={i} secondary>
                          <Header>&nbsp;</Header>
                        </Segment>
                      ))}
                  </SegmentGroup>
                </Grid.Column>
              ))}
          </Grid.Row>
        </Grid>

        {getUnassignedMembers().length > 0 && (
          <Header>{`${captains[turn].summoner.name}'s Turn`}</Header>
        )}
        <Button
          icon="undo"
          content="Undo"
          style={{ marginTop: "1em" }}
          disabled={sequence.length <= 0}
          onClick={handleUndo}
        />
        <Divider section />
      </Container>
      <Grid columns={7} centered>
        {getUnassignedMembers().map((row) => (
          <Grid.Row key={row.id}>
            {row.members.map((member) => (
              <Grid.Column key={member.id}>
                <Member {...member} canAdd onAdd={addMember} />
              </Grid.Column>
            ))}
          </Grid.Row>
        ))}
      </Grid>
    </>
  );
};

export default CreateScrimDraft;
