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
  const [ballPosition, setBallPosition] = useState({ x: 45, y: 150 });
  const [batRotation, setBatRotation] = useState(0);
  const [bowlerArmRotation, setBowlerArmRotation] = useState(0);

  // Animation frame for bowling, batting, and shot
  useEffect(() => {
    if (!isAnimating) {
      setBallPosition({ x: 45, y: 150 });
      setBatRotation(0);
      setBowlerArmRotation(0);
      return;
    }

    // Three-phase animation:
    // Phase 1 (0-30 frames): Bowling animation - ball travels from bowler to batsman
    // Phase 2 (31-50 frames): Batting animation - bat swings and makes contact
    // Phase 3 (51-120 frames): Shot animation - ball travels based on outcome
    let frame = 0;
    const animationInterval = setInterval(() => {
      frame++;
      
      // PHASE 1: BOWLING ANIMATION (Frames 0-30)
      // Bowler arm swing and ball delivery
      if (frame <= 30) {
        // Bowler arm swing: continuous rotation for realistic bowling motion
        const armProgress = (frame % 20) / 20;
        const armRotation = Math.sin(armProgress * Math.PI) * 90; // 0 to 90 degrees
        setBowlerArmRotation(armRotation);
        
        // Ball travels from bowler position to batsman
        // Bowler position: x=45, y=150
        // Batsman position: x=200, y=205
        const deliveryProgress = frame / 30; // 0 to 1 over 30 frames
        
        const startX = 45;
        const startY = 150;
        const endX = 200;
        const endY = 205;
        
        // Calculate horizontal position
        const x = startX + (endX - startX) * deliveryProgress;
        
        // Ball trajectory with pronounced arc for visibility
        // Rises up in the middle of flight for realistic bowling
        const arcHeight = Math.sin(deliveryProgress * Math.PI) * 80;
        const y = startY + (endY - startY) * deliveryProgress - arcHeight;
        
        setBallPosition({ x, y });
      }
      
      // PHASE 2: BATTING ANIMATION (Frames 31-50)
      // Batting animation: bat swings when ball arrives at batsman
      if (frame >= 31 && frame <= 50) {
        const swingProgress = (frame - 30) / 20; // 0 to 1 for smooth swing
        
        // Bat rotates from 0 to 45 degrees for natural batting motion
        setBatRotation(swingProgress * 45);
        
        // Ball stays at batsman position during batting
        setBallPosition({ x: 200, y: 205 });
        
        // Bowler arm returns to rest position
        setBowlerArmRotation(0);
      }

      // PHASE 3: SHOT ANIMATION (Frames 51-120)
      // Ball travels based on the outcome
      if (frame >= 51 && frame <= 120) {
        const shotProgress = (frame - 50) / 70; // 0 to 1 over 70 frames
        
        let endX = 200;
        let endY = 205;
        let arcHeight = 0;
        
        // Determine trajectory based on outcome
        if (lastResult === 'six') {
          // SIX: Ball goes high and far out of ground (top right)
          endX = 550; // Far right, out of bounds
          endY = -50; // High in the sky
          arcHeight = Math.sin(shotProgress * Math.PI) * 150; // High arc
        } else if (lastResult === 'four') {
          // FOUR: Ball travels along ground toward boundary
          endX = 520; // Right boundary
          endY = 280; // Ground level
          arcHeight = Math.sin(shotProgress * Math.PI) * 40; // Slight bounce
        } else if (lastResult === 'three') {
          // THREE: Ball goes towards mid-field
          endX = 380;
          endY = 150;
          arcHeight = Math.sin(shotProgress * Math.PI) * 50;
        } else if (lastResult === 'two') {
          // TWO: Ball goes towards mid-field
          endX = 350;
          endY = 120;
          arcHeight = Math.sin(shotProgress * Math.PI) * 40;
        } else if (lastResult === 'one') {
          // ONE: Ball goes towards short-field
          endX = 280;
          endY = 100;
          arcHeight = Math.sin(shotProgress * Math.PI) * 35;
        } else if (lastResult === 'zero' || lastResult === 'dot') {
          // DOT BALL: Ball stays near batsman or goes slow
          endX = 240;
          endY = 180;
          arcHeight = Math.sin(shotProgress * Math.PI) * 20;
        } else if (lastResult === 'wicket') {
          // WICKET: Ball hits stumps or goes up in air
          endX = 370; // Towards stumps
          endY = 180;
          arcHeight = Math.sin(shotProgress * Math.PI) * 60;
        }
        
        // Calculate ball position along the trajectory
        const startX = 200;
        const startY = 205;
        
        const x = startX + (endX - startX) * shotProgress;
        const y = startY + (endY - startY) * shotProgress - arcHeight;
        
        setBallPosition({ x, y });
      }
      
      // Animation complete - reset everything
      if (frame > 120) {
        clearInterval(animationInterval);
        // Reset positions for next shot
        setBallPosition({ x: 45, y: 150 });
        setBatRotation(0);
        setBowlerArmRotation(0);
      }
    }, 40); // 40ms interval = ~120 frames total = 4800ms animation

    return () => clearInterval(animationInterval);
  }, [isAnimating, lastResult]);

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

    // ===== BOWLER FIGURE (at bowling end) =====
    const bowlerX = 45;
    const bowlerY = 200;

    // Bowler body
    ctx.fillStyle = '#228B22';
    ctx.fillRect(bowlerX - 6, bowlerY - 8, 12, 18);

    // Bowler head
    ctx.fillStyle = '#FACF9A';
    ctx.beginPath();
    ctx.arc(bowlerX, bowlerY - 10, 5, 0, Math.PI * 2);
    ctx.fill();

    // Bowler legs
    ctx.strokeStyle = '#FACF9A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bowlerX, bowlerY + 10);
    ctx.lineTo(bowlerX - 4, bowlerY + 22);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bowlerX, bowlerY + 10);
    ctx.lineTo(bowlerX + 4, bowlerY + 22);
    ctx.stroke();

    // Bowler bowling arm (animated)
    ctx.save();
    ctx.translate(bowlerX, bowlerY - 5);
    ctx.rotate((bowlerArmRotation * Math.PI) / 180);
    
    // Bowling arm
    ctx.strokeStyle = '#FACF9A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(25, 0);
    ctx.stroke();

    // Hand at end of arm
    ctx.fillStyle = '#FACF9A';
    ctx.beginPath();
    ctx.arc(25, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Bowler non-bowling arm
    ctx.strokeStyle = '#FACF9A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bowlerX - 6, bowlerY - 5);
    ctx.lineTo(bowlerX - 15, bowlerY - 8);
    ctx.stroke();

    // ===== CRICKET PITCH =====
    // Pitch area with gradient
    ctx.fillStyle = '#C4A460';
    ctx.fillRect(120, 180, 260, 60);
    
    // Pitch shading
    ctx.fillStyle = 'rgba(139, 115, 85, 0.3)';
    ctx.fillRect(120, 180, 260, 30);

    // ===== BOUNDARY LINE =====
    // Removed boundary circles for cleaner view

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
  }, [ballPosition, batRotation, bowlerArmRotation, lastResult]);

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
    </div>
  );
}
