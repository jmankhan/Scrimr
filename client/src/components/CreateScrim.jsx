import React, { useContext, useEffect, useState } from "react";
import { Button, Icon, Loader, Menu, Step } from "semantic-ui-react";
import { NotificationManager } from "react-notifications";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import CreateScrimPool from "./CreateScrimPool";
import CreateScrimSelectCaptains from "./CreateScrimSelectCaptains";
import CreateScrimPrizeWheel from "./CreateScrimPrizeWheel";
import CreateScrimDraft from "./CreateScrimDraft";
import CreateScrimPlay from "./CreateScrimPlay";
import CreateScrimRequestAccess from "./CreateScrimRequestAccess";
import { defaultScrimMode, steps } from "../utils/constants";
import CreateScrimSpectator from "./CreateScrimSpectator";
import useAuth from "../contexts/Auth";
import { SocketContext } from "../contexts/Socket";

const CreateScrim = () => {
  const [data, setData] = useState();
  const [canContinue, setCanContinue] = useState(false);
  const [canRequestAccess, setCanRequestAccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const socket = useContext(SocketContext);
  const [isSocketConnected, setIsSocketConnected] = useState(socket.connected);

  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    const createScrim = async () => {
      setLoading(true);
      try {
        const scrim = await API.createScrim();
        setData(scrim);
        navigate("" + scrim.id);
      } catch (err) {
        NotificationManager.error("Error", err.response.data.error, 5000);
      }
    };

    const getScrim = async (id) => {
      setLoading(true);
      try {
        const scrim = await API.getScrim(id);
        setData(scrim);
      } catch (err) {
        if (err.response.status === 401) {
          setCanRequestAccess(true);
        } else {
          NotificationManager.error("Error", err.response.data.message, 5000);
        }
      }
    };

    try {
      if (!id) {
        createScrim();
      } else if (id) {
        getScrim(id);
      }
    } catch (err) {
      NotificationManager.error("Error", err.response.data.message, 5000);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleContinue = async () => {
    let stepIndex = steps.findIndex((step) => step.name === data.step);
    const skipToEnd = stepIndex === 0 && data.mode === defaultScrimMode;
    let step = steps[stepIndex + 1].name;

    try {
      setLoading(true);
      if (skipToEnd) {
        const result = await API.automateScrim(
          data.id,
          data.members,
          data.mode,
          data.teamSize
        );
        setData(result.scrim);
      } else {
        await API.updateScrim({ ...data, step });
      }
    } catch (err) {
      NotificationManager.error("Error", err.response.data.error, 5000);
    } finally {
      setLoading(false);
    }

    setData({
      ...data,
      step,
    });

    setCanContinue(false);
  };

  const handleBack = async () => {
    if (data.step !== "pool") {
      const stepIndex = steps.findIndex((step) => step.name === data.step);

      try {
        setLoading(true);
        await API.updateScrim({ ...data, step: steps[stepIndex - 1].name });
      } catch (err) {
        NotificationManager.error("Error", err.response.data.error, 5000);
      } finally {
        setLoading(false);
      }

      setData({
        ...data,
        step: steps[stepIndex - 1].name,
      });
      setCanContinue(true);
    }
  };

  const updatePoolData = ({ members, teamSize, mode }) => {
    const newData = {
      ...data,
      pool: [...members],
      teamSize,
      mode,
    };

    setData(newData);
    setCanContinue(members.length >= teamSize * 2);
  };

  const updateSelectCaptains = async (members) => {
    const newData = {
      ...data,
      pool: [...members],
    };

    try {
      await API.deleteTeamsForScrim(data.id);
      const teams = members
        .filter((m) => m.isCaptain)
        .map((captain) => ({
          name: `${captain.summoner.name}'s Team`,
          members: [captain],
          scrimId: data.id,
        }));
      const teamResponse = await API.createTeams(teams);
      newData.teams = teamResponse.teams;

      const memberResponse = await API.updateMembers(members);
      newData.pool = memberResponse.members;
    } catch (err) {
      NotificationManager.error("Error", err.response.data.error, 5000);
    }

    setData(newData);
    setCanContinue(members.filter((member) => member.isCaptain).length >= 2);
  };

  const updatePrizewheel = ({ draftOrder }) => {
    const newData = { ...data };

    newData.teams = draftOrder.map((id, i) => {
      const team = newData.teams.find((t) => t.members[0].id === id);
      return {
        ...team,
        draftOrder: i,
      };
    });
    setData(newData);
    setCanContinue(true);
  };

  const updateDraft = (teams) => {
    const newData = {
      ...data,
      teams,
    };

    setData(newData);
    setCanContinue(teams.length > 0);
  };

  const isSpectator = () => {
    return (
      data &&
      data.hostId !== auth.value.user.id &&
      data.pool.find((member) => member.summoner?.userId === auth.value.user.id)
    );
  };

  const isHost = () => {
    return data && data.hostId === auth.value.user.id;
  };

  return (
    <div>
      {loading && <Loader />}
      {!loading && canRequestAccess && (
        <CreateScrimRequestAccess
          data={data}
          scrimId={id}
          user={auth.value.user}
        />
      )}
      {!loading && data && isSpectator() && (
        <CreateScrimSpectator data={data} />
      )}
      {!loading && data && isHost() && (
        <div>
          <Step.Group widths={steps.length}>
            {steps.map((step) => (
              <Step key={step.name} active={step.name === data.step}>
                <Icon name={step.icon}></Icon>
                <Step.Content>
                  <Step.Title>{step.title}</Step.Title>
                  <Step.Description>{step.description}</Step.Description>
                </Step.Content>
              </Step>
            ))}
          </Step.Group>

          {data.step === "pool" && (
            <CreateScrimPool
              members={data.pool}
              scrimId={data.id}
              teamSize={data.teamSize}
              mode={data.mode}
              onChange={updatePoolData}
            />
          )}
          {data.step === "select-captains" && (
            <CreateScrimSelectCaptains
              members={data.pool}
              teamSize={data.teamSize}
              onChange={updateSelectCaptains}
            />
          )}
          {data.step === "prize-wheel" && (
            <CreateScrimPrizeWheel
              members={data.pool}
              draftOrder={data.draftOrder}
              onChange={updatePrizewheel}
            />
          )}
          {data.step === "draft" && (
            <CreateScrimDraft
              members={data.pool}
              teamSize={data.teamSize}
              teams={data.teams}
              draftOrder={data.draftOrder}
              onChange={updateDraft}
            />
          )}
          {data.step === "play" && (
            <CreateScrimPlay members={data.pool} teams={data.teams} {...data} />
          )}

          <Menu fixed="bottom" inverted>
            <Menu.Item position="left">
              <Button
                color="red"
                onClick={handleBack}
                disabled={data.step === "pool"}
              >
                Back
              </Button>
            </Menu.Item>
            <Menu.Item position="right">
              <Button primary onClick={handleContinue} disabled={!canContinue}>
                Continue
              </Button>
            </Menu.Item>
          </Menu>
        </div>
      )}
    </div>
  );
};

export default CreateScrim;
