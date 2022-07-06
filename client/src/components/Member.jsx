import React from "react";
import {
  Button,
  Grid,
  Header,
  Image,
  Placeholder,
  Segment,
} from "semantic-ui-react";
import useRankImages from "../hooks/useRankImage";

const Member = (props) => {
  const [imageSrc, title] = useRankImages(props.summoner?.rank);
  return (
    <Segment>
      <Grid verticalAlign="middle" columns="equal">
        <Grid.Row
          onClick={() => props.onSelect && props.onSelect(props.id)}
          style={{ border: props.isSelected ? "1px solid black" : "" }}
        >
          <Grid.Column textAlign="left">
            {props.isLoading && (
              <Placeholder>
                <Placeholder.Header>
                  <Placeholder.Line /> <Placeholder.Line />
                </Placeholder.Header>
              </Placeholder>
            )}
            {!props.isLoading && (
              <>
                <Header style={{ whiteSpace: "nowrap" }}>
                  {imageSrc && (
                    <Image src={imageSrc} alt={title} title={title} />
                  )}
                  {props.summoner.name}{" "}
                </Header>
                {props.summoner.roles && props.summoner.roles.join(",")}
              </>
            )}
          </Grid.Column>
          <Grid.Column textAlign="right">
            {props.canUpdate && (
              <Button
                icon="refresh"
                primary
                onClick={() => props.onUpdate(props.id)}
              />
            )}
            {props.canRemove && (
              <Button
                icon="close"
                negative
                onClick={() => props.onRemove(props.id)}
              />
            )}
            {props.canAdd && (
              <Button
                icon="plus"
                primary
                onClick={() => props.onAdd(props.id)}
              />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default Member;
