import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Dropdown, Header, Segment, SegmentGroup } from 'semantic-ui-react';
import './CreateScrimCoinflip.css';

const CreateScrimCoinflip = (props) => {
	const [hasFlipped, setHasFlipped] = useState(false);
  const [hasPickedReward, setHasPickedReward] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [doneSpinning, setDoneSpinning] = useState(false);
	const [decision, setDecision] = useState(0);
	const [reward, setReward] = useState(0);
  const [won, setWon] = useState();
  const [winner, setWinner] = useState();
  const [loser, setLoser] = useState();
  const [sideSelection, setSideSelection] = useState(0);
	const [caller, setCaller] = useState(null);
  const [resultMessage, setResultMessage] = useState();

	useEffect(() => {
		const captains = props.members.filter(member => member.isCaptain);
		const caller = captains[Math.round(Math.random() * 100) % captains.length];
		setCaller(caller);
	}, [props.members, props.draftFirst, props.sideFirst, props.coinflipWinner, props.sideSelection]);

	const handleFlip = () => {
    const captains = props.members.filter(member => member.isCaptain);
    const nextCaptain = captains[
      (captains.findIndex(captain => captain.id === caller.id) + 1) % captains.length
    ];
		const wonFlip = Math.round(Math.random()) === decision;
    console.log('won: ' + wonFlip + ' decision: ' + decision);
    setWon(wonFlip);
		setWinner(wonFlip ? caller.id : nextCaptain.id);
    setLoser(wonFlip ? nextCaptain.id : caller.id);
    setHasFlipped(true);

    setTimeout(() => {
      setDoneSpinning(true);
    }, 2000);
	}

  const handleSubmit = () => {
    setHasSubmitted(true);
    const draftFirst = reward === 0 ? winner : loser;
    const sideFirst = reward === 1 ? winner : loser;
		const captains = props.members.filter(member => member.isCaptain);

    setResultMessage(
      `${captains.find(c => c.id === draftFirst).summoner.name} will draft first.\n` +
      `${captains.find(c => c.id === sideFirst).summoner.name} will be on ${sideSelection === 0 ? 'Team 1' : 'Team 2'}.`
    );

    props.onChange({ coinflipWinner: winner.id, draftFirst, sideFirst, sideSelection });
  }

  const getSideFirstName = () => {
    if(winner == null) {
      return null;
    }

    const sideFirst = reward === 1 ? winner : loser;
    return props.members.find(member => member.id === sideFirst).summoner.name;
  }

  const getCoinClass = () => {
    if(winner == null) {
      return null;
    }

    const cn = won ? (decision === 0 ? 'heads' : 'tails') : ( decision === 0 ? 'tails' : 'heads');
    console.log('classname ' + cn);
    return cn;
  }

  return (
    <Grid centered columns={3}>
      <Grid.Row>
        <Grid.Column>
          {caller &&
            <Segment>
              <Header className='dropdownLabel'>{caller.summoner.name} chooses:</Header>
              <Dropdown
                options={[{text: 'Heads', value: 0}, {text: 'Tails', value: 1}]}
                defaultValue={decision}
                simple
                disabled={hasFlipped}
                onChange={(e, data) => setDecision(data.value)} />
            </Segment>
          }
        </Grid.Column>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column>
          <Button primary fluid disabled={hasFlipped} onClick={handleFlip}>Flip</Button>
        </Grid.Column>
      </Grid.Row>

      {hasFlipped &&
        <Grid.Row>
          <Grid.Column>
            <div id='coin' className={getCoinClass()}>
              <div class='side-a'>Heads</div>
              <div class='side-b'>Tails</div>
            </div>
          </Grid.Column>
        </Grid.Row>
      }

      {doneSpinning &&
        <>
          <Grid.Row>
            <Grid.Column>
              <Segment>
                <Header style={{ display: 'inline', paddingRight: '1em'}}>{props.members.find(m => m.id === winner).summoner.name} chooses to:</Header>
                <Dropdown
                    options={[{text: 'Draft first player', value: 0}, {text: 'Choose map side', value: 1}]}
                    defaultValue={reward}
                    simple
                    disabled={hasPickedReward}
                    onChange={(e, data) => setReward(data.value)} />
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Button primary fluid disabled={hasPickedReward} onClick={() => setHasPickedReward(true)}>Pick Reward</Button>
            </Grid.Column>
          </Grid.Row>
        </>
      }

      {hasPickedReward &&
        <>
          <Grid.Row>
            <Grid.Column>
              {caller &&
                <Segment>
                  <Header className='dropdownLabel'>{getSideFirstName()} chooses:</Header>
                  <Dropdown
                    options={[{text: 'Team 1', value: 0}, {text: 'Team 2', value: 1}]}
                    defaultValue={sideSelection}
                    simple
                    disabled={hasSubmitted}
                    onChange={(e, data) => setSideSelection(data.value)} />
                </Segment>
              }
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Button primary fluid disabled={hasSubmitted} onClick={handleSubmit}>Submit</Button>
            </Grid.Column>
          </Grid.Row>
        </>
      }

      {resultMessage && <Header>{resultMessage}</Header>}
    </Grid>
  )
}

CreateScrimCoinflip.propTypes = {
	members: PropTypes.array,
	onChange: PropTypes.func
}

export default CreateScrimCoinflip;
