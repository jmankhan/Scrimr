import React, { useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Button, Checkbox, Container, Form, Grid, Header, Icon, Input, List, Message, Search } from 'semantic-ui-react';
import Member from './Member';
import API from '../api';
import './CreateScrimPool.css';

const searchResultRenderer = ({ id, name, isActive }) => {
	return (<p id={id} title={name}>{name} {isActive && <kbd style={{float: 'right'}}>Enter</kbd>}</p>);
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
	const [message, setMessage] = useState();
	const [loadingMembers, setLoadingMembers] = useState([]);
  const searchRef = useRef();

  useHotkeys('ctrl+k, command+k', () => {
    if(searchRef) {
      searchRef.current.focus();
    }
  });
	useEffect(() => {
		setData({
			...data,
			members: props.members,
			teamSize: props.teamSize,
			autoDraft: props.autoDraft,
			autoBalance: props.autoBalance
		})
	}, [props.pool, props.autoDraft, props.autoBalance]);

	const handleSearch = async (e, { value }) => {
		if(value) {
			setIsSearchLoading(true);
			const results = await API.search(value);
			setSearchResults(results.map((r, index) => ({ id: r.id, title: r.name, name: r.name, isActive: index === 0 })));
			setIsSearchLoading(false);
		}
		setSearchValue(value);
	}

	const handleMessageClear = () => {
		setMessage(null);
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

	const updateMember = async (id) => {
		const memberIndex = data.members.findIndex(m => m.id === id);
		setLoadingMembers([...loadingMembers, id]);

		try {
			const updatedMemberResponse = await API.syncSummoner(id, data.members[memberIndex].summonerId);
			const newData = {...data};
			newData.members[memberIndex] = updatedMemberResponse.member;
			setData(newData);
		} catch(err) {
			props.onError(err.response.data.error);
		} finally {
			setLoadingMembers(loadingMembers.filter(loadingId => loadingId !== id));
		}
	}

	const addMember = async (e, eventData) => {
    const resultId = eventData.as === 'form' ? eventData.children[1].props.results[0].id : eventData.result.id;

		if(data.members.find(member => member.id === resultId) != null) {
			props.onError(`${eventData.result.name} is already in the pool`);
			return;
		}

    setLoadingMembers([...loadingMembers, resultId]);
		const summoner = searchResults.find(result => result.id === resultId);
    let memberResponse;
		try {
			const {member: { id }} = await API.createMember(summoner.id, props.scrimId);
      memberResponse = await API.getMember(id);
		} catch(err) {
			props.onError(err.response.data.error);
		} finally {

      setSearchValue('');
      setSearchResults([]);
      setIsSearchLoading(false);
      setLoadingMembers(loadingMembers.filter(loadingId => loadingId !== resultId));
    }

		const newData = {
				...data,
				members: [...data.members, memberResponse.member],
		};

    setData(newData);
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

  const handleSearchSelection = (e, eventData) => {
    const activeResultIndex = searchResults.findIndex(result => result.id === eventData.value);
    const newSearchResults = [...searchResults];
    newSearchResults[activeResultIndex].isActive = true;
    setSearchResults(newSearchResults);
  }

	return (
		<Container>

			<Grid columns={1}>
				<Grid.Row>
					<Grid.Column>
            <Form error={message} onSubmit={addMember}>
              <Message
                error
                floating
                header='Error'
                onDismiss={handleMessageClear}
                content={message}
              />
              <Search
                icon={
                    <Icon name='search'>
                      <kbd class='searchHint'>Cmd + K</kbd>
                    </Icon>
                }
                input={{fluid: true, ref: searchRef}}
                loading={isSearchLoading}
                minCharacters={3}
                placeholder='Add Member'
                results={searchResults}
                selectFirstResult
                value={searchValue}
                resultRenderer={searchResultRenderer}
                onSearchChange={handleSearch}
                onSelectionChange={handleSearchSelection}
                onResultSelect={addMember} />
            </Form>
					</Grid.Column>
				</Grid.Row>
			</Grid>

			<Grid centered columns={3}>
				<Grid.Row>
					<Grid.Column>
						<Input
							label='Team Size'
							type='number'
							input={{fluid: 'true'}}
							min={1}
							max={10}
							step={1}
							defaultValue={data.teamSize || 5}
							onChange={updateTeamSize} />
					</Grid.Column>
					<Grid.Column>
						<Checkbox label='Auto draft' slider onChange={updateAutoDraft} defaultChecked={data.autoDraft} />
					</Grid.Column>
					<Grid.Column>
						<Checkbox label='Auto balance' slider onChange={updateAutoBalance} defaultChecked={data.autoBalance} />
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
						<Member
							canRemove
							canUpdate
							isLoading={loadingMembers.indexOf(member.id) !== -1}
							onRemove={removeMember}
							onUpdate={updateMember}
							{...member} />
					</Grid.Column>
				))}
        {data && data.members && loadingMembers.filter(loadingId => !data.members.includes(member => member.id === loadingId)).map(loadingId => (
          <Grid.Column key={loadingId}>
            <Member isLoading />
          </Grid.Column>
        ))}
			</Grid>
		</Container>
	)
}

export default CreateScrimPool;
