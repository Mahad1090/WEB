import React, { useEffect, useRef, useState } from 'react';
import './CricketGround.css';

/**
 * CricketGround Component
 * Renders the cricket field with batsman, ball, and animations
 *
 * Props:
 *   - isAnimating: Whether a shot animation is in progress
 *   - lastResult: Result of the last shot
 *   - battingStyle: Current batting style
 */
export default function CricketGround({ isAnimating, lastResult, battingStyle }) {
  const canvasRef = useRef(null);
  const [ballPosition, setBallPosition] = useState({ x: 150, y: 150 });
  const [batRotation, setBatRotation] = useState(0);

  // Animation frame for bowling
  useEffect(() => {
    if (!isAnimating) {
      setBallPosition({ x: 150, y: 150 });
      setBatRotation(0);
      return;
    }

    // Bowling animation: ball travels from bowler to batsman
    let frame = 0;
    const animationInterval = setInterval(() => {
      frame++;
      if (frame <= 20) {
        // Ball moves from left to right (delivery)
        setBallPosition({
          x: 150 + (frame * 15), // Move right
          y: 150 - (Math.sin((frame / 20) * Math.PI) * 50), // Arc motion
        });
      } else {
        // Batting animation: bat swings
        const swingFrame = frame - 20;
        if (swingFrame <= 10) {
          setBatRotation((swingFrame / 10) * 45); // Swing from 0 to 45 degrees
        } else {
          clearInterval(animationInterval);
        }
      }
    }, 50);

    return () => clearInterval(animationInterval);
  }, [isAnimating]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#90ee90';
    ctx.fillRect(0, 0, width, height);

    // Draw pitch (cricket)
    ctx.fillStyle = '#8b7355';
    ctx.fillRect(150, 180, 200, 40);

    // Draw creases
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(150, 200);
    ctx.lineTo(350, 200);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw stumps (wickets)
    const stumpX = 340;
    const stumpY = 185;
    ctx.fillStyle = '#ffffff';
    // Wickets
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(stumpX + i * 5, stumpY, 3, 30);
    }
    // Bails
    ctx.fillRect(stumpX - 2, stumpY - 5, 20, 3);

    // Draw batsman (stick figure)
    const batmanX = 180;
    const batmanY = 150;

    // Body
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(batmanX, batmanY, 8, 0, Math.PI * 2);
    ctx.stroke();

    // Legs
    ctx.beginPath();
    ctx.moveTo(batmanX, batmanY + 8);
    ctx.lineTo(batmanX - 5, batmanY + 20);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(batmanX, batmanY + 8);
    ctx.lineTo(batmanX + 5, batmanY + 20);
    ctx.stroke();

    // Arms
    ctx.beginPath();
    ctx.moveTo(batmanX, batmanY + 2);
    ctx.lineTo(batmanX - 8, batmanY - 5);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(batmanX + 5, batmanY + 2);
    ctx.lineTo(batmanX + 12, batmanY - 8);
    ctx.stroke();

    // Draw bat (rotating with swing)
    ctx.save();
    ctx.translate(batmanX + 12, batmanY - 8);
    ctx.rotate((batRotation * Math.PI) / 180);
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(0, -5, 40, 10);
    ctx.restore();

    // Draw ball
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(ballPosition.x, ballPosition.y, 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw seam on ball
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(ballPosition.x, ballPosition.y, 5, 0.2, Math.PI * 2 - 0.2);
    ctx.stroke();

    // Draw fielders (simplified)
    const fielders = [
      { x: 100, y: 80, name: 'Deep Square' },
      { x: 280, y: 80, name: 'Deep Cover' },
      { x: 60, y: 150, name: 'Fine Leg' },
      { x: 380, y: 150, name: 'Point' },
    ];

    fielders.forEach((fielder) => {
      // Draw fielder circle
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(fielder.x, fielder.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw result display
    if (lastResult) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';

      const resultTexts = {
        wicket: '💔 WICKET!',
        zero: '⭕ DOT BALL',
        one: '1️⃣ ONE RUN',
        two: '2️⃣ TWO RUNS',
        three: '3️⃣ THREE RUNS',
        four: '4️⃣ FOUR RUNS',
        six: '6️⃣ SIX RUNS',
      };

      ctx.fillText(resultTexts[lastResult] || 'PLAYING', width / 2, height / 2);
    }
  }, [ballPosition, batRotation, lastResult]);

  return (
    <div className="cricket-ground-container">
      <div className={`cricket-ground ${battingStyle.toLowerCase()}`}>
        <canvas
          ref={canvasRef}
          width={500}
          height={400}
          className="ground-canvas"
        />
      </div>
      <div className="ground-label">
        <span>🏏 Cricket Ground 🏏</span>
        {isAnimating && <span className="animation-indicator">Playing...</span>}
      </div>
    </div>
  );
}
