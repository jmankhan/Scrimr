import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Icon, List, Loader } from 'semantic-ui-react';

const Pool = (props) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setData(api.getPool(props.id));
        setIsLoading(false);
    }, [props.id]);

    return (
        <>
            {isLoading && <Loader />}
            {!isLoading && data &&
                <Grid columns={3}>
                    <Grid.Column width={6}>
                            <Header as='h2' icon textAlign='center'>
                                <Icon name='users' circular />
                                <Header.Content>{data.name}</Header.Content>
                            </Header>
                            <List>
                                {data && data.members && data.members.map(member => {
                                    return <List.Item key={member.id}>{member.name}</List.Item>
                                })}
                            </List>                            
                    </Grid.Column>
                </Grid>
            }
            {!isLoading && !data && <p>No data.</p>}
        </>
    )
}

Pool.PropTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
    created: PropTypes.instanceOf(Date),
    members: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number, name: PropTypes.string }))
}

export default Pool;