import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Dropdown, Header, Segment, SegmentGroup } from 'semantic-ui-react';

const CreateScrimCoinflip = (props) => {
	const [hasFlipped, setHasFlipped] = useState(false);
	const [decision, setDecision] = useState(0);
	const [reward, setReward] = useState(0);
	const [won, setWon] = useState(false);
	const [caller, setCaller] = useState(null);

	useEffect(() => {
		const captains = props.members.filter(member => member.isCaptain);
		const caller = captains[Math.round(Math.random() * 100) % captains.length];
		setCaller(caller);
	}, [props.members]);

	const handleFlipSelection = (e, data) => {
		setDecision(data.value);
	}

	const handleRewardChange = (e, data) => {
		setReward(data.value);
	}

	const handleFlip = () => {
		const won = Math.round(Math.random()) === decision;
		setWon(won);
		setHasFlipped(true);

		props.onChange({ memberId: caller.id, won, reward });
	}

    return (
		<Grid centered columns={3}>
			<Grid.Row>
				<Grid.Column>
					{caller &&
						<SegmentGroup>
							<Segment>
								<Header style={{ display: 'inline', paddingRight: '1em' }}>{caller.name} chooses: </Header>
								<Dropdown
									options={[{text: 'Heads', value: 0}, {text: 'Tails', value: 1}]}
									defaultValue={decision}
									simple
									disabled={hasFlipped}
									onChange={handleFlipSelection} />
							</Segment>
							<Segment>
								<Header style={{ display: 'inline', paddingRight: '1em'}}>in order to: </Header>
								<Dropdown
										options={[{text: 'Draft first player', value: 0}, {text: 'Choose map side', value: 1}]}
										defaultValue={reward}
										simple
										disabled={hasFlipped}
										onChange={handleRewardChange} />
							</Segment>
						</SegmentGroup>
					}
				</Grid.Column>
			</Grid.Row>
			<Grid.Row>
				<Grid.Column>
					<Button primary disabled={hasFlipped} onClick={handleFlip}>Flip</Button>
				</Grid.Column>
			</Grid.Row>
			{hasFlipped &&
				<Grid.Row style={{ height: '40%' }}>
					<Grid.Column>
						<Header>{caller.name} {won ? 'Won' : 'Did not win'}</Header>
					</Grid.Column>
				</Grid.Row>
			}
		</Grid>
    )
}

CreateScrimCoinflip.propTypes = {
	members: PropTypes.array,
	onChange: PropTypes.func
}

export default CreateScrimCoinflip;
