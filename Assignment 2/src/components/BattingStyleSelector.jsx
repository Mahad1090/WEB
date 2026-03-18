import React from 'react';
import './BattingStyleSelector.css';

/**
 * BattingStyleSelector Component
 * Displays options to choose batting style (Aggressive or Defensive)
 *
 * Props:
 *   - onSelectStyle: Callback function when a style is selected
 */
export default function BattingStyleSelector({ onSelectStyle }) {
  return (
    <div className="batting-style-selector">
      <h2>Select Your Batting Style</h2>
      <p className="instruction">
        Choose your strategy: Play aggressive for higher rewards but higher risk, or play defensive for stable scoring with lower risk.
      </p>

      <div className="style-buttons">
        <button
          className="style-btn aggressive-btn"
          onClick={() => onSelectStyle('Aggressive')}
          title="High Risk, High Reward"
        >
          <span className="style-icon">⚡</span>
          <span className="style-name">Aggressive</span>
          <span className="style-desc">High Risk • High Reward</span>
        </button>

        <button
          className="style-btn defensive-btn"
          onClick={() => onSelectStyle('Defensive')}
          title="Low Risk, Stable Scoring"
        >
          <span className="style-icon">🛡️</span>
          <span className="style-name">Defensive</span>
          <span className="style-desc">Low Risk • Stable Scoring</span>
        </button>
      </div>

      {/* Probability distribution info */}
      <div className="prob-info">
        <h3>Probability Distributions</h3>
        <div className="prob-table">
          <div className="prob-column">
            <h4>Aggressive Style</h4>
            <ul>
              <li>Wicket: 40%</li>
              <li>0 Runs: 10%</li>
              <li>1 Run: 10%</li>
              <li>2 Runs: 10%</li>
              <li>3 Runs: 5%</li>
              <li>4 Runs: 10%</li>
              <li>6 Runs: 15%</li>
            </ul>
          </div>
          <div className="prob-column">
            <h4>Defensive Style</h4>
            <ul>
              <li>Wicket: 15%</li>
              <li>0 Runs: 20%</li>
              <li>1 Run: 25%</li>
              <li>2 Runs: 20%</li>
              <li>3 Runs: 10%</li>
              <li>4 Runs: 8%</li>
              <li>6 Runs: 2%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
