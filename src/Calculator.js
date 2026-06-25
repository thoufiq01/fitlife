import React, { useState } from 'react';

function Calculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  function calculate() {
    setError('');
    setResult(null);

    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (!w || !h || w <= 0 || h <= 0) {
      setError('Please enter valid weight and height values.');
      return;
    }

    setResult({
      lose: Math.round(w * 12),
      maintain: Math.round(w * 15),
      gain: Math.round(w * 18)
    });
  }

  function clear() {
    setWeight('');
    setHeight('');
    setResult(null);
    setError('');
  }

  return (
    <div>
      <div className="section-header">
        <h2>Calorie Calculator</h2>
        <p>Find out how many calories you need based on your weight</p>
      </div>

      <div className="calc-box">
        <div className="input-group">
          <label>Weight (kg)</label>
          <input
            type="number"
            placeholder="e.g. 70"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Height (cm)</label>
          <input
            type="number"
            placeholder="e.g. 175"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>

        {error && <p className="error-msg">{error}</p>}

        <div className="calc-buttons">
          <button className="btn-calc" onClick={calculate}>Calculate</button>
          <button className="btn-clear" onClick={clear}>Clear</button>
        </div>

        {result && (
          <div className="calc-result">
            <h3>Your Daily Calorie Needs</h3>

            <div className="result-cards">
              <div className="result-card lose">
                <div>
                  <p className="result-label">🔥 Lose Weight</p>
                  <p className="result-note">Calorie deficit to shed fat</p>
                </div>
                <div className="right-side">
                  <p className="result-formula">weight × 12</p>
                  <p className="result-value">{result.lose} cal/day</p>
                </div>
              </div>

              <div className="result-card maintain">
                <div>
                  <p className="result-label">⚖️ Maintain Weight</p>
                  <p className="result-note">Stay at your current weight</p>
                </div>
                <div className="right-side">
                  <p className="result-formula">weight × 15</p>
                  <p className="result-value">{result.maintain} cal/day</p>
                </div>
              </div>

              <div className="result-card gain">
                <div>
                  <p className="result-label">💪 Gain Weight</p>
                  <p className="result-note">Calorie surplus to build muscle</p>
                </div>
                <div className="right-side">
                  <p className="result-formula">weight × 18</p>
                  <p className="result-value">{result.gain} cal/day</p>
                </div>
              </div>
            </div>

            <p className="calc-disclaimer">
              * These are estimates based on a simple formula. For a precise plan, consult a nutritionist.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Calculator;
