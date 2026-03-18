import React from 'react';
import './Scoreboard.css';

/**
 * Scoreboard Component
 * Displays current game statistics: runs, wickets, overs, balls
 *
 * Props:
 *   - runs: Total runs scored
 *   - wickets: Wickets lost
 *   - overs: Complete overs
 *   - balls: Remaining balls in current over
 *   - battingStyle: Current batting style
 *   - totalBalls: Total balls in match
 */
export default function Scoreboard({
  runs,
  wickets,
  overs,
  balls,
  battingStyle,
  totalBalls,
}) {
  const ballsFaced = overs * 6 + balls;
  const remainingBalls = totalBalls - ballsFaced;
  const runRate = ballsFaced > 0 ? (runs / ballsFaced * 6).toFixed(2) : 0;

  return (
    <div className="scoreboard">
      <div className="scoreboard-header">
        <h2>📊 Scoreboard</h2>
        <span className={`batting-style-badge ${battingStyle.toLowerCase()}`}>
          {battingStyle}
        </span>
      </div>

      <div className="score-display">
        <div className="main-score">
          <span className="runs-label">Runs</span>
          <span className="runs-value">{runs}</span>
        </div>
        <div className="divider"></div>
        <div className="wickets-display">
          <span className="wickets-label">Wickets</span>
          <span className="wickets-value">{wickets}/2</span>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-row">
          <span className="stat-left">Overs</span>
          <span className="stat-right">
            {overs}.{balls}
          </span>
        </div>
        <div className="stat-row">
          <span className="stat-left">Balls Faced</span>
          <span className="stat-right">
            {ballsFaced}/{totalBalls}
          </span>
        </div>
        <div className="stat-row">
          <span className="stat-left">Remaining Balls</span>
          <span className="stat-right">{remainingBalls}</span>
        </div>
        <div className="stat-row">
          <span className="stat-left">Run Rate</span>
          <span className="stat-right">{runRate}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-section">
        <label>Match Progress</label>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(ballsFaced / totalBalls) * 100}%` }}
          ></div>
        </div>
        <p className="progress-text">
          {ballsFaced} / {totalBalls} balls played
        </p>
      </div>
    </div>
  );
}
