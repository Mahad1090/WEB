import React, { useState, useEffect } from 'react';
import './App.css';
import CricketGround from './components/CricketGround';
import Scoreboard from './components/Scoreboard';
import BattingStyleSelector from './components/BattingStyleSelector';
import PowerBar from './components/PowerBar';
import GameStatus from './components/GameStatus';

/**
 * Main App Component
 * Manages overall game state and logic
 * 
 * Props: None
 * State:
 *   - runs: Total runs scored
 *   - wickets: Wickets lost
 *   - balls: Balls played
 *   - overs: Complete overs (fixed at 2)
 *   - battingStyle: Current batting style (Aggressive/Defensive)
 *   - gameActive: Game in progress flag
 *   - sliderPosition: Current power bar slider position (0-1)
 *   - lastResult: Result of last shot
 *   - history: Array of shot results
 */
export default function App() {
  // Game state management
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [balls, setBalls] = useState(0);
  const [battingStyle, setBattingStyle] = useState('Aggressive');
  const [gameActive, setGameActive] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [lastResult, setLastResult] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [commentary, setCommentary] = useState('');

  // Game constants
  const TOTAL_BALLS = 12; // 2 overs
  const MAX_WICKETS = 2;
  const OVERS = Math.floor(balls / 6);
  const REMAINING_BALLS = balls % 6;

  // Probability distributions for each batting style
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

  // Commentary statements for different outcomes
  const commentaryLines = {
    wicket: [
      'Oh no! That\'s a wicket! The batsman is out!',
      'Bold attempt but it didn\'t come off. Wicket lost!',
      'The bowler strikes! Another wicket down!',
    ],
    zero: [
      'A dot ball! No runs scored.',
      'Blocked solidly but no runs.',
      'Good defense, but no scoring opportunity.',
    ],
    one: [
      'A single run! Quick running between wickets.',
      'One run scored. Good batting.',
      'Nicely picked single.',
    ],
    two: [
      'Two runs! Excellent running.',
      'Good placement for an easy two.',
      'A well-coordinated effort for two runs.',
    ],
    three: [
      'Three runs! Fantastic batting!',
      'A boundary-shy hit that brings three.',
      'Great execution for three.',
    ],
    four: [
      'That\'s a FOUR! What a shot!',
      'FOUR! The ball races to the boundary!',
      'Brilliant stroke! Four runs to the boundary!',
    ],
    six: [
      'SIX! Over the boundary! What a massive hit!',
      'SIXED! Out of the ground!',
      'Pure power! Six runs! Excellent!',
    ],
  };

  /**
   * Calculate outcome based on slider position and probability distribution
   * The slider position (0-1) determines which probability segment it falls into
   */
  const getOutcomeFromSliderPosition = (position) => {
    const probs = probabilities[battingStyle];
    let cumulative = 0;

    // Check each outcome in order
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
   * Handle when user clicks to play the shot
   * Determines outcome based on slider position and updates game state
   */
  const handlePlayShot = () => {
    if (!gameActive || isAnimating) return;

    setIsAnimating(true);

    // Get outcome based on current slider position
    const result = getOutcomeFromSliderPosition(sliderPosition);

    // Add commentary based on result
    const commentaryIndex = Math.floor(
      Math.random() * commentaryLines[result.outcome].length
    );
    setCommentary(commentaryLines[result.outcome][commentaryIndex]);

    // Update game state based on outcome
    setTimeout(() => {
      if (result.outcome === 'wicket') {
        setWickets((w) => w + 1);
      } else {
        setRuns((r) => r + result.runs);
      }

      setBalls((b) => b + 1);
      setLastResult(result.outcome);
      setIsAnimating(false);
    }, 800);
  };

  /**
   * Start a new game
   */
  const startGame = (style) => {
    setBattingStyle(style);
    setGameActive(true);
    setSliderPosition(0);
    setCommentary('');
    setLastResult(null);
  };

  /**
   * Restart the game - reset all stats
   */
  const restartGame = () => {
    setRuns(0);
    setWickets(0);
    setBalls(0);
    setBattingStyle('Aggressive');
    setGameActive(false);
    setSliderPosition(0);
    setLastResult(null);
    setCommentary('');
  };

  /**
   * Animate the slider continuously
   */
  useEffect(() => {
    if (!gameActive || isAnimating) return;

    const interval = setInterval(() => {
      setSliderPosition((pos) => {
        const newPos = (pos + 0.01) % 1; // Loop slider from 0 to 1
        return newPos;
      });
    }, 30); // Update every 30ms for smooth animation

    return () => clearInterval(interval);
  }, [gameActive, isAnimating]);

  /**
   * Check if game should end
   */
  useEffect(() => {
    if (gameActive && (balls >= TOTAL_BALLS || wickets >= MAX_WICKETS)) {
      setGameActive(false);
    }
  }, [balls, wickets, gameActive]);

  // Game not started yet
  if (!gameActive) {
    return (
      <div className="app-container">
        <div className="app-wrapper">
          <h1 className="game-title">🏏 2D Cricket Batting Game 🏏</h1>
          <div className="intro-section">
            <p className="intro-text">
              Welcome to the Cricket Batting Game! Test your skills against the bowler.
            </p>
            <BattingStyleSelector onSelectStyle={startGame} />
          </div>

          {balls > 0 && (
            <div className="final-stats">
              <h2>Game Summary</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">Total Runs</span>
                  <span className="stat-value">{runs}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Wickets</span>
                  <span className="stat-value">{wickets}/2</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Balls Faced</span>
                  <span className="stat-value">{balls}/12</span>
                </div>
              </div>
              <button className="restart-btn" onClick={restartGame}>
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Game in progress
  return (
    <div className="app-container game-active">
      <header className="app-header">
        <h1 className="game-title">🏏 Cricket Batting Game</h1>
      </header>

      <div className="game-layout">
        {/* Left Panel: Cricket Ground */}
        <div className="left-panel">
          <CricketGround
            isAnimating={isAnimating}
            lastResult={lastResult}
            battingStyle={battingStyle}
          />
        </div>

        {/* Right Panel: Scoreboard and Controls */}
        <div className="right-panel">
          {/* Scoreboard */}
          <Scoreboard
            runs={runs}
            wickets={wickets}
            overs={OVERS}
            balls={REMAINING_BALLS}
            battingStyle={battingStyle}
            totalBalls={TOTAL_BALLS}
          />

          {/* Game Status */}
          <GameStatus lastResult={lastResult} commentary={commentary} />

          {/* Power Bar */}
          <PowerBar
            sliderPosition={sliderPosition}
            battingStyle={battingStyle}
            probabilities={probabilities[battingStyle]}
            onPlayShot={handlePlayShot}
            isDisabled={isAnimating}
          />

          {/* Game Info */}
          <div className="game-info">
            <p>Remaining: {TOTAL_BALLS - balls} balls</p>
            <button
              className="play-btn"
              onClick={handlePlayShot}
              disabled={isAnimating}
            >
              {isAnimating ? 'Playing...' : 'PLAY SHOT'}
            </button>
          </div>
        </div>
      </div>

      {/* Game Over Screen */}
      {balls >= TOTAL_BALLS && (
        <div className="game-over-overlay">
          <div className="game-over-card">
            <h2>Match Completed!</h2>
            <div className="final-results">
              <p>
                <strong>Final Score:</strong> {runs} runs
              </p>
              <p>
                <strong>Wickets Lost:</strong> {wickets}/2
              </p>
              <p>
                <strong>Overs Faced:</strong> {OVERS}.{REMAINING_BALLS}
              </p>
            </div>
            <button className="restart-btn" onClick={restartGame}>
              Play Again
            </button>
          </div>
        </div>
      )}

      {wickets >= MAX_WICKETS && balls < TOTAL_BALLS && (
        <div className="game-over-overlay">
          <div className="game-over-card">
            <h2>All Out!</h2>
            <div className="final-results">
              <p>
                <strong>Final Score:</strong> {runs} runs
              </p>
              <p>
                <strong>Balls Faced:</strong> {balls}/12
              </p>
              <p>
                <strong>Overs:</strong> {OVERS}.{REMAINING_BALLS}
              </p>
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
