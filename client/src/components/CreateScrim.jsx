import React, { useEffect, useState } from "react";
import { Button, Icon, Loader, Menu, Step } from "semantic-ui-react";
import { NotificationManager } from "react-notifications";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import CreateScrimPool from "./CreateScrimPool";
import CreateScrimSelectCaptains from "./CreateScrimSelectCaptains";
import CreateScrimPrizeWheel from "./CreateScrimPrizeWheel";
import CreateScrimDraft from "./CreateScrimDraft";
import CreateScrimPlay from "./CreateScrimPlay";

const steps = [
  {
    name: "pool",
    title: "Pool",
    description: "Add candidate players",
    icon: "list ul",
    order: 1,
  },
  {
    name: "select-captains",
    title: "Select Captains",
    description: "Choose who leads",
    icon: "star outline",
    order: 2,
  },
  {
    name: "prize-wheel",
    title: "Prize Wheel",
    description: "Pray to the RNG gods",
    icon: "compass outline",
    order: 3,
  },
  {
    name: "draft",
    title: "Draft",
    description: "Cull the weak",
    icon: "user outline",
    order: 4,
  },
  {
    name: "play",
    title: "Play",
    description: "Start playing!",
    icon: "gamepad",
    order: 5,
  },
];

const CreateScrim = () => {
  const [data, setData] = useState();
  const [canContinue, setCanContinue] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const createScrim = async () => {
      setLoading(true);
      const scrim = await API.createScrim();
      setData(scrim);
      navigate("" + scrim.id);
    };

    const getScrim = async (id) => {
      setLoading(true);
      const scrim = await API.getScrim(id);
      setData(scrim);
    };

    try {
      if (!id) {
        createScrim();
      } else if (id) {
        getScrim(id);
      }
    } catch (err) {
      NotificationManager.error("Error", err.response.data.error, 5000);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleContinue = async () => {
    let stepIndex = steps.findIndex((step) => step.name === data.step);
    let step;

    if (stepIndex === 0 && data.autoDraft) {
      step = "play";
    } else {
      step = steps[stepIndex + 1].name;
    }

    try {
      setLoading(true);
      await API.updateScrim({ ...data, step });
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

  const updatePoolData = ({ members, teamSize, autoDraft, autoBalance }) => {
    const newData = {
      ...data,
      pool: [...members],
      teamSize,
      autoDraft,
      autoBalance,
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
      const response = await API.createTeams(teams);
      newData.teams = response.teams;
    } catch (err) {
      NotificationManager.error("Error", err.response.data.error, 5000);
    }

    setData(newData);
    setCanContinue(members.filter((member) => member.isCaptain).length >= 2);
  };

  const updatePrizewheel = ({ draftOrder }) => {
    const newData = {
      ...data,
      draftOrder,
    };

    newData.teams = draftOrder.map((id) =>
      newData.teams.find((t) => t.members[0].id === id)
    );
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

  const handleError = (message) => {
    NotificationManager.error(null, message, 5000);
  };

  return (
    <div>
      {loading && <Loader />}
      {!loading && data && (
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
              autoDraft={data.autoDraft}
              autoBalance={data.autoBalance}
              onError={handleError}
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
