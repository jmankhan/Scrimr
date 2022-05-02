import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Container, Grid, Header, Input, List, Message, Search } from 'semantic-ui-react';
import Member from './Member';
import api from '../api';

const searchResultRenderer = ({ id, name, title }) => {
    return (<p id={id} title={title}>{name}</p>);
}

const CreateScrimPool = (props) => {
    const initialState = {
        id: 0,
        name: 'Pool 0',
        members: props.members,
		teamSize: props.teamSize,
		autoDraft: false,
		autoBalance: false,
    }

    const [data, setData] = useState(initialState);
    const [searchResults, setSearchResults] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [message, setMessage] = useState('');

    const handleSearch = async (e, { value }) => {
        if(value) {
            setIsSearchLoading(true);
            const results = await api.search(value);
            setSearchResults(results);
            setIsSearchLoading(false);
        }
        setSearchValue(value);
    }

	const handleMessageClear = () => {
		setMessage('');
	}

	const updateTeamSize = (e, eventData) => {
		const newData = {
			...data,
			teamSize: +eventData.value
		};
		setData(newData);

		props.onChange(newData);
	}

	const updateAutoDraft = (e, eventData) => {
		const newData ={
			...data,
			autoDraft: eventData.checked
		};
		setData(newData);

		props.onChange(newData);
	}

	const updateAutoBalance = (e, eventData) => {
		const newData = {
			...data,
			autoBalance: eventData.checked
		};
		setData(newData);

		props.onChange(newData);
	}

    const addMember = (e, eventData) => {
		if(data.members.find(member => member.id === eventData.result.id) != null) {
			setMessage(`${eventData.result.name} is already in the pool`);
			return;
		}

        const newData = {
            ...data,
            members: [...data.members, searchResults.find(result => result.id === eventData.result.id)],
        };

        setSearchValue('');
        setData(newData)
        props.onChange(newData);
    }

    const removeMember = (id) => {
        const newData = {
            ...data,
            members: data.members.filter(member => member.id !== id),
        };
        setData(newData);

        props.onChange(newData);
    }

    return (
        <Container>
			{message != '' && <Message error floating content={message} onDismiss={handleMessageClear} />}

			<Grid columns={1}>
				<Grid.Row>
					<Grid.Column>
						<Search
                            placeholder='Add Member'
                            loading={isSearchLoading}
                            results={searchResults}
                            input={{ fluid: true }}
                            value={searchValue}
                            fluid
                            resultRenderer={searchResultRenderer}
                            onSearchChange={handleSearch}
                            onResultSelect={addMember} />
					</Grid.Column>
				</Grid.Row>
			</Grid>

            <Grid centered columns={3}>
                <Grid.Row>
					<Grid.Column>
						<Input label='Team Size' type='number' input={{fluid: true}} fluid min={1} max={10} step={1} defaultValue={5} onChange={updateTeamSize} />
					</Grid.Column>
					<Grid.Column>
						<Checkbox label='Auto draft' slider onChange={updateAutoDraft} />
					</Grid.Column>
					<Grid.Column>
						<Checkbox label='Auto balance' slider onChange={updateAutoBalance} />
					</Grid.Column>
                </Grid.Row>
				<Grid.Row>
					<Header as='h2' icon textAlign='center'>
						<Header.Content>{`Total Members: ${data.members.length}`}</Header.Content>
					</Header>
				</Grid.Row>
			</Grid>


			<Grid columns={3}>
				{data && data.members.length > 0 && data.members.map(member => (
					<Grid.Column key={member.id}>
						<Member canRemove onRemove={removeMember} {...member} />
					</Grid.Column>
				))}
            </Grid>
        </Container>
    )
}

CreateScrimPool.propTypes = {
    members: PropTypes.array,
    onUpdateContinueState: PropTypes.func
}
export default CreateScrimPool;
