import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Dimmer, Grid, Header, Icon, Placeholder, Segment } from 'semantic-ui-react';

const Member = (props) => {
    return (
        <Segment>
            <Grid verticalAlign='middle' columns='equal'>
                <Grid.Row onClick={() => props.onSelect(props.id)} style={{ border: props.isSelected ? '1px solid black': '' }}>
                  <Grid.Column textAlign='left'>
                    {props.isLoading && <Placeholder><Placeholder.Header><Placeholder.Line /> <Placeholder.Line /></Placeholder.Header></Placeholder>}
                    {!props.isLoading &&
                      <>
                      <Header style={{ whiteSpace: 'nowrap' }}>
                        {props.summoner.name} ({props.summoner.rank})
                      </Header>
                      {props.summoner.roles && props.summoner.roles.join(',')}
                      </>
                    }
                  </Grid.Column>
                  <Grid.Column textAlign='right'>
                      {props.canUpdate && <Button icon='refresh' primary onClick={() => props.onUpdate(props.id)} />}
                      {props.canRemove && <Button icon='close' negative onClick={() => props.onRemove(props.id)} />}
                      {props.canAdd && <Button icon='plus' primary onClick={() => props.onAdd(props.id)} />}
                  </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    )
}

Member.propTypes = {
    id: PropTypes.number,
    summoner: PropTypes.object,
    isLoading: PropTypes.bool,
    canRemove: PropTypes.bool,
    onRemove: PropTypes.func,
    canUpdate: PropTypes.bool,
    onUpdate: PropTypes.func,
    isCaptain: PropTypes.bool,
    onSelect: PropTypes.func,
};

Member.defaultProps = {
    canRemove: false,
};

export default Member;
