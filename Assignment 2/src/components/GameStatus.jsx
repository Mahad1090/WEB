import React from 'react';
import './GameStatus.css';

/**
 * GameStatus Component
 * Displays the result of the last shot and dynamic commentary
 *
 * Props:
 *   - lastResult: Result of the last shot (wicket, zero, one, two, three, four, six)
 *   - commentary: Dynamic commentary message
 */
export default function GameStatus({ lastResult, commentary }) {
  // Descriptions for each result
  const resultDetails = {
    wicket: {
      title: 'WICKET!',
      color: '#ff6b6b',
      description: 'Batsman is out!',
    },
    zero: {
      title: 'DOT BALL',
      color: '#ffa500',
      description: 'No runs scored',
    },
    one: {
      title: '1 RUN',
      color: '#78c850',
      description: 'Single run',
    },
    two: {
      title: '2 RUNS',
      color: '#a890f0',
      description: 'Double runs',
    },
    three: {
      title: '3 RUNS',
      color: '#ffde00',
      description: 'Triple runs',
    },
    four: {
      title: '4 RUNS',
      color: '#00bfff',
      description: 'FOUR to the boundary!',
    },
    six: {
      title: '6 RUNS',
      color: '#ff1493',
      description: 'SIX over the boundary!',
    },
  };

  const result = resultDetails[lastResult];

  return (
    <div className="game-status">
      {result && (
        <div className="status-card active">
          <div className="status-content">
            <h4 className="status-title" style={{ borderColor: result.color }}>
              {result.title}
            </h4>
            <p className="status-description">{result.description}</p>
            {commentary && (
              <p className="commentary">
                <em>"{commentary}"</em>
              </p>
            )}
          </div>
        </div>
      )}

      {!result && (
        <div className="status-card waiting">
          <div className="status-content">
            <h4>Ready to Play</h4>
            <p>Click PLAY SHOT when the slider reaches your desired position!</p>
          </div>
        </div>
      )}
    </div>
  );
}
