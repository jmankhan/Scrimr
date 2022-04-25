import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Grid, Header, Icon, Segment } from 'semantic-ui-react';

const Member = (props) => {
    return (
        <Segment>
            <Grid columns={2} verticalAlign='middle'>
                <Grid.Row>
                    <Grid.Column textAlign='left'>
                        <Header>{props.name}</Header>
                    </Grid.Column>
                    <Grid.Column textAlign='right'>
                        <Button icon onClick={() => props.onRemove(props.id)}>
                            <Icon name='close' />
                        </Button>
                    </Grid.Column>
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
};

Member.defaultProps = {
    canRemove: false,
};

export default Member;