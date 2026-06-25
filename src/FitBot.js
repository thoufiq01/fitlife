import React, { useState, useEffect, useRef } from 'react';
import weeklyWorkouts from './workoutData';

// ─── Flow Definition ────────────────────────────────────────────────────────

const FLOWS = {
  start: {
    botMessage: "Hey there! 👋 I'm FitBot, your personal fitness assistant.\n\nHow can I help you today?",
    options: [
      { label: '💪 Workout Plans', next: 'workout_plans' },
      { label: '🔥 Calorie Tips', next: 'calorie_tips' },
      { label: '😴 Rest & Recovery', next: 'recovery' },
      { label: '🎯 Set a Fitness Goal', next: 'fitness_goal' },
    ],
  },

  workout_plans: {
    botMessage: 'Great choice! What kind of workout are you looking for?',
    options: [
      { label: '📅 This Week\'s Plan', next: 'weekly_plan' },
      { label: '🏋️ Strength Training', next: 'strength' },
      { label: '🏃 Cardio', next: 'cardio' },
      { label: '🧘 Flexibility / Yoga', next: 'flex_yoga' },
      { label: '⬅️ Back', next: 'start' },
    ],
  },

  weekly_plan: {
    botMessage: 'Which day do you want to check?',
    options: Object.keys(weeklyWorkouts).map(day => ({
      label: `📆 ${day}`,
      next: `day_${day.toLowerCase()}`,
    })).concat([{ label: '⬅️ Back', next: 'workout_plans' }]),
    isDayMenu: true,
  },

  ...Object.fromEntries(
    Object.entries(weeklyWorkouts).map(([day, workouts]) => [
      `day_${day.toLowerCase()}`,
      {
        botMessage: `Here's your **${day}** plan:\n\n${workouts
          .map(
            w =>
              `🏅 **${w.name}**\n   Level: ${w.level} • ${w.duration} • ${w.calories}\n   Exercises: ${w.exercises.join(', ')}`
          )
          .join('\n\n')}\n\nNeed anything else?`,
        options: [
          { label: '📅 See Another Day', next: 'weekly_plan' },
          { label: '🏠 Main Menu', next: 'start' },
        ],
        isRich: true,
      },
    ])
  ),

  strength: {
    botMessage:
      '🏋️ **Strength Training Tips:**\n\n• Focus on compound movements: squats, deadlifts, bench press\n• Aim for 3–5 sets of 5–8 reps for power\n• Progressive overload — increase weight gradually\n• Rest 60–90 seconds between sets\n• Train each muscle group 2x per week\n\nWant to see a strength day from our plan?',
    options: [
      { label: '💪 Show Chest Day (Mon)', next: 'day_monday' },
      { label: '🦵 Show Leg Day (Wed)', next: 'day_wednesday' },
      { label: '⬅️ Back', next: 'workout_plans' },
    ],
    isRich: true,
  },

  cardio: {
    botMessage:
      '🏃 **Cardio Guide:**\n\n• **HIIT** (High Intensity): 20–30 min, burns max calories\n• **Steady State**: 30–60 min run/cycle, builds endurance\n• **Dance Cardio**: Fun & effective, 300–400 cal/hr\n• Aim for 150 min of moderate cardio per week\n\nTarget heart rate: 50–85% of max (220 – your age)',
    options: [
      { label: '🔥 Show HIIT Day (Mon)', next: 'day_monday' },
      { label: '💃 Dance Cardio (Fri)', next: 'day_friday' },
      { label: '⬅️ Back', next: 'workout_plans' },
    ],
    isRich: true,
  },

  flex_yoga: {
    botMessage:
      '🧘 **Flexibility & Yoga:**\n\n• Hold each stretch for 20–30 seconds\n• Practice yoga 3–4x per week for best results\n• Morning yoga energises; evening yoga relaxes\n• Sun Salutations are a great full-body warm-up\n• Try our Tuesday Yoga Flow for beginners!',
    options: [
      { label: '🧘 Tuesday Yoga Flow', next: 'day_tuesday' },
      { label: '😴 Sunday Recovery', next: 'day_sunday' },
      { label: '⬅️ Back', next: 'workout_plans' },
    ],
    isRich: true,
  },

  calorie_tips: {
    botMessage: 'What would you like to know about nutrition?',
    options: [
      { label: '🍽️ How Many Calories Do I Need?', next: 'calorie_needs' },
      { label: '🥗 Healthy Eating Tips', next: 'eating_tips' },
      { label: '⚡ Pre & Post Workout Meals', next: 'workout_meals' },
      { label: '⬅️ Back', next: 'start' },
    ],
  },

  calorie_needs: {
    botMessage:
      '📊 **Daily Calorie Needs (Simple Formula):**\n\n• **Lose weight:** Weight (kg) × 12 cal\n• **Maintain weight:** Weight (kg) × 15 cal\n• **Gain muscle:** Weight (kg) × 18 cal\n\n**Example for 70 kg:**\n   🔥 Lose: ~840 cal/day\n   ⚖️ Maintain: ~1050 cal/day\n   💪 Gain: ~1260 cal/day\n\nUse our Calorie Calculator tab for your exact numbers!',
    options: [
      { label: '🥗 Eating Tips', next: 'eating_tips' },
      { label: '🏠 Main Menu', next: 'start' },
    ],
    isRich: true,
  },

  eating_tips: {
    botMessage:
      '🥗 **Healthy Eating Tips:**\n\n• Eat protein with every meal (chicken, eggs, legumes)\n• Fill half your plate with vegetables\n• Stay hydrated — drink 2–3L of water daily\n• Avoid ultra-processed foods and sugary drinks\n• Don\'t skip breakfast — it fuels your morning workout\n• Meal prep on Sundays to stay on track',
    options: [
      { label: '⚡ Pre/Post Workout Meals', next: 'workout_meals' },
      { label: '🏠 Main Menu', next: 'start' },
    ],
    isRich: true,
  },

  workout_meals: {
    botMessage:
      '⚡ **Workout Nutrition:**\n\n**Pre-Workout (30–60 min before):**\n• Banana + peanut butter\n• Oats with fruit\n• Whole grain toast with eggs\n\n**Post-Workout (within 30 min):**\n• Protein shake + fruit\n• Grilled chicken + rice\n• Greek yogurt + berries\n\n💡 Aim for a 3:1 carb-to-protein ratio after training.',
    options: [
      { label: '💪 Back to Workout Plans', next: 'workout_plans' },
      { label: '🏠 Main Menu', next: 'start' },
    ],
    isRich: true,
  },

  recovery: {
    botMessage: 'What aspect of recovery do you want to know about?',
    options: [
      { label: '😴 Sleep & Rest Days', next: 'sleep_tips' },
      { label: '🧊 Muscle Recovery', next: 'muscle_recovery' },
      { label: '⬅️ Back', next: 'start' },
    ],
  },

  sleep_tips: {
    botMessage:
      '😴 **Sleep & Rest Day Tips:**\n\n• Aim for 7–9 hours of quality sleep\n• Sleep is when muscles actually grow\n• Take 1–2 rest days per week minimum\n• Light activity (walking, stretching) on rest days is great\n• Avoid screens 1 hour before bed\n• Consistent sleep/wake times improve recovery',
    options: [
      { label: '🧘 Show Sunday Recovery Workout', next: 'day_sunday' },
      { label: '🏠 Main Menu', next: 'start' },
    ],
    isRich: true,
  },

  muscle_recovery: {
    botMessage:
      '🧊 **Muscle Recovery Tips:**\n\n• Foam roll tight muscles for 60–90 seconds\n• Cold showers or ice baths reduce inflammation\n• Stretch after every workout while muscles are warm\n• Protein intake is critical — 1.6–2.2g per kg body weight\n• Stay hydrated — dehydration slows recovery\n• Epsom salt baths ease soreness',
    options: [
      { label: '💤 Sleep Tips', next: 'sleep_tips' },
      { label: '🏠 Main Menu', next: 'start' },
    ],
    isRich: true,
  },

  fitness_goal: {
    botMessage: 'What\'s your primary fitness goal right now?',
    options: [
      { label: '🔥 Lose Weight', next: 'goal_lose' },
      { label: '💪 Build Muscle', next: 'goal_muscle' },
      { label: '🏃 Improve Stamina', next: 'goal_stamina' },
      { label: '🧘 Stay Active & Healthy', next: 'goal_healthy' },
      { label: '⬅️ Back', next: 'start' },
    ],
  },

  goal_lose: {
    botMessage:
      '🔥 **Weight Loss Plan:**\n\n✅ **Training:** 4–5 sessions/week, mix cardio + strength\n✅ **Nutrition:** Calorie deficit of 300–500 cal/day\n✅ **Cardio:** HIIT 3x/week — burns fat fast\n✅ **Strength:** Preserve muscle while losing fat\n✅ **Hydration:** Drink water before meals\n\n**Recommended days to start:**\n• Monday: HIIT Cardio\n• Wednesday: Leg Day\n• Friday: Full Body Strength',
    options: [
      { label: '🔥 Show HIIT Workout', next: 'day_monday' },
      { label: '🍽️ Calorie Tips', next: 'calorie_tips' },
      { label: '🏠 Main Menu', next: 'start' },
    ],
    isRich: true,
  },

  goal_muscle: {
    botMessage:
      '💪 **Muscle Building Plan:**\n\n✅ **Training:** 4–5x/week, heavy compound lifts\n✅ **Nutrition:** Calorie surplus of 200–300 cal/day\n✅ **Protein:** 2g per kg body weight daily\n✅ **Sleep:** 8+ hours for maximum growth\n✅ **Progressive Overload:** Add weight every 1–2 weeks\n\n**Recommended days:**\n• Mon: Chest & Triceps\n• Tue: Back & Biceps\n• Thu: Shoulders & Arms\n• Sat: Power Training',
    options: [
      { label: '🏋️ Show Strength Workouts', next: 'strength' },
      { label: '⚡ Nutrition for Muscle', next: 'workout_meals' },
      { label: '🏠 Main Menu', next: 'start' },
    ],
    isRich: true,
  },

  goal_stamina: {
    botMessage:
      '🏃 **Stamina & Endurance Plan:**\n\n✅ **Training:** 5x/week, mix cardio types\n✅ **Progression:** Add 10% distance/time per week\n✅ **Cross-train:** Swim, cycle, and run\n✅ **Rest:** Critical — don\'t overtrain\n✅ **Fuel:** Carbs are your energy source\n\n**Best workouts for stamina:**\n• Monday HIIT, Thursday Swimming, Friday Dance Cardio',
    options: [
      { label: '🏊 See Thursday (Swimming)', next: 'day_thursday' },
      { label: '🏃 See Monday (HIIT)', next: 'day_monday' },
      { label: '🏠 Main Menu', next: 'start' },
    ],
    isRich: true,
  },

  goal_healthy: {
    botMessage:
      '🧘 **Stay Active & Healthy Plan:**\n\n✅ **Training:** 3–4x/week, enjoyable activities\n✅ **Mix it up:** Yoga, walking, dance, swimming\n✅ **Consistency > Intensity:** Small habits win\n✅ **Mental health:** Exercise reduces stress & anxiety\n✅ **Hydration & sleep:** The two most powerful habits\n\nOur beginner-friendly picks:\n• Tuesday Yoga Flow\n• Friday Dance Cardio\n• Sunday Active Recovery',
    options: [
      { label: '🧘 Tuesday Yoga', next: 'day_tuesday' },
      { label: '💃 Friday Dance Cardio', next: 'day_friday' },
      { label: '🏠 Main Menu', next: 'start' },
    ],
    isRich: true,
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatMessage(text) {
  // Convert **bold** to <strong> and \n to <br>
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part.split('\n').map((line, j, arr) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 && <br />}
      </span>
    ));
  });
}

// ─── Component ───────────────────────────────────────────────────────────────

function FitBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentFlow, setCurrentFlow] = useState('start');
  const [typing, setTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef(null);
  const initiated = useRef(false);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typing]);

  // Show unread dot when closed
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setHasUnread(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setHasUnread(false);
    }
  }, [isOpen]);

  // Init chat on open
  useEffect(() => {
    if (isOpen && !initiated.current) {
      initiated.current = true;
      sendBotMessage('start');
    }
  }, [isOpen]);

  function sendBotMessage(flowKey) {
    const flow = FLOWS[flowKey];
    if (!flow) return;
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [
        ...prev,
        { id: Date.now(), from: 'bot', text: flow.botMessage, options: flow.options },
      ]);
      setCurrentFlow(flowKey);
    }, 700);
  }

  function handleOption(option) {
    // Add user message
    setMessages(prev => [
      ...prev,
      { id: Date.now(), from: 'user', text: option.label },
    ]);
    // Navigate to next flow
    sendBotMessage(option.next);
  }

  function handleReset() {
    setMessages([]);
    setCurrentFlow('start');
    initiated.current = false;
    sendBotMessage('start');
  }

  const lastBotMessage = [...messages].reverse().find(m => m.from === 'bot');

  return (
    <>
      {/* ── FAB Button ── */}
      <button
        className="fitbot-fab"
        onClick={() => setIsOpen(o => !o)}
        aria-label="Open FitBot"
      >
        {isOpen ? (
          <span className="fitbot-fab-icon">✕</span>
        ) : (
          <>
            <span className="fitbot-fab-icon">💬</span>
            {hasUnread && <span className="fitbot-unread-dot" />}
          </>
        )}
      </button>

      {/* ── Chat Window ── */}
      {isOpen && (
        <div className="fitbot-window">
          {/* Header */}
          <div className="fitbot-header">
            <div className="fitbot-header-left">
              <div className="fitbot-avatar">🤖</div>
              <div>
                <p className="fitbot-name">FitBot</p>
                <p className="fitbot-status">
                  <span className="fitbot-online-dot" />
                  Always active
                </p>
              </div>
            </div>
            <button className="fitbot-reset-btn" onClick={handleReset} title="Restart chat">
              ↺
            </button>
          </div>

          {/* Messages */}
          <div className="fitbot-messages">
            {messages.map((msg, idx) => (
              <div key={msg.id} className={`fitbot-msg-row ${msg.from}`}>
                {msg.from === 'bot' && (
                  <div className="fitbot-bot-avatar">🤖</div>
                )}
                <div className={`fitbot-bubble ${msg.from}`}>
                  {formatMessage(msg.text)}
                </div>
              </div>
            ))}

            {/* Show options only for the last bot message */}
            {lastBotMessage?.options && !typing && (
              <div className="fitbot-options">
                {lastBotMessage.options.map((opt, i) => (
                  <button
                    key={i}
                    className="fitbot-option-btn"
                    onClick={() => handleOption(opt)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Typing indicator */}
            {typing && (
              <div className="fitbot-msg-row bot">
                <div className="fitbot-bot-avatar">🤖</div>
                <div className="fitbot-bubble bot fitbot-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          <div className="fitbot-footer">
            Powered by FitLife Pro · Select an option above
          </div>
        </div>
      )}
    </>
  );
}

export default FitBot;
