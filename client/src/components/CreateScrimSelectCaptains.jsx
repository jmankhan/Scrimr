import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Container, Grid, Header, List } from "semantic-ui-react";
import Member from "./Member";

const CreateScrimSelectCaptains = (props) => {
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(false);

    useEffect(() => {
        setMembers(props.members);
        setSelectedMember(false);
    }, [props.members]);

    const handleMoveMember = () => {
        const m = members.find((m) => m.isSelected);
        m.isCaptain = !m.isCaptain;
        m.isSelected = false;
        setMembers([...members]);
        setSelectedMember(false);
        props.onChange([...members]);
    };

    const selectMember = (id) => {
        setMembers(members.map((m) => ({ ...m, isSelected: m.id === id })));
        setSelectedMember(true);
    };

    const handleRandomize = () => {
        const randomizedList = [...members].sort(() => 0.5 - Math.random());
        const captains = new Set([randomizedList[0].id, randomizedList[1].id]);
        const newMembers = members.map((member) => ({
            ...member,
            isCaptain: captains.has(member.id),
        }));
        setMembers(newMembers);
        props.onChange(newMembers);
    };

    return (
        <Container>
            <Grid columns={3} centered>
                <Grid.Row>
                    <Grid.Column textAlign="center">
                        <Button
                            icon="random"
                            content="Randomize"
                            onClick={handleRandomize}
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
                                            <Member
                                                {...member}
                                                onSelect={selectMember}
                                            />
                                        </List.Item>
                                    );
                                })}
                    </List>
                </Grid.Column>

                <Grid.Column verticalAlign="middle">
                    <Button.Group vertical>
                        <Button
                            icon="arrows alternate horizontal"
                            onClick={handleMoveMember}
                            disabled={!selectedMember}
                        />
                    </Button.Group>
                </Grid.Column>

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
                                            onSelect={selectMember}
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
