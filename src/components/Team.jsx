import React, { useEffect, useState } from 'react';
import { Grid, Header, Icon, List, Loader, Rail, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import api from '../api';

const Team = (props) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setData(api.getTeam(props.id));
        setIsLoading(false);
    }, [props.id]);

    return (
        <>
            {isLoading && <Loader />}
            {!isLoading && data &&
                <Grid centered columns={3}>
                    <Grid.Column>
                            <Header as='h2' icon textAlign='center'>
                                <Icon name='users' circular />
                                <Header.Content>{data.name}</Header.Content>
                            </Header>
                            <List>
                                {data && data.members && data.members.map(member => {
                                    return (
                                        <List.Item key={member.id}>
                                            <Segment>
                                                <Grid columns={2} stackable>
                                                    <Grid.Column>
                                                        {member.name}
                                                    </Grid.Column>
                                                    <Grid.Column textAlign='right'>
                                                        {member.rank}
                                                    </Grid.Column>
                                                </Grid>

                                            </Segment>
                                        </List.Item>)
                                })}
                            </List>                            
                    </Grid.Column>
                </Grid>
            }
            {!isLoading && !data && <p>No data.</p>}
        </>
    )
}

Team.propTypes = {
    id: PropTypes.number
}

export default Team;