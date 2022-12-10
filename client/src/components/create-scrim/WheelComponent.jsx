import React, { useEffect, useState } from 'react'
import { chakra } from '@chakra-ui/react';

const WheelComponent = ({
  segments,
  segColors,
  winningSegmentValue,
  onFinished,
  primaryColor,
  contrastColor,
  textColor = 'black',
  buttonText = 'Spin',
  canSpin = true,
  size = 290,
  width = 800,
  height = 800,
  upDuration = 100,
  downDuration = 1000,
  fontFamily = 'sans-serif'
}) => {

  let currentSegment = '';
  let isStarted = false;
  const [isFinished, setFinished] = useState(false);
  let timerHandle = 0;
  const timerDelay = segments.length;
  let angleCurrent = 0;
  let angleDelta = 0;
  let canvasContext = null;
  let maxSpeed = Math.PI / `${segments.length}`;
  const upTime = segments.length * upDuration;
  const downTime = segments.length * downDuration;
  let spinStart = 0;
  let frames = 0;
  const centerX = 300;
  const centerY = 300;

  useEffect(() => {
    wheelInit()
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 0);
  }, [segments]);
  
  const wheelInit = () => {
    initCanvas();
    wheelDraw();
  }

  const setCanvas = (canvas, width, height) => {
    const ratio = window.devicePixelRatio;

    canvas.style.width ='100%';
    canvas.style.height='100%';
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    canvas.getContext("2d").scale(ratio, ratio);

    return canvas;
  }

  const initCanvas = () => {
    let canvas = setCanvas(document.getElementById('canvas'), width, height);
    
    if (navigator.userAgent.indexOf('MSIE') !== -1) {
      canvas = document.createElement('canvas');
      canvas.setAttribute('width', window.devicePixelRatio * width);
      canvas.setAttribute('height', window.devicePixelRatio * height);
      canvas.setAttribute('id', 'canvas');
      document.getElementById('wheel').appendChild(canvas);
    }

    canvasContext = canvas.getContext('2d');
  }
  const spin = () => {
    isStarted = true;
    if (timerHandle === 0 && canSpin) {
      spinStart = new Date().getTime();
      // maxSpeed = Math.PI / ((segments.length*2) + Math.random())
      maxSpeed = Math.PI / segments.length;
      frames = 0;
      timerHandle = setInterval(onTimerTick, timerDelay);
    }
  }
  const onTimerTick = () => {
    frames++;
    draw();
    const duration = new Date().getTime() - spinStart;
    let progress = 0;
    let finished = false;
    if (duration < upTime) {
      progress = duration / upTime;
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2);
    } else {
      if (winningSegmentValue) {
        if (currentSegment.value === winningSegmentValue && frames > segments.length) {
          progress = duration / upTime;
          angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
          progress = 1;
        } else {
          progress = duration / downTime;
          angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
        }
      } else {
        progress = duration / downTime;
        angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
      }
      if (progress >= 1) finished = true;
    }

    angleCurrent += angleDelta;
    while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2;
    if (finished) {
      setFinished(true);
      onFinished(currentSegment.value);
      clearInterval(timerHandle);
      timerHandle = 0;
      angleDelta = 0;
    }
  }

  const wheelDraw = () => {
    clear();
    drawWheel();
    drawNeedle();
  }

  const draw = () => {
    clear();
    drawWheel();
    drawNeedle();
  }

  const drawSegment = (key, lastAngle, angle) => {
    const ctx = canvasContext;
    const segment = segments[key];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, size, lastAngle, angle, false);
    ctx.closePath();
    ctx.lineTo(centerX, centerY);
    ctx.fillStyle = segColors[key];
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((lastAngle + angle) / 2);
    ctx.fillStyle = textColor;
    ctx.font = '1em bold ' + fontFamily;
    ctx.fillText(segment.label.substr(0, 21), size / 2 + 20, 0);
    ctx.restore();
  }

  const drawWheel = () => {
    const ctx = canvasContext;
    let lastAngle = angleCurrent;
    const len = segments.length;
    const PI2 = Math.PI * 2;
    ctx.lineWidth = 1;
    ctx.strokeStyle = primaryColor;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = '1em ' + fontFamily;

    for (let i = 1; i <= len; i++) {
      const angle = PI2 * (i / len) + angleCurrent;
      drawSegment(i - 1, lastAngle, angle);
      lastAngle = angle;
    }

    // Draw a center circle
    let circleText = buttonText;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, PI2, false);
    ctx.closePath();
    ctx.fillStyle = contrastColor;
    ctx.lineWidth = 10;
    ctx.strokeStyle = primaryColor;
    ctx.fill();
    ctx.font = '1em bold ' + fontFamily;
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.fillText(circleText, centerX, centerY + 3);
    ctx.stroke()

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, size, 0, PI2, false);
    ctx.closePath();

    ctx.lineWidth = 10;
    ctx.strokeStyle = primaryColor;
    ctx.stroke();
  }

  const drawNeedle = () => {
    const ctx = canvasContext;
    ctx.lineWidth = 1;
    ctx.strokeStyle = contrastColor;
    ctx.fileStyle = contrastColor;
    ctx.beginPath();
    ctx.moveTo(centerX + 20, centerY - 50);
    ctx.lineTo(centerX - 20, centerY - 50);
    ctx.lineTo(centerX, centerY - 70);
    ctx.closePath();
    ctx.fill();
    const change = angleCurrent + Math.PI / 2;
    let i =
      segments.length -
      Math.floor((change / (Math.PI * 2)) * segments.length) -1;
    if (i < 0) i = i + segments.length;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = primaryColor;
    ctx.font = 'bold 2em ' + fontFamily;
    currentSegment = segments[i];
  }
  const clear = () => {
    const ctx = canvasContext
    ctx.clearRect(0, 0, 1000, 800)
  }
  return (
    <chakra.div display='flex' w='100%' h='100%' pointerEvents={canSpin ? 'auto' : 'none'} cursor={canSpin ? 'pointer' : null}>
      <canvas
        id='canvas'
        width='100%'
        height='100%'
        onClick={spin}
      />
    </chakra.div>
  )
}

export default WheelComponent