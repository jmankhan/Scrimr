import React from "react";
import {
  Button,
  Grid,
  Header,
  Image,
  Placeholder,
  Segment,
} from "semantic-ui-react";

const importAll = (require) =>
  require.keys().reduce((acc, next) => {
    acc[next.replace("./", "")] = require(next);
    return acc;
  }, {});

const images = importAll(
  require.context("../assets/rank_emblems", false, /\.(png|jpe?g|svg)$/)
);
const tierMap = {
  0: "IRON",
  4: "BRONZE",
  8: "SILVER",
  12: "GOLD",
  16: "PLATINUM",
  20: "DIAMOND",
  24: "MASTER",
  28: "GRANDMASTER",
  32: "CHALLENGER",
};

const divisionMap = {
  0: "IV",
  1: "III",
  2: "II",
  3: "I",
};

const Member = (props) => {
  let imageKey, tier, division;

  if (props.summoner && props.summoner.rank) {
    if (props.summoner.rank < 0) {
      imageKey = "-1.png";
    } else {
      tier = props.summoner.rank - (props.summoner.rank % 4);
      division = props.summoner.rank % 4;
      imageKey = `0${Math.floor(props.summoner.rank / 4)}.png`;
    }
  }

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
                  {imageKey && (
                    <Image
                      src={images[imageKey]}
                      alt={tierMap[tier] + " " + divisionMap[division]}
                      title={tierMap[tier] + " " + divisionMap[division]}
                    />
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
