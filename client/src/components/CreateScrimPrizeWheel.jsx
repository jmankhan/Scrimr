//https://stackoverflow.com/questions/33850201/how-to-draw-a-wheel-of-fortune
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useReward } from "react-rewards";
import { Grid, Header, List } from "semantic-ui-react";
import "./CreateScrimPrizeWheel.css";
import Member from "./Member";

const PrizeWheel = ({ disabled, sectors, onWinner }) => {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const spinRef = useRef(null);
  let isSpinning = useRef(false);
  let isAccelerating = useRef(false);
  const TAU = 2 * Math.PI;
  const arc = TAU / sectors.length;
  const friction = 0.991; // 0.995=soft, 0.99=mid, 0.98=hard
  const angVelMin = 0.002; // Below that number will be treated as a stop
  let angVelMax = 0; // Random ang.vel. to acceletare to
  let angVel = 0; // Current angular velocity
  let ang = 0; // Angle rotation in radians
  let elSpin;
  let ctx;
  let rad;

  const { reward } = useReward("confettiReward", "confetti");
  const getIndex = () =>
    Math.floor(numSectors - (ang / TAU) * numSectors) % numSectors;

  const getCurrentSector = (sectors) => {
    const numSectors = sectors.length;
    const index =
      Math.floor(numSectors - (ang / TAU) * numSectors) % numSectors;
    return sectors[index];
  };

  const drawSector = (sector, i) => {
    const ang = arc * i;
    ctx.save();
    // COLOR
    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.fillStyle = sector.color;
    ctx.moveTo(rad, rad);
    ctx.arc(rad, rad, rad, ang, ang + arc);
    ctx.lineTo(rad, rad);
    ctx.fill();
    ctx.stroke();
    // TEXT
    ctx.translate(rad, rad);
    ctx.rotate(ang + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 30px sans-serif";
    ctx.fillText(sector.label, rad - 10, 10);
    ctx.restore();
  };

  const rotate = () => {
    const sector = getCurrentSector(sectors);
    ctx.canvas.style.transform = `rotate(${ang - Math.PI / 2}rad)`;
    elSpin.textContent = disabled ? "DONE" : !angVel ? "SPIN" : sector.label;
    elSpin.style.background = sector.color;
  };

  const frame = () => {
    if (!isSpinning.current) return;
    if (angVel >= angVelMax) isAccelerating.current = false;

    if (isAccelerating.current) {
      angVel ||= angVelMin; // Initial velocity kick
      angVel *= 1.06; // Accelerate
    } else {
      angVel *= friction; // Decelerate by friction

      // SPIN END:
      if (angVel < angVelMin) {
        isSpinning.current = false;
        angVel = 0;
        reward();
        onWinner(getCurrentSector(sectors).id);
      }
    }

    ang += angVel; // Update angle
    ang %= TAU; // Normalize angle
    rotate();
  };

  const engine = () => {
    frame();
    requestRef.current = requestAnimationFrame(engine);
  };

  const handleSpin = () => {
    if (isSpinning.current || disabled) return;
    isSpinning.current = true;
    isAccelerating.current = true;
    angVelMax = Math.random() * (0.4 - 0.25) + 0.25;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    elSpin = spinRef.current;

    ctx = canvas.getContext("2d");
    rad = ctx.canvas.width / 2;

    if (sectors && sectors.length > 0) {
      sectors.forEach((sector, i) => drawSector(sector, i));
      rotate();
      engine();
    }
    if (disabled) {
      canvas.classList.add("done");
    }

    return () => {
      window.cancelAnimationFrame(requestRef.current);
    };
  }, [sectors, drawSector, rotate, engine]);

  return (
    <div id="wheelContainer">
      <canvas id="wheel" ref={canvasRef} width="500" height="500" />
      <span id="spin" ref={spinRef} onClick={handleSpin}>
        Spin
      </span>
      <span id="confettiReward" />
    </div>
  );
};

const CreateScrimPrizeWheel = (props) => {
  const colors = [
    "#445fa5",
    "#643529",
    "#293963",
    "#576429",
    "#CA9B8F",
    "#8F9FC9",
    "#BDCA8F",
    "#A65944",
    "#445FA5",
    "#91A644",
  ];

  const [winners, setWinners] = useState([]);
  const [captains, setCaptains] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const handleWinner = (winnerId) => {
    const newWinners = [...winners, winnerId];

    const remainingCaptains = captains.filter(
      (c) => newWinners.indexOf(c.id) === -1
    );
    if (remainingCaptains.length === 1) {
      newWinners.push(remainingCaptains[0].id);
      setDisabled(true);
      props.onChange({ draftOrder: newWinners });
    } else {
      setCaptains(remainingCaptains);
    }

    setWinners(newWinners);
  };

  useEffect(() => {
    if (props.draftOrder && props.draftOrder.length > 0) {
      setWinners(
        props.teams.map(
          (team) => team.members.find((member) => member.isCaptain).id
        )
      );

      const lastCaptain = [...props.teams]
        .sort((a, b) => (a.draftOrder < b.draftOrder ? 1 : -1))[0]
        .members.find((member) => member.isCaptain);
      setCaptains([
        {
          id: lastCaptain.id,
          label: lastCaptain.summoner.name,
          color: colors[colors.length - 1],
          member: lastCaptain,
        },
      ]);
    }
  }, [props.draftOrder]);

  useEffect(() => {
    const captains = props.members
      .filter((m) => m.isCaptain)
      .map((c, i) => ({
        id: c.id,
        label: c.summoner.name,
        color: colors[i % colors.length],
        member: c,
      }));

    setCaptains(captains);
  }, [props.members, props.teams]);

  return (
    <Grid container>
      <Grid.Row>
        <Grid.Column width={12}>
          <PrizeWheel
            disabled={disabled}
            sectors={captains}
            onWinner={handleWinner}
          />
        </Grid.Column>
        <Grid.Column width={4}>
          <Header as="h1" textAlign="left">
            Draft Order
          </Header>
          <List>
            {winners &&
              winners.map((winner) => (
                <List.Item key={winner}>
                  <Member
                    {...props.members.find((m) => m.id === winner)}
                    isCaptain
                  />
                </List.Item>
              ))}
          </List>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default CreateScrimPrizeWheel;
