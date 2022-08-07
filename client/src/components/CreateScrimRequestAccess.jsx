import React, { useContext, useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { Button, Container, Header } from "semantic-ui-react";
import API from "../api";
import { SocketContext } from "../contexts/Socket";
import { SCRIMREQUEST_STATUS, SOCKET_EVENTS } from "../utils";

const CreateScrimRequestAccess = (props) => {
  const [data, setData] = useState();
  const [user, setUser] = useState();
  const [hasDeniedRequests, setHasDeniedRequests] = useState(false);

  const socket = useContext(SocketContext);

  useEffect(() => {
    setData(props.data);
    setUser(props.user);
  }, [props.data, props.user]);

  useEffect(() => {
    const userId = props.user?.id;

    if (userId) {
      socket.on(userId, async (response) => {
        if (response[SOCKET_EVENTS.JOIN_SCRIM_APPROVE]) {
          const payload = response[SOCKET_EVENTS.JOIN_SCRIM_APPROVE];
          if (payload && payload.status === SCRIMREQUEST_STATUS.APPROVE) {
            const scrimData = await API.getScrim(id);
            const newData = { ...scrimData, members: scrimData.pool };
            setData(newData);
          } else if (payload && payload.status === SCRIMREQUEST_STATUS.DENY) {
            setHasDeniedRequests(true);
          }
        }
      });
    }
    return () => {
      if (userId) {
        socket.off(userId);
      }
    };
  }, [props.user]);

  const hasPendingRequests = () => {
    return (
      data &&
      data.requests &&
      data.requests.find(
        (request) =>
          request.userId === user.id &&
          request.status === SCRIMREQUEST_STATUS.PENDING
      )
    );
  };

  const handleRequestAccess = async () => {
    try {
      await API.createScrimRequestJoin(props.scrimId);
    } catch (err) {
      NotificationManager.error("Error", err.message, 5000);
    }
  };

  return (
    <Container style={{ marginTop: "3rem" }}>
      {hasPendingRequests() && !hasDeniedRequests && (
        <Header>Your request is pending.</Header>
      )}
      {!hasPendingRequests() && hasDeniedRequests && (
        <Header>Your request was denied.</Header>
      )}
      {!hasPendingRequests() && !hasDeniedRequests && (
        <>
          <Header>Ask the host for access?</Header>
          <Button
            primary
            content="Request Access"
            onClick={handleRequestAccess}
          />
        </>
      )}
    </Container>
  );
};

export default CreateScrimRequestAccess;
