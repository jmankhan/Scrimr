import React, { useState } from 'react';
import { Button, Icon, Menu, Step } from 'semantic-ui-react';
import CreateScrimPool from './CreateScrimPool';
import CreateScrimSelectCaptains from './CreateScrimSelectCaptains';

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
    captains: [],
    coinflipWinner: null,
    teams: []
}

const CreateScrim = () => {
    const [data, setData] = useState(initialState);
    const [canContinue, setCanContinue] = useState(false);

    const handleContinue = () => {
        setData({
            ...data, 
            activeStep: data.steps.find(step => step.order === data.activeStepOrder + 1).name,
            activeStepOrder: data.activeStepOrder + 1,
        });
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

    const updatePoolData = (members) => {
        setData({
            ...data, 
            pool: {...members}
        });

        setCanContinue(members.length > 0);
    }

    const updateSelectCaptains = (captains) => {
        setData({
            ...data,
            captains: [...captains]
        })
    }

    return (
        <div>
            <Step.Group widths={data.steps.length}>
                {data.steps.map(step => (
                    <Step active={step.name === data.activeStep} disabled={step.order > step.activeStepOrder} completed={step.order < step.activeStepOrder}>
                        <Icon name={step.icon}></Icon>
                        <Step.Content>
                            <Step.Title>{step.title}</Step.Title>
                            <Step.Description>{step.description}</Step.Description>
                        </Step.Content>
                    </Step>
                ))}
            </Step.Group>

            {data.activeStep === 'pool' && <CreateScrimPool members={data.pool} onChange={updatePoolData} />}
            {data.activeStep === 'select-captains' && <CreateScrimSelectCaptains members={data.pool} onChange={updateSelectCaptains} />}

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