import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Divider, Grid, Header, Segment, SegmentGroup } from 'semantic-ui-react';
import Member from './Member';

const CreateScrimDraft = (props) => {
	const [teams, setTeams] = useState([]);
	const captains = props.members.filter(member => member.isCaptain);
	const [turn, setTurn] = useState(0);

	useEffect(() => {
		setTeams(
			captains
				.sort((a, b) => a.id === props.draftFirst ? 1 : -1)
				.map(captain => ({id: captain.id, name: `${captain.name}'s Team`, members: [captain]}))
		);
	}, [props.members]);

	const getUnassignedMembers = () => {
		return props.members.filter(member => {
			return !teams.reduce((a, e) => a || e.members.reduce((b, m) => b || m.id === member.id, false), false);
		})
	}
	const addMember = (teamId) => {
		const team = teams.find(t => t.id === teamId);
		team.members = [...team.members, getUnassignedMembers()[0]]
		setTeams([...teams]);
		setTurn((turn + 1) % captains.length);
	}

	const removeMember = (teamId, memberId) => {
		const team = teams.find(t => t.id === teamId);
		team.members = [...team.members.filter(member => member.id !== memberId)];
		setTeams([...teams]);
	}

	return (
		<Container>
			<Header>{`${captains[turn].name}'s Turn`}</Header>
			<Grid centered columns={teams.length}>
				<Grid.Row>
					{teams.length > 0 && teams.map((team, teamIndex) => (
						<Grid.Column key={team.id}>
							<SegmentGroup>
								<Segment>
									<Header>{team.name}</Header>
								</Segment>
								{team.members.map(member => (
									<Member key={member.id} canRemove={!member.isCaptain} onRemove={() => removeMember(team.id, member.id)} {...member} />
								))}
								{new Array(5-team.members.length).fill(0).map((e, i) => (
									<Segment key={i} secondary textAlign='center'>
										<Button size='tiny' onClick={() => addMember(team.id)} content='Add Member' disabled={turn !== teamIndex} />
                  					</Segment>
								))}
							</SegmentGroup>
						</Grid.Column>
					))}
				</Grid.Row>
			</Grid>

			<Divider section />

			<Grid centered columns={3}>
				{getUnassignedMembers().map(member => (
					<Grid.Column key={member.id}>
						<Member {...member} />
					</Grid.Column>
				))}
			</Grid>
		</Container>
	)
}

CreateScrimDraft.propTypes = {
	members: PropTypes.array,
	draftFirst: PropTypes.number,
	onChange: PropTypes.func,
}

export default CreateScrimDraft;
