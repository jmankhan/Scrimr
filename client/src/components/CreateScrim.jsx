import React, { useState } from 'react';
import { Button, Icon, Menu, Step } from 'semantic-ui-react';
import CreateScrimPool from './CreateScrimPool';
import CreateScrimSelectCaptains from './CreateScrimSelectCaptains';
import CreateScrimCoinflip from './CreateScrimCoinflip';
import CreateScrimDraft from './CreateScrimDraft';
import CreateScrimPlay from './CreateScrimPlay';

const initialState = {
    activeStep: 'pool',
    activeStepOrder: 1,
    steps: [
        {name: 'pool', title: 'Pool', description: 'Add candidate players', icon: 'list ul', order: 1},
        {name: 'select-captains', title: 'Select Captains', description: 'Choose who leads', icon: 'star outline', order: 2},
        {name: 'coinflip', title: 'Coin Flip', description: 'Pray to the RNG gods', icon: 'dollar', order: 3},
        {name: 'draft', title: 'Draft', description: 'Form teams', icon: 'user outline', order: 4},
        {name: 'play', title: 'Play', description: 'Start playing!', icon: 'gamepad', order: 5}
    ],
    pool: [],
    coinflipWinner: null,
	draftFirst: null,
	sideFirst: null,
  	teams: [],
	teamSize: 5,
	autoDraft: false,
	autoBalance: false,
}

const CreateScrim = () => {
    const [data, setData] = useState(initialState);
    const [canContinue, setCanContinue] = useState(false);

    const handleContinue = () => {
		let activeStep = data.steps.find(step => step.order === data.activeStepOrder + 1).name;
		let activeStepOrder = data.activeStepOrder + 1;

		if(data.activeStepOrder === 1 && data.autoDraft) {
			activeStep = 'play';
			activeStepOrder = 5;
		}
        setData({
            ...data,
            activeStep,
			activeStepOrder,
        });

        setCanContinue(false);
    }

    const handleBack = () => {
        if(data.activeStepOrder > 1) {
            setData({
                ...data,
                activeStep: data.steps.find(step => step.order === data.activeStepOrder - 1).name,
                activeStepOrder: data.activeStepOrder - 1,
             });
        }
    }

    const updatePoolData = ({ members, teamSize, autoDraft, autoBalance }) => {
        setData({
            ...data,
            pool: [...members],
			teamSize,
			autoDraft,
			autoBalance
        });

        setCanContinue(members.length >= teamSize * 2);
    }

    const updateSelectCaptains = (members) => {
        setData({
            ...data,
            members: [...members]
        })

        setCanContinue(members.filter(member => member.isCaptain).length >= 2);
    }

    const updateCoinflip = (result) => {
		const captains = data.pool.filter(member => member.isCaptain);
		const nextCaptain = captains[captains.findIndex(captain => captain.id === result.memberId) + 1 % (captains.length - 1)];
		let draftFirst, sideFirst;
		if(result.won && result.reward === 0 || (!result.won && result.reward === 1)) {
			draftFirst = result.memberId;
			sideFirst = nextCaptain.id;
		} else {
			draftFirst = nextCaptain.id;
			sideFirst = result.memberId;
		}

		setData({
			...data,
			coinflipWinner: result.memberId,
			draftFirst,
			sideFirst
		});

		setCanContinue(true);
    }

	const updateDraft = (teams) => {
		setData({
			...data,
			teams
		});

		setCanContinue(teams.length > 0);
	}

    return (
        <div>
            <Step.Group widths={data.steps.length}>
                {data.steps.map(step => (
                    <Step key={step.name}
                          active={step.name === data.activeStep}
                          disabled={step.order > step.activeStepOrder}
                          completed={step.order < step.activeStepOrder}>
                        <Icon name={step.icon}></Icon>
                        <Step.Content>
                            <Step.Title>{step.title}</Step.Title>
                            <Step.Description>{step.description}</Step.Description>
                        </Step.Content>
                    </Step>
                ))}
            </Step.Group>

            {data.activeStep === 'pool' && <CreateScrimPool members={data.pool} teamSize={data.teamSize} onChange={updatePoolData} />}
            {data.activeStep === 'select-captains' && <CreateScrimSelectCaptains members={data.pool} onChange={updateSelectCaptains} />}
            {data.activeStep === 'coinflip' && <CreateScrimCoinflip members={data.pool} onChange={updateCoinflip} />}
			{data.activeStep === 'draft' && <CreateScrimDraft members={data.pool} draftFirst={data.draftFirst} />}
			{data.activeStep === 'play' && <CreateScrimPlay {...data} />}

            <Menu fixed='bottom' inverted>
                <Menu.Item position='left'>
                    <Button color='red' onClick={handleBack} disabled={data.activeStepOrder === 1}>Back</Button>
                </Menu.Item>
                <Menu.Item position='right'>
                    <Button primary onClick={handleContinue} disabled={!canContinue}>Continue</Button>
                </Menu.Item>
            </Menu>
        </div>
    )
}

export default CreateScrim;
