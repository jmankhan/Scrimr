import React, { useContext, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
  Container,
  Dropdown,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Message,
  Search,
} from "semantic-ui-react";
import { NotificationManager } from "react-notifications";
import Member from "./Member";
import API from "../api";
import "./CreateScrimPool.css";
import useRankImages from "../hooks/useRankImage";
import { chunkMembers } from "../utils";
import {
  DEFAULT_SCRIM_MODE,
  SCRIM_MODE_OPTIONS,
  SCRIMREQUEST_STATUS,
  SOCKET_EVENTS,
} from "../utils/constants";
import JoinRequest from "./JoinRequest";
import { SocketContext } from "../contexts/Socket";
import useAuth from "../contexts/Auth";

const searchResultRenderer = ({ id, name, rank }) => {
  const [image, title] = useRankImages(rank);

  return (
    <div id={id} title={name} className="searchResult">
      {image && <img className="rankImage" src={image} title={title} />}
      {name} <kbd>Enter</kbd>
    </div>
  );
};

const CreateScrimPool = (props) => {
  const [data, setData] = useState({ ...props });
  const [searchResults, setSearchResults] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [message, setMessage] = useState();
  const [loadingMembers, setLoadingMembers] = useState([]);
  const auth = useAuth();
  const socket = useContext(SocketContext);
  const searchRef = useRef();

  useHotkeys("ctrl+k, command+k", () => {
    if (searchRef) {
      searchRef.current.focus();
    }
  });

  useEffect(() => {
    setData({
      ...data,
      id: props.scrimId,
      members: props.members,
      teamSize: props.teamSize,
      mode: props.mode,
    });
  }, [props]);

  /*
  useEffect(() => {
    const scrimId = props.scrimId;
    const userId = auth?.value.user.id;

    if (scrimId) {
      socket.on(scrimId, (data) => {
        if (data[SOCKET_EVENTS.GET_SCRIM]) {
          const payload = data[SOCKET_EVENTS.GET_SCRIM];
          setData(payload.scrim);
        }
      });
    }

    if (userId && scrimId) {
      socket.on(userId, async (response) => {
        if (response[SOCKET_EVENTS.JOIN_SCRIM]) {
          const payload = response[SOCKET_EVENTS.JOIN_SCRIM];
          NotificationManager.create({
            type: "add",
            title: null,
            timeOut: 60 * 1000,
            message: (
              <JoinRequest
                user={payload.request.user}
                onClick={async () => {
                  const summonerId = payload.request.user.summoner?.id;
                  const scrimId = props.scrimId;
                  const requestId = payload.request.id;
                  let newMember;
                  try {
                    newMember = await API.createMember(summonerId, scrimId);
                    setLoadingMembers([...loadingMembers, newMember.member.id]);
                    const scrimData = await API.getScrim(scrimId);
                    await API.updateScrimRequest(
                      requestId,
                      SCRIMREQUEST_STATUS.APPROVE
                    );

                    const newData = { ...scrimData, members: scrimData.pool };
                    setData(newData);
                    props.onChange(newData);
                  } catch (err) {
                    NotificationManager.error("Error", err.message, 5000);
                  } finally {
                    setLoadingMembers(
                      loadingMembers.filter(
                        (member) => member.id !== newMember.id
                      )
                    );
                  }
                }}
                onClose={async () => {
                  const requestId = payload.request.id;

                  try {
                    await API.updateScrimRequest(
                      requestId,
                      SCRIMREQUEST_STATUS.DENY
                    );
                    const scrimData = await API.getScrim(data.id);
                    const newData = { ...scrimData, members: scrimData.pool };
                    setData(newData);
                    props.onChange(newData);
                  } catch (err) {
                    NotificationManager.error("Error", err.message, 5000);
                  }
                }}
              />
            ),
          });
        }
      });
    }

    return () => {
      if (scrimId) {
        socket.off(scrimId);
      }
      if (userId) {
        socket.off(userId);
      }
    };
  }, [props.scrimId]);
  */
 
  const handleSearch = async (value) => {
    setSearchValue(value);
    if (value) {
      setIsSearchLoading(true);
      const result = await API.search(value);
      setSearchResults(
        result.results.map((r) => ({
          id: r.id,
          title: r.name,
          name: r.name,
          rank: r.rank,
        }))
      );
      setIsSearchLoading(false);
    }
  };

  const handleMessageClear = () => {
    setMessage(null);
  };

  const updateTeamSize = (e, eventData) => {
    const newData = {
      ...data,
      teamSize: +eventData.value,
    };
    setData(newData);

    props.onChange(newData);
  };

  const updateMode = (e, eventData) => {
    const newData = {
      ...data,
      mode: eventData.value,
    };

    props.onChange(newData);
  };

  const updateMember = async (id) => {
    const memberIndex = data.members.findIndex((m) => m.id === id);
    setLoadingMembers([...loadingMembers, id]);

    try {
      const updatedMemberResponse = await API.syncSummoner(
        id,
        data.members[memberIndex].summonerId
      );
      const newData = { ...data };
      newData.members[memberIndex] = updatedMemberResponse.member;
      setData(newData);
    } catch (err) {
      NotificationManager.error("Error", err.message);
    } finally {
      setLoadingMembers(loadingMembers.filter((loadingId) => loadingId !== id));
    }
  };

  const addMember = async (e, eventData) => {
    const resultId =
      eventData.as === "form"
        ? eventData.children[1].props.results[0].id
        : eventData.result.id;

    if (data.members.find((member) => member.id === resultId) != null) {
      NotificationManager.error(
        "Error",
        `${eventData.result.name} is already in the pool`
      );
      return;
    }

    setLoadingMembers([...loadingMembers, resultId]);
    const summoner = searchResults.find((result) => result.id === resultId);
    let memberResponse;
    try {
      const {
        member: { id },
      } = await API.createMember(summoner.id, props.scrimId);
      memberResponse = await API.getMember(id);
    } catch (err) {
      NotificationManager.error(err.message);
    } finally {
      setSearchValue("");
      setSearchResults([]);
      setIsSearchLoading(false);
      setLoadingMembers(
        loadingMembers.filter((loadingId) => loadingId !== resultId)
      );
    }

    const newData = {
      ...data,
      members: [...data.members, memberResponse.member],
    };

    setData(newData);
    props.onChange(newData);
  };

  const removeMember = async (id) => {
    const newData = {
      ...data,
      members: data.members.map((member) =>
        member.id === id ? { ...member, isLoading: true } : member
      ),
    };
    setData(newData);

    try {
      await API.deleteMember(id);
    } catch (err) {
      NotificationManager.error("Error", err.message);
    }

    newData.members = data.members.filter((member) => member.id !== id);
    setData({ ...newData });
    props.onChange(newData);
  };

  return (
    <div>
      <Container>
        <Grid columns={1}>
          <Grid.Row>
            <Grid.Column>
              <Form error={message} onSubmit={addMember}>
                <Message
                  error
                  floating
                  header="Error"
                  onDismiss={handleMessageClear}
                  content={message}
                />
                <Search
                  icon={
                    <Icon name="search">
                      <kbd className="searchHint">Cmd+K</kbd>
                    </Icon>
                  }
                  input={{ fluid: true, ref: searchRef }}
                  loading={isSearchLoading}
                  minCharacters={2}
                  placeholder="Add Member"
                  results={searchResults}
                  value={searchValue}
                  resultRenderer={searchResultRenderer}
                  onSearchChange={(e, d) => handleSearch(d.value)}
                  onResultSelect={addMember}
                />
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Grid centered columns={2}>
          <Grid.Row>
            <Grid.Column>
              <Input
                label="Team Size"
                type="number"
                input={{ fluid: "true" }}
                min={1}
                max={10}
                step={1}
                defaultValue={data?.teamSize || 5}
                onChange={updateTeamSize}
              />
            </Grid.Column>
            <Grid.Column>
              <Input
                fluid
                label="Mode"
                input={
                  <Dropdown
                    defaultValue={data.mode || DEFAULT_SCRIM_MODE}
                    onChange={updateMode}
                    options={SCRIM_MODE_OPTIONS}
                    selection
                    style={{
                      borderRadius: "0 4px 4px 0",
                    }}
                  />
                }
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Header as="h2" icon textAlign="center">
              <Header.Content>{`Total Members: ${
                data?.members.length ?? 0
              }`}</Header.Content>
            </Header>
          </Grid.Row>
        </Grid>
      </Container>
      <Grid columns={7} centered>
        {data &&
          data.members &&
          data.members.length > 0 &&
          chunkMembers(data.members, 5).map((row) => (
            <Grid.Row key={row.id}>
              {row.members.map((member) => (
                <Grid.Column key={member.id}>
                  <Member
                    canRemove
                    canUpdate
                    isLoading={loadingMembers.indexOf(member.id) !== -1}
                    onRemove={removeMember}
                    onUpdate={updateMember}
                    {...member}
                  />
                </Grid.Column>
              ))}
            </Grid.Row>
          ))}
        {data &&
          data.members &&
          loadingMembers
            .filter(
              (loadingId) =>
                !data.members.includes((member) => member.id === loadingId)
            )
            .map((loadingId) => (
              <Grid.Column key={loadingId}>
                <Member isLoading />
              </Grid.Column>
            ))}
      </Grid>
    </div>
  );
};

export default CreateScrimPool;
