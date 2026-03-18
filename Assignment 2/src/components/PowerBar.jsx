import React from 'react';
import './PowerBar.css';

/**
 * PowerBar Component
 * Displays probability segments and animated slider
 * The slider position determines the outcome of the shot
 *
 * Props:
 *   - sliderPosition: Current position of slider (0-1)
 *   - battingStyle: Current batting style
 *   - probabilities: Probability distribution object
 *   - onPlayShot: Callback when play shot is clicked
 *   - isDisabled: Whether controls are disabled
 */
export default function PowerBar({
  sliderPosition,
  battingStyle,
  probabilities,
  onPlayShot,
  isDisabled,
}) {
  // Define colors for each outcome
  const colors = {
    wicket: '#ff6b6b',
    zero: '#ffa500',
    one: '#78c850',
    two: '#a890f0',
    three: '#ffde00',
    four: '#00bfff',
    six: '#ff1493',
  };

  // Calculate segment positions
  const segments = [];
  let start = 0;

  const outcomes = [
    { key: 'wicket', label: 'Wicket', emoji: '💔' },
    { key: 'zero', label: 'Zero', emoji: '⭕' },
    { key: 'one', label: '1 Run', emoji: '1️⃣' },
    { key: 'two', label: '2 Runs', emoji: '2️⃣' },
    { key: 'three', label: '3 Runs', emoji: '3️⃣' },
    { key: 'four', label: '4 Runs', emoji: '4️⃣' },
    { key: 'six', label: '6 Runs', emoji: '6️⃣' },
  ];

  outcomes.forEach((outcome) => {
    const width = probabilities[outcome.key] * 100;
    segments.push({
      ...outcome,
      start,
      width,
      color: colors[outcome.key],
    });
    start += width;
  });

  return (
    <div className="power-bar-container">
      <h3>⚡ Probability-Based Power Bar</h3>

      {/* Power Bar */}
      <div className="power-bar">
        {/* Segments */}
        <div className="segments">
          {segments.map((segment) => (
            <div
              key={segment.key}
              className="segment"
              style={{
                width: `${segment.width}%`,
                backgroundColor: segment.color,
              }}
              title={`${segment.label}: ${(segment.width).toFixed(1)}%`}
            >
              <span className="segment-label">{segment.emoji}</span>
            </div>
          ))}
        </div>

        {/* Moving Slider */}
        <div
          className="slider"
          style={{
            left: `calc(${sliderPosition * 100}% - 15px)`,
          }}
        >
          <div className="slider-pointer"></div>
        </div>

        {/* Current Position Indicator */}
        <div className="position-indicator">
          <span className="position-text">
            Position: {(sliderPosition * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="legend">
        <div className="legend-title">Probability Mappings:</div>
        <div className="legend-grid">
          {segments.map((segment) => (
            <div key={segment.key} className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: segment.color }}
              ></div>
              <span className="legend-label">
                {segment.emoji} {segment.label} ({(segment.width).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div className="bar-explanation">
        <p>
          <strong>How it works:</strong> The slider continuously moves across the power bar.
          Click "PLAY SHOT" to stop the slider and score based on its position!
        </p>
      </div>
    </div>
  );
}
