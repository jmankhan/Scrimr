import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Grid, Header, List, Search } from 'semantic-ui-react';
import Member from './Member';
import api from '../api';

const searchResultRenderer = ({ id, name, title }) => {
    return (id && name && <p id={id} title={title}>{name}</p>);
}

const CreateScrimPool = (props) => {
    const initialState = {
        id: 0,
        name: 'Pool 0',
        members: props.members
    }
    
    const [data, setData] = useState(initialState);
    const [searchResults, setSearchResults] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [isSearchLoading, setIsSearchLoading] = useState(false);

    const handleSearch = async (e, { value }) => {
        if(value) {
            setIsSearchLoading(true);
            const results = await api.search(value);
            setSearchResults(results);
            setIsSearchLoading(false);
        }
        setSearchValue(value);
    }

    const addMember = (e, eventData) => {
        const newData = {
            ...data,
            members: [...data.members, searchResults.find(result => result.id === eventData.result.id)], 
        };

        setSearchValue('');
        setData(newData)
        props.onChange(newData.members);
    }

    const removeMember = (id) => {
        const newData = {
            ...data,
            members: data.members.filter(member => member.id !== id),
        };
        setData(newData.members);

        props.onChange(newData.members);
    }

    return (
        <Container>
            <Grid centered columns={1}>
                <Grid.Row stretched>
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

                <Grid.Row style={{ height: '40%'}}>
                    <Grid.Column>
                        <Header as='h2' icon textAlign='center'>
                            <Header.Content>{`Total Members: ${data.members.length}`}</Header.Content>
                        </Header>
                        <List>
                            {data && data.members.length > 0 && data.members.map(member => {
                                return (
                                    <List.Item key={member.id}>
                                        <Member canRemove onRemove={removeMember} {...member} />
                                    </List.Item>
                                )
                            })}
                        </List>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    )
}

CreateScrimPool.propTypes = {
    members: PropTypes.array,
    onUpdateContinueState: PropTypes.func
}
export default CreateScrimPool;