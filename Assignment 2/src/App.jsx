import React, { useState, useEffect } from 'react';
import './App.css';
import CricketGround from './components/CricketGround';
import Scoreboard from './components/Scoreboard';
import PowerBar from './components/PowerBar';
import GameStatus from './components/GameStatus';

/**
 * Main App Component - Single Page Cricket Game
 * Features: Choose batting style before each ball, dynamic power bar updates
 * 
 * Game Flow:
 * 1. Show style selector modal → 2. Show power bar → 3. Play animation → 4. Update results → Repeat
 */
export default function App() {
  // Game state
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [balls, setBalls] = useState(0);
  const [battingStyle, setBattingStyle] = useState('Aggressive');
  const [sliderPosition, setSliderPosition] = useState(0);
  const [lastResult, setLastResult] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [commentary, setCommentary] = useState('');

  // Game constants
  const TOTAL_BALLS = 12; // 2 overs
  const MAX_WICKETS = 2;
  const OVERS = Math.floor(balls / 6);
  const REMAINING_BALLS = balls % 6;
  const gameOver = balls >= TOTAL_BALLS || wickets >= MAX_WICKETS;

  // Probability distributions
  const probabilities = {
    Aggressive: {
      wicket: 0.40,
      zero: 0.10,
      one: 0.10,
      two: 0.10,
      three: 0.05,
      four: 0.10,
      six: 0.15,
    },
    Defensive: {
      wicket: 0.15,
      zero: 0.20,
      one: 0.25,
      two: 0.20,
      three: 0.10,
      four: 0.08,
      six: 0.02,
    },
  };

  // Commentary
  const commentaryLines = {
    wicket: [
      'Oh no! That\'s a wicket!',
      'Bold attempt but it didn\'t come off. Wicket!',
      'The bowler strikes!',
    ],
    zero: [
      'A dot ball! No runs.',
      'Blocked solidly but no runs.',
      'Good defense, but no runs.',
    ],
    one: [
      'A single run!',
      'One run scored.',
      'Nicely picked single.',
    ],
    two: [
      'Two runs! Excellent running.',
      'Good placement for two.',
      'A well-coordinated two runs.',
    ],
    three: [
      'Three runs! Fantastic!',
      'A boundary-shy hit for three.',
      'Great execution for three.',
    ],
    four: [
      'That\'s a FOUR!',
      'FOUR to the boundary!',
      'Brilliant stroke! FOUR!',
    ],
    six: [
      'SIX! Over the boundary!',
      'SIXED! Out of the ground!',
      'Pure power! SIX!',
    ],
  };

  /**
   * Calculate outcome based on slider position
   */
  const getOutcomeFromSliderPosition = (position) => {
    const probs = probabilities[battingStyle];
    let cumulative = 0;

    if (position < cumulative + probs.wicket) return { outcome: 'wicket', runs: 0 };
    cumulative += probs.wicket;

    if (position < cumulative + probs.zero) return { outcome: 'zero', runs: 0 };
    cumulative += probs.zero;

    if (position < cumulative + probs.one) return { outcome: 'one', runs: 1 };
    cumulative += probs.one;

    if (position < cumulative + probs.two) return { outcome: 'two', runs: 2 };
    cumulative += probs.two;

    if (position < cumulative + probs.three) return { outcome: 'three', runs: 3 };
    cumulative += probs.three;

    if (position < cumulative + probs.four) return { outcome: 'four', runs: 4 };
    cumulative += probs.four;

    if (position < cumulative + probs.six) return { outcome: 'six', runs: 6 };

    return { outcome: 'six', runs: 6 };
  };

  /**
   * Handle batting style selection - this triggers before each ball
   */
  const selectBattingStyle = (style) => {
    setBattingStyle(style);
    setShowStyleSelector(false);
    setSliderPosition(0);
  };

  /**
   * Handle play shot - get outcome from slider position
   */
  const handlePlayShot = () => {
    if (gameOver || isAnimating) return;

    setIsAnimating(true);
    const result = getOutcomeFromSliderPosition(sliderPosition);

    const commentaryIndex = Math.floor(
      Math.random() * commentaryLines[result.outcome].length
    );
    setCommentary(commentaryLines[result.outcome][commentaryIndex]);

    // Animation duration: 2000ms (50 frames * 40ms)
    // Phase 1: Bowling animation (30 frames = 1200ms)
    // Phase 2: Batting animation (20 frames = 800ms)
    setTimeout(() => {
      if (result.outcome === 'wicket') {
        setWickets((w) => w + 1);
      } else {
        setRuns((r) => r + result.runs);
      }

      setBalls((b) => b + 1);
      setLastResult(result.outcome);
      setIsAnimating(false);
    }, 2000);
  };

  /**
   * Restart game
   */
  const restartGame = () => {
    setRuns(0);
    setWickets(0);
    setBalls(0);
    setBattingStyle('Aggressive');
    setSliderPosition(0);
    setLastResult(null);
    setCommentary('');
  };

  /**
   * Toggle batting style
   */
  const toggleBattingStyle = () => {
    setBattingStyle((style) => (style === 'Aggressive' ? 'Defensive' : 'Aggressive'));
    setSliderPosition(0); // Reset slider when style changes
  };

  /**
   * Animate slider
   */
  useEffect(() => {
    if (isAnimating || gameOver) return;

    const interval = setInterval(() => {
      setSliderPosition((pos) => (pos + 0.01) % 1);
    }, 30);

    return () => clearInterval(interval);
  }, [isAnimating, gameOver]);

  return (
    <div className="app-container game-active">
      <header className="app-header">
        <h1 className="game-title">Cricket Batting Game</h1>
      </header>

      <div className="game-layout">
        {/* Left Panel: Cricket Ground and Controls */}
        <div className="left-panel">
          <CricketGround
            isAnimating={isAnimating}
            lastResult={lastResult}
            battingStyle={battingStyle}
          />

          <PowerBar
            sliderPosition={sliderPosition}
            battingStyle={battingStyle}
            probabilities={probabilities[battingStyle]}
            onPlayShot={handlePlayShot}
            isDisabled={isAnimating}
          />

          {/* Game Controls */}
          <div className="game-controls">
            <button
              className="play-btn"
              onClick={handlePlayShot}
              disabled={isAnimating || gameOver}
            >
              {isAnimating ? 'Playing...' : 'PLAY SHOT'}
            </button>

            {gameOver && (
              <button className="restart-btn" onClick={restartGame}>
                New Game
              </button>
            )}
          </div>
        </div>

        {/* Right Panel: Scoreboard and Game Status */}
        <div className="right-panel">
          <Scoreboard
            runs={runs}
            wickets={wickets}
            overs={OVERS}
            balls={REMAINING_BALLS}
            battingStyle={battingStyle}
            totalBalls={TOTAL_BALLS}
          />

          <GameStatus lastResult={lastResult} commentary={commentary} />

          {/* Batting Style Toggle */}
          <div className="batting-style-toggle">
            <button
              className={`toggle-btn aggressive-btn ${battingStyle === 'Aggressive' ? 'active' : ''}`}
              onClick={toggleBattingStyle}
              disabled={isAnimating}
            >
              <span className="toggle-icon">⚡</span>
              <span className="toggle-label">Aggressive</span>
            </button>
            <button
              className={`toggle-btn defensive-btn ${battingStyle === 'Defensive' ? 'active' : ''}`}
              onClick={toggleBattingStyle}
              disabled={isAnimating}
            >
              <span className="toggle-icon">🛡️</span>
              <span className="toggle-label">Defensive</span>
            </button>
          </div>
        </div>
      </div>

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-card">
            <h2>{balls >= TOTAL_BALLS ? 'Match Complete!' : 'All Out!'}</h2>
            <div className="final-results">
              <p><strong>Final Score:</strong> {runs} runs</p>
              <p><strong>Wickets:</strong> {wickets}/{MAX_WICKETS}</p>
              <p><strong>Balls Faced:</strong> {balls}/12</p>
            </div>
            <button className="restart-btn" onClick={restartGame}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
