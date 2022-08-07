import React from "react";
import { Button, Grid, Icon } from "semantic-ui-react";

const JoinRequest = (props) => {
  return (
    <div>
      <Icon
        name="plus circle"
        size="huge"
        style={{ float: "left", textAlign: "center" }}
      />
      <Grid columns={1}>
        <Grid.Column>
          <p className="title">{props.user.summoner.name} is asking to join</p>
        </Grid.Column>
        <Grid.Column>
          <Button
            icon="checkmark"
            onClick={props.onClick}
            style={{ float: "left" }}
          />
          <Button icon="info" onClick={props.onInfo} />
          <Button
            icon="close"
            negative
            onClick={props.onClose}
            style={{ float: "right" }}
          />
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default JoinRequest;
