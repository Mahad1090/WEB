import React from 'react';
import './PowerBar.css';

/**
 * PowerBar Component
 * Displays probability segments and animated slider
 * The slider position determines the outcome of the shot
 *
 * Props:
 *   - sliderPosition: Current position of slider (0-1)
 *   - battingStyle: Current batting style (Aggressive/Defensive)
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
    { key: 'wicket', label: 'W' },
    { key: 'zero', label: '0' },
    { key: 'one', label: '1' },
    { key: 'two', label: '2' },
    { key: 'three', label: '3' },
    { key: 'four', label: '4' },
    { key: 'six', label: '6' },
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

  // Calculate cumulative positions for scale marks (dynamically based on probabilities)
  let cumulative = 0;
  const allScaleMarks = [{ value: 0, cumulative: 0 }];
  
  outcomes.forEach((outcome) => {
    cumulative += probabilities[outcome.key];
    allScaleMarks.push({
      value: parseFloat(cumulative.toFixed(2)),
      cumulative: cumulative * 100,
    });
  });

  // For defensive style, filter to show only 0, values < 0.9, and 1
  const scaleMarks = battingStyle === 'Defensive'
    ? allScaleMarks.filter(mark => mark.value < 0.9 || mark.value === 1)
    : allScaleMarks;

  return (
    <div className="power-bar-container">
      <h3>Power Bar</h3>

      {/* Power Bar */}
      <div className="power-bar-wrapper">
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
                title={`${segment.label}`}
              >
                <span className="segment-label">{segment.label}</span>
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
            <div className="slider-triangle"></div>
          </div>
        </div>

        {/* Numerical scale */}
        <div className="scale-numbers">
          {scaleMarks.map((mark) => (
            <span
              key={mark.value}
              className="scale-mark"
              style={{ left: `${mark.cumulative}%` }}
            >
              {mark.value}
            </span>
          ))}
        </div>

        {/* Batting Style Indicator */}
        <div className="batting-style-indicator">
          <span className={`style-badge ${battingStyle.toLowerCase()}`}>
            {battingStyle} Selected
          </span>
        </div>
      </div>
    </div>
  );
}
