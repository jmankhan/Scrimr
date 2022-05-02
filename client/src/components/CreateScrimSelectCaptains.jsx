import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { Container, List } from 'semantic-ui-react';
import Member from './Member';

const CreateScrimSelectCaptains = (props) => {
	const toggleStar = (id) => {
		const members = [...props.members];
		const member = members.find(member => member.id === id);
		member.isCaptain = !member.isCaptain;
		props.onChange(members);
	}

	return (
		<Container>
			<List>
				{props.members.length > 0 && props.members.map(member => {
					return (
						<List.Item key={member.id}>
							<Member canStar isStarred={member.isCaptain} onStar={toggleStar} {...member} />
						</List.Item>
					)
				})}
			</List>
		</Container>
	)
}

CreateScrimSelectCaptains.propTypes = {
	members: PropTypes.array,
	onChange: PropTypes.func
}

export default CreateScrimSelectCaptains;
