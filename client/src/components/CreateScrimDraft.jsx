import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
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

const CreateScrimDraft = (props) => {
    const [teams, setTeams] = useState([]);
    const captains = props.members.filter((member) => member.isCaptain);
    const [turn, setTurn] = useState(0);
    const [sequence, setSequence] = useState([]);

    useEffect(() => {
        setTeams(
            captains
                .sort((a, b) => (a.id === props.draftFirst ? 1 : -1))
                .map((captain) => ({
                    id: captain.id,
                    name: `${captain.summoner.name}'s Team`,
                    members: [captain],
                }))
        );
    }, [props.members]);

    const getUnassignedMembers = () => {
        return props.members.filter((member) => {
            return !teams.reduce(
                (a, e) =>
                    a ||
                    e.members.reduce((b, m) => b || m.id === member.id, false),
                false
            );
        });
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
            (((turn - 1) % captains.length) + captains.length) %
            captains.length;
        setTurn(prevTurn);
        setSequence([...sequence]);

        props.onChange(teams);
    };

    const removeMember = (teamId, memberId) => {
        const team = teams.find((t) => t.id === teamId);
        team.members = [
            ...team.members.filter((member) => member.id !== memberId),
        ];
        setTeams([...teams]);
        props.onChange(teams);
    };

    return (
        <Container>
            <Grid centered columns={teams.length}>
                <Grid.Row>
                    {teams.length > 0 &&
                        teams.map((team, teamIndex) => (
                            <Grid.Column key={team.id}>
                                <SegmentGroup>
                                    <Segment
                                        inverted={
                                            captains[turn].id ===
                                            team.members[0].id
                                        }
                                    >
                                        <Header style={{ textAlign: "center" }}>
                                            {team.name}
                                        </Header>
                                    </Segment>
                                    {team.members.map((member) => (
                                        <Member key={member.id} {...member} />
                                    ))}
                                    {new Array(5 - team.members.length)
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

            <Grid columns={3}>
                {getUnassignedMembers().map((member) => (
                    <Grid.Column key={member.id}>
                        <Member {...member} canAdd onAdd={addMember} />
                    </Grid.Column>
                ))}
            </Grid>
        </Container>
    );
};

CreateScrimDraft.propTypes = {
    members: PropTypes.array,
    draftFirst: PropTypes.number,
    onChange: PropTypes.func,
};

export default CreateScrimDraft;
