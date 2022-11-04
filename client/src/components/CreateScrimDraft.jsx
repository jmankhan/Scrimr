import React, { useEffect, useState } from "react";
import "./CreateScrimDraft.css";
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Modal,
  Segment,
  SegmentGroup,
} from "semantic-ui-react";
import Member from "./Member";
import { chunkMembers } from "../utils";

const CreateScrimDraft = (props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const [turn, setTurn] = useState(0);
  const [sequence, setSequence] = useState([]);

  useEffect(() => {
    // nulls and undefined last if teams are sorted this way
    setTeams(
      props.teams.sort((a, b) => (a.draftOrder < b.draftOrder ? -1 : 1))
    );
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
    const team = teams[turn];
    team.members = [
      ...team.members,
      props.members.find((m) => m.id === memberId),
    ];
    setTeams([...teams]);
    setTurn((turn + 1) % teams.length);
    setSequence([...sequence, { memberId, teamId: team.id }]);

    props.onChange(teams);
  };

  const handleClear = () => {
    const newTeams = teams.map((team) => ({
      ...team,
      members: [team.members[0]],
    }));
    setTeams(newTeams);
    setModalOpen(false);
    setSequence([]);

    props.onChange(newTeams);
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
      (((turn - 1) % teams.length) + teams.length) % teams.length;
    setTurn(prevTurn);
    setSequence([...sequence]);

    props.onChange(teams);
  };

  return (
    <>
      {teams && teams.length > 0 && (
        <>
          <Container>
            <Grid columns={teams.length}>
              <Grid.Row>
                {teams.length > 0 &&
                  teams.map((team, i) => (
                    <Grid.Column key={team.id}>
                      <SegmentGroup>
                        <Segment
                          inverted={
                            teams[turn].members[0].id === team.members[0].id
                          }
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
              <Header>{`${teams[turn].members[0].summoner.name}'s Turn`}</Header>
            )}
            <Button
              icon="undo"
              content="Undo"
              style={{ marginTop: "1em" }}
              disabled={sequence.length <= 0}
              onClick={handleUndo}
            />
            <Modal
              trigger={
                <Button
                  icon="close"
                  content="Clear"
                  open={modalOpen}
                  style={{ marginTop: "1em" }}
                  onClick={() => setModalOpen(!modalOpen)}
                />
              }
              open={modalOpen}
            >
              <Modal.Header>Are you sure?</Modal.Header>
              <Modal.Content>
                Resetting the draft cannot be undone.
              </Modal.Content>
              <Modal.Actions>
                <Button negative onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button positive onClick={handleClear}>
                  Ok
                </Button>
              </Modal.Actions>
            </Modal>
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
      )}
    </>
  );
};

export default CreateScrimDraft;
