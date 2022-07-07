import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Container,
  Grid,
  Header,
  Input,
  List,
} from "semantic-ui-react";
import Member from "./Member";

const CreateScrimSelectCaptains = (props) => {
  const [members, setMembers] = useState([]);
  const [randomizedAmount, setRandomizedAmount] = useState();

  useEffect(() => {
    setMembers(props.members);
    setRandomizedAmount(
      Math.floor(props.members?.length / props.teamSize) || 2
    );
  }, [props.members]);

  const handleMoveMember = (id) => {
    const m = members.find((m) => m.id === id);
    m.isCaptain = true;
    setMembers([...members]);
    props.onChange([...members]);
  };

  const handleMoveCaptain = (id) => {
    const m = members.find((m) => m.id === id);
    m.isCaptain = false;
    setMembers([...members]);
    props.onChange([...members]);
  };

  const handleRandomizeAmount = (e, eventData) => {
    setRandomizedAmount(eventData.value);
  };

  const handleRandomize = () => {
    const randomizedList = [...members].sort(() => 0.5 - Math.random());
    const captains = new Set(
      randomizedList.slice(0, randomizedAmount).map((captain) => captain.id)
    );
    const newMembers = members.map((member) => ({
      ...member,
      isCaptain: captains.has(member.id),
    }));
    setMembers(newMembers);
    props.onChange(newMembers);
  };

  return (
    <Container>
      <Grid columns={2} centered relaxed>
        <Grid.Row>
          <Grid.Column textAlign="center">
            <Input
              label={
                <Button
                  icon="random"
                  content="Randomize"
                  onClick={handleRandomize}
                />
              }
              labelPosition="left"
              type="number"
              defaultValue={randomizedAmount}
              min="2"
              max={Math.min(10, props.members.length)}
              onChange={handleRandomizeAmount}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Column>
          <Header as="h1">Members</Header>
          <List>
            {members &&
              members
                .filter((m) => !m.isCaptain)
                .map((member) => {
                  return (
                    <List.Item key={member.id}>
                      <Member {...member} canAdd onAdd={handleMoveMember} />
                    </List.Item>
                  );
                })}
          </List>
        </Grid.Column>

        {/* <Grid.Column verticalAlign="middle">
          <Button.Group vertical>
            <Button
              icon="arrows alternate horizontal"
              onClick={handleMoveMember}
              disabled={!selectedMember}
            />
          </Button.Group>
        </Grid.Column> */}

        <Grid.Column>
          <Header as="h1">Captains</Header>
          <List>
            {members &&
              members
                .filter((member) => member.isCaptain)
                .map((member) => (
                  <List.Item key={member.id}>
                    <Member
                      {...member}
                      isCaptain
                      canRemove
                      onRemove={handleMoveCaptain}
                    />
                  </List.Item>
                ))}
          </List>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

CreateScrimSelectCaptains.propTypes = {
  members: PropTypes.array,
  onChange: PropTypes.func,
};

export default CreateScrimSelectCaptains;
