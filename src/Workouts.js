import React from 'react';
import weeklyWorkouts from './workoutData';

function getLevelClass(level) {
  if (level === 'Beginner') return 'badge beginner';
  if (level === 'Intermediate') return 'badge intermediate';
  if (level === 'Advanced') return 'badge advanced';
  return 'badge';
}

function WorkoutCard({ workout }) {
  return (
    <div className="workout-card">
      <div className="card-header">
        <h3 className="workout-name">{workout.name}</h3>
        <span className={getLevelClass(workout.level)}>{workout.level}</span>
      </div>
      <div className="workout-meta">
        <span>🕐 {workout.duration}</span>
        <span>⚡ {workout.calories}</span>
      </div>
      <div className="exercises">
        <p className="exercises-label">🎯 Key Exercises</p>
        <div className="exercise-tags">
          {workout.exercises.map((ex, i) => (
            <span key={i} className="tag">{ex}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Workouts() {
  return (
    <div>
      <div className="section-header">
        <h2>Weekly Training Programs</h2>
        <p>Discover diverse workout routines tailored for every fitness level and goal</p>
      </div>

      {Object.entries(weeklyWorkouts).map(([day, workouts]) => (
        <div key={day} className="day-section">
          <h2 className="day-title">{day}</h2>
          <div className="cards-row">
            {workouts.map((workout, i) => (
              <WorkoutCard key={i} workout={workout} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Workouts;
