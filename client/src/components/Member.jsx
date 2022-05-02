import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Grid, Header, Icon, Segment } from 'semantic-ui-react';

const Member = (props) => {
    return (
        <Segment>
            <Grid columns={2} verticalAlign='middle'>
                <Grid.Row>
                    <Grid.Column textAlign='left'>
                        <Header>
                            {props.canStar &&
                                <Button basic icon={props.isStarred ? 'star' : 'star outline'}
                                        color='yellow'
                                        style={{boxShadow: '0 !important'}}
                                        onClick={() => props.onStar(props.id)} />
                            }
                            {props.name} ({props.rank})
                        </Header>
                        {props.roles && props.roles.join(',')}
                    </Grid.Column>
                    {props.canRemove &&
                        <Grid.Column textAlign='right'>
                            <Button icon='close' onClick={() => props.onRemove(props.id)} />
                        </Grid.Column>
                    }
                </Grid.Row>
            </Grid>
        </Segment>
    )
}

Member.propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
    canRemove: PropTypes.bool,
    onRemove: PropTypes.func,
    canStar: PropTypes.bool,
    onStar: PropTypes.func,
    isStarred: PropTypes.bool,
};

Member.defaultProps = {
    canRemove: false,
};

export default Member;
