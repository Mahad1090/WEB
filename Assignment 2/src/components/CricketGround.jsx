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

    // ===== STADIUM BACKGROUND =====
    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.4);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height * 0.4);

    // Crowd/Stadium area
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, height * 0.2, width, height * 0.2);
    
    // Crowd pattern
    ctx.fillStyle = '#ff6b6b';
    for (let i = 0; i < width; i += 15) {
      for (let j = 0; j < height * 0.2; j += 10) {
        ctx.fillRect(i, height * 0.2 + j, 8, 8);
      }
    }

    // Stadium structure
    ctx.fillStyle = '#DAA520';
    ctx.fillRect(0, height * 0.35, width, height * 0.1);

    // Field boundaries (outfield)
    const grassGradient = ctx.createLinearGradient(0, height * 0.4, 0, height);
    grassGradient.addColorStop(0, '#228B22');
    grassGradient.addColorStop(1, '#1a7a1a');
    ctx.fillStyle = grassGradient;
    ctx.fillRect(0, height * 0.4, width, height * 0.6);

    // ===== CRICKET PITCH =====
    // Pitch area with gradient
    ctx.fillStyle = '#C4A460';
    ctx.fillRect(120, 180, 260, 60);
    
    // Pitch shading
    ctx.fillStyle = 'rgba(139, 115, 85, 0.3)';
    ctx.fillRect(120, 180, 260, 30);

    // ===== BOUNDARY LINE =====
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.ellipse(250, 250, 180, 120, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Inner circle
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.ellipse(250, 250, 100, 60, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // ===== POPPING CREASE & CREASES =====
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
    ctx.beginPath();
    ctx.moveTo(120, 210);
    ctx.lineTo(380, 210);
    ctx.stroke();
    ctx.setLineDash([]);

    // Return crease lines
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(120, 180);
    ctx.lineTo(120, 240);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(380, 180);
    ctx.lineTo(380, 240);
    ctx.stroke();

    // ===== STUMPS (WICKETS) - BATSMAN'S END =====
    const stumpX = 370;
    const stumpY = 190;
    
    // Stump posts (white stumps)
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 3;
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(stumpX - 8 + i * 8, stumpY, 4, 35);
    }
    // Bails (horizontal bar)
    ctx.fillRect(stumpX - 10, stumpY - 6, 22, 3);
    ctx.shadowColor = 'transparent';

    // ===== BATSMAN FIGURE (Enhanced) =====
    const batmanX = 200;
    const batmanY = 200;

    // Batsman jersey (green)
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.ellipse(batmanX, batmanY - 8, 12, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head (flesh colored)
    ctx.fillStyle = '#FACF9A';
    ctx.beginPath();
    ctx.arc(batmanX, batmanY - 22, 6, 0, Math.PI * 2);
    ctx.fill();

    // Helmet visor
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.ellipse(batmanX, batmanY - 22, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Arms
    ctx.strokeStyle = '#FACF9A';
    ctx.lineWidth = 4;
    // Left arm
    ctx.beginPath();
    ctx.moveTo(batmanX - 10, batmanY - 5);
    ctx.quadraticCurveTo(batmanX - 20, batmanY + 5, batmanX - 22, batmanY + 15);
    ctx.stroke();
    // Right arm
    ctx.beginPath();
    ctx.moveTo(batmanX + 10, batmanY - 5);
    ctx.quadraticCurveTo(batmanX + 20, batmanY + 5, batmanX + 22, batmanY + 15);
    ctx.stroke();

    // Pads & Legs
    ctx.fillStyle = '#FFFFFF';
    // Left leg with pad
    ctx.fillRect(batmanX - 6, batmanY + 5, 4, 20);
    // Right leg with pad
    ctx.fillRect(batmanX + 2, batmanY + 5, 4, 20);

    // Gloves
    ctx.fillStyle = '#FACF9A';
    ctx.fillRect(batmanX - 23, batmanY + 13, 4, 4);
    ctx.fillRect(batmanX + 19, batmanY + 13, 4, 4);

    // ===== BAT (Rotating with swing) =====
    ctx.save();
    ctx.translate(batmanX - 18, batmanY + 15);
    ctx.rotate((batRotation * Math.PI) / 180);
    
    // Bat shape - more detailed
    ctx.fillStyle = '#2C1810';
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(50, -6);
    ctx.lineTo(52, 0);
    ctx.lineTo(50, 6);
    ctx.lineTo(0, 8);
    ctx.lineTo(-2, 0);
    ctx.closePath();
    ctx.fill();

    // Bat edge
    ctx.strokeStyle = '#1a0f0a';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.restore();

    // ===== BALL (Cricket ball with seam) =====
    ctx.fillStyle = '#CD5C5C';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.arc(ballPosition.x, ballPosition.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // Ball seam (quarter seam pattern)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(ballPosition.x, ballPosition.y, 6, 0.3, Math.PI - 0.3);
    ctx.stroke();

    // Ball reflection
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(ballPosition.x - 2, ballPosition.y - 2, 2, 0, Math.PI * 2);
    ctx.fill();

    // ===== FIELDERS =====
    const fielders = [
      { x: 100, y: 90, name: 'Square Leg' },
      { x: 350, y: 100, name: 'Point' },
      { x: 120, y: 150, name: 'Fine Leg' },
      { x: 380, y: 160, name: 'Slip' },
    ];

    fielders.forEach((fielder) => {
      // Fielder body
      ctx.fillStyle = '#228B22';
      ctx.fillRect(fielder.x - 5, fielder.y - 8, 10, 12);
      // Fielder head
      ctx.fillStyle = '#FACF9A';
      ctx.beginPath();
      ctx.arc(fielder.x, fielder.y - 10, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // ===== RESULT DISPLAY OVERLAY =====
    if (lastResult) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(0, 0, width, height);

      // Result box background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillRect(width / 2 - 120, height / 2 - 60, 240, 120);
      ctx.strokeStyle = '#667eea';
      ctx.lineWidth = 3;
      ctx.strokeRect(width / 2 - 120, height / 2 - 60, 240, 120);

      ctx.fillStyle = '#333333';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

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
          width={600}
          height={450}
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
