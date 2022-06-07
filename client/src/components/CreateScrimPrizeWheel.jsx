//https://stackoverflow.com/questions/33850201/how-to-draw-a-wheel-of-fortune
import React, { useEffect, useRef } from 'react';
import { useReward } from 'react-rewards';
import './CreateScrimPrizeWheel.css';

const PrizeWheel = ({ sectors, onComplete }) => {
  const canvasRef = useRef(null);
  const spinRef = useRef(null);
  const numSectors = sectors.length;
  const TAU = 2 * Math.PI;
  const arc = TAU / sectors.length;
  const friction = 0.991;  // 0.995=soft, 0.99=mid, 0.98=hard
  const angVelMin = 0.002; // Below that number will be treated as a stop
  let angVelMax = 0; // Random ang.vel. to acceletare to
  let angVel = 0;    // Current angular velocity
  let ang = 0;       // Angle rotation in radians
  let isSpinning = false;
  let isAccelerating = false;
  let elSpin;
  let ctx;
  let rad;

  const { reward, isAnimating } = useReward('confettiReward', 'confetti');
  const rand = (min, max) => Math.random() * (max - min) + min;
  const getIndex = () => Math.floor(numSectors - ang / TAU * numSectors) % numSectors;

  const drawSector = (sector, i) => {
    const ang = arc * i;
    ctx.save();
    // COLOR
    ctx.beginPath();
    ctx.fillStyle = sector.color;
    ctx.moveTo(rad, rad);
    ctx.arc(rad, rad, rad, ang, ang + arc);
    ctx.lineTo(rad, rad);
    ctx.fill();
    // TEXT
    ctx.translate(rad, rad);
    ctx.rotate(ang + arc / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.font = "bold 30px sans-serif";
    ctx.fillText(sector.label, rad - 10, 10);
    ctx.restore();
  };

  const rotate = () => {
    const sector = sectors[getIndex()];
    ctx.canvas.style.transform = `rotate(${ang - Math.PI / 2}rad)`;
    elSpin.textContent = !angVel ? 'SPIN' : sector.label;
    elSpin.style.background = sector.color;
  };

  const frame = () => {
    if (!isSpinning) return;
    if (angVel >= angVelMax) isAccelerating = false;

    if (isAccelerating) {
      angVel ||= angVelMin; // Initial velocity kick
      angVel *= 1.06; // Accelerate
    } else {
      angVel *= friction; // Decelerate by friction

      // SPIN END:
      if (angVel < angVelMin) {
        isSpinning = false;
        angVel = 0;
        reward();
        onComplete(sectors[getIndex()].id);
      }
    }

    ang += angVel; // Update angle
    ang %= TAU;    // Normalize angle
    rotate();
  };

  const engine = () => {
    frame();
    requestAnimationFrame(engine)
  };

  const handleSpin = () => {
    if (isSpinning) return;
    isSpinning = true;
    isAccelerating = true;
    angVelMax = rand(0.25, 0.40);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    elSpin = spinRef.current;

    ctx = canvas.getContext('2d');
    rad = ctx.canvas.width / 2;

    sectors.forEach((sector, i) => drawSector(sector, i));
    rotate();
    engine();
  }, []);

  return (
    <div id="wheelContainer">
      <canvas id="wheel" ref={canvasRef} width="500" height="500" />
      <span id="spin" ref={spinRef} onClick={handleSpin}>Spin</span>
      <span id="confettiReward" />
    </div>
  )
}

const CreateScrimPrizeWheel = (props) => {
  const colors = ['#ff0000', '#00ff00', '#0000ff'];
  const captains = props.members.filter(m => m.isCaptain).map((c, i) => ({ id: c.id, label: c.summoner.name, color: colors[i%3] }));

  const handleDone = (captainId) => {
    let shuffled = captains
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)

    let i = 0;
    while(shuffled[i].id === captainId) {
      i++;
    }

    props.onChange({ draftFirst: captainId, sideFirst: shuffled[i].id });
  }

  return (
    <PrizeWheel sectors={captains} onComplete={handleDone} />
  )
};

export default CreateScrimPrizeWheel;
