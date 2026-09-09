// Handcrafted 10-level vertical slice dataset (Sections 12, 21, 28)
export const LEVELS = [
  // Levels 1–3: Tutorial (Teach exact distance, 4-direction choice, destination planning)
  {"name": "Learn Distance", "phase": "Tutorial", "w": 3, "h": 3, "start": [0, 0], "goal": [0, 2], "grid": [[2, 3, 4], [1, 2, 3], [4, 1, 2]], "optimal": 1},
  {"name": "Cardinal Choice", "phase": "Tutorial", "w": 3, "h": 3, "start": [0, 0], "goal": [2, 1], "grid": [[1, 2, 3], [3, 4, 1], [2, 4, 4]], "optimal": 2},
  {"name": "First Planning Step", "phase": "Tutorial", "w": 4, "h": 4, "start": [0, 0], "goal": [3, 3], "grid": [[3, 3, 4, 3], [1, 1, 4, 2], [3, 2, 4, 4], [1, 1, 3, 3]], "optimal": 2},

  // Levels 4–6: Basic Planning (Multiple valid destinations, evaluating future numbers)
  {"name": "Two Paths", "phase": "Basic Planning", "w": 4, "h": 4, "start": [0, 0], "goal": [3, 3], "grid": [[1, 4, 3, 4], [2, 2, 1, 2], [2, 2, 2, 1], [4, 2, 3, 3]], "optimal": 4},
  {"name": "Destination Anticipation", "phase": "Basic Planning", "w": 5, "h": 5, "start": [0, 0], "goal": [4, 4], "grid": [[1, 3, 1, 1, 2], [4, 2, 3, 3, 3], [4, 1, 1, 4, 4], [4, 4, 3, 1, 2], [1, 3, 3, 4, 2]], "optimal": 3},
  {"name": "Alternate Routes", "phase": "Basic Planning", "w": 5, "h": 5, "start": [0, 4], "goal": [4, 0], "grid": [[2, 3, 2, 1, 2], [1, 3, 3, 2, 3], [2, 3, 2, 2, 2], [4, 2, 2, 4, 3], [1, 1, 3, 4, 3]], "optimal": 4},

  // Levels 7–8: Dead Ends (Attractive jumps leading to traps/dead ends)
  {"name": "Deceptive Leaps", "phase": "Dead Ends", "w": 5, "h": 5, "start": [0, 0], "goal": [4, 4], "grid": [[2, 3, 4, 2, 1], [3, 4, 4, 2, 2], [1, 4, 2, 1, 2], [2, 2, 4, 1, 1], [3, 4, 1, 1, 2]], "optimal": 4},
  {"name": "The False 4", "phase": "Dead Ends", "w": 5, "h": 5, "start": [4, 0], "goal": [0, 4], "grid": [[1, 2, 4, 1, 3], [1, 1, 3, 1, 2], [1, 3, 1, 4, 1], [3, 4, 3, 2, 1], [2, 1, 2, 3, 1]], "optimal": 6},

  // Levels 9–10:/ Multi-Step Solutions (Long planning sequences, thinking several moves ahead)
  {"name": "Deep Traversal", "phase": "Multi-Step Solutions", "w": 6, "h": 6, "start": [0, 0], "goal": [5, 5], "grid": [[3, 3, 1, 3, 2, 2], [2, 4, 4, 4, 1, 4], [3, 1, 2, 1, 2, 3], [3, 3, 2, 1, 4, 1], [4, 3, 1, 2, 4, 3], [3, 4, 4, 4, 1, 2]], "optimal": 6},
  {"name": "Grand Leap", "phase": "Multi-Step Solutions", "w": 6, "h": 6, "start": [5, 0], "goal": [0, 5], "grid": [[3, 2, 3, 3, 2, 1], [4, 4, 4, 2, 4, 3], [3, 1, 4, 3, 3, 2], [2, 1, 3, 2, 4, 4], [4, 4, 3, 1, 2, 1], [4, 4, 4, 1, 1, 4]], "optimal": 8}
];
