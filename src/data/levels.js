// Handcrafted & Algorithmic 100-Level Campaign Dataset
// 10 Thematic Chapters, 10 Levels Each (3x3 to 8x8 Grids)
export const LEVELS = [
  {
    "name": "Learn Distance",
    "phase": "Origins",
    "w": 3,
    "h": 3,
    "start": [
      0,
      0
    ],
    "goal": [
      0,
      2
    ],
    "grid": [
      [
        2,
        3,
        4
      ],
      [
        1,
        2,
        3
      ],
      [
        4,
        1,
        2
      ]
    ],
    "optimal": 1
  },
  {
    "name": "Cardinal Choice",
    "phase": "Origins",
    "w": 3,
    "h": 3,
    "start": [
      0,
      0
    ],
    "goal": [
      2,
      1
    ],
    "grid": [
      [
        1,
        2,
        3
      ],
      [
        3,
        4,
        1
      ],
      [
        2,
        4,
        4
      ]
    ],
    "optimal": 2
  },
  {
    "name": "Center Out",
    "phase": "Origins",
    "w": 4,
    "h": 4,
    "start": [
      2,
      2
    ],
    "goal": [
      3,
      0
    ],
    "grid": [
      [
        1,
        1,
        3,
        1
      ],
      [
        2,
        2,
        1,
        3
      ],
      [
        2,
        2,
        1,
        3
      ],
      [
        1,
        1,
        3,
        3
      ]
    ],
    "optimal": 4
  },
  {
    "name": "The U-Turn",
    "phase": "Origins",
    "w": 4,
    "h": 4,
    "start": [
      0,
      3
    ],
    "goal": [
      3,
      0
    ],
    "grid": [
      [
        2,
        3,
        3,
        3
      ],
      [
        2,
        2,
        3,
        2
      ],
      [
        3,
        2,
        2,
        1
      ],
      [
        1,
        3,
        2,
        1
      ]
    ],
    "optimal": 3
  },
  {
    "name": "Diagonal Cross",
    "phase": "Origins",
    "w": 4,
    "h": 4,
    "start": [
      0,
      0
    ],
    "goal": [
      2,
      2
    ],
    "grid": [
      [
        1,
        2,
        1,
        2
      ],
      [
        2,
        2,
        1,
        2
      ],
      [
        1,
        2,
        1,
        2
      ],
      [
        3,
        3,
        2,
        2
      ]
    ],
    "optimal": 3
  },
  {
    "name": "The S-Curve",
    "phase": "Origins",
    "w": 4,
    "h": 4,
    "start": [
      2,
      0
    ],
    "goal": [
      2,
      3
    ],
    "grid": [
      [
        1,
        3,
        2,
        2
      ],
      [
        1,
        3,
        1,
        2
      ],
      [
        1,
        3,
        3,
        1
      ],
      [
        1,
        2,
        1,
        3
      ]
    ],
    "optimal": 5
  },
  {
    "name": "The Pinwheel",
    "phase": "Origins",
    "w": 4,
    "h": 4,
    "start": [
      3,
      3
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        1,
        2,
        2
      ],
      [
        2,
        2,
        3,
        1
      ],
      [
        1,
        1,
        3,
        3
      ],
      [
        2,
        1,
        3,
        2
      ]
    ],
    "optimal": 4
  },
  {
    "name": "Bullseye",
    "phase": "Origins",
    "w": 4,
    "h": 4,
    "start": [
      0,
      2
    ],
    "goal": [
      3,
      2
    ],
    "grid": [
      [
        1,
        3,
        2,
        3
      ],
      [
        1,
        1,
        2,
        1
      ],
      [
        3,
        2,
        3,
        2
      ],
      [
        3,
        2,
        1,
        1
      ]
    ],
    "optimal": 5
  },
  {
    "name": "The Loop Trap",
    "phase": "Origins",
    "w": 5,
    "h": 5,
    "start": [
      4,
      2
    ],
    "goal": [
      2,
      2
    ],
    "grid": [
      [
        2,
        1,
        2,
        3,
        2
      ],
      [
        2,
        1,
        2,
        2,
        1
      ],
      [
        2,
        3,
        1,
        1,
        3
      ],
      [
        3,
        2,
        3,
        1,
        2
      ],
      [
        1,
        1,
        3,
        3,
        3
      ]
    ],
    "optimal": 4
  },
  {
    "name": "Origins Climax",
    "phase": "Origins",
    "w": 5,
    "h": 5,
    "start": [
      4,
      0
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        4,
        3,
        1,
        3
      ],
      [
        1,
        4,
        2,
        4,
        2
      ],
      [
        4,
        4,
        3,
        4,
        2
      ],
      [
        4,
        3,
        1,
        4,
        2
      ],
      [
        1,
        1,
        1,
        3,
        3
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Pivot Angle",
    "phase": "The Pivot",
    "w": 4,
    "h": 4,
    "start": [
      0,
      0
    ],
    "goal": [
      3,
      3
    ],
    "grid": [
      [
        2,
        1,
        1,
        1
      ],
      [
        3,
        3,
        1,
        2
      ],
      [
        1,
        3,
        1,
        1
      ],
      [
        2,
        1,
        3,
        1
      ]
    ],
    "optimal": 4
  },
  {
    "name": "Perimeter Leap",
    "phase": "The Pivot",
    "w": 4,
    "h": 4,
    "start": [
      3,
      0
    ],
    "goal": [
      0,
      3
    ],
    "grid": [
      [
        2,
        3,
        1,
        1
      ],
      [
        3,
        3,
        2,
        3
      ],
      [
        2,
        3,
        2,
        2
      ],
      [
        1,
        2,
        1,
        2
      ]
    ],
    "optimal": 4
  },
  {
    "name": "Double Cross",
    "phase": "The Pivot",
    "w": 4,
    "h": 4,
    "start": [
      2,
      2
    ],
    "goal": [
      3,
      0
    ],
    "grid": [
      [
        2,
        1,
        3,
        3
      ],
      [
        1,
        3,
        1,
        1
      ],
      [
        3,
        1,
        2,
        2
      ],
      [
        1,
        1,
        1,
        3
      ]
    ],
    "optimal": 4
  },
  {
    "name": "Reflected Vector",
    "phase": "The Pivot",
    "w": 5,
    "h": 5,
    "start": [
      0,
      4
    ],
    "goal": [
      4,
      0
    ],
    "grid": [
      [
        3,
        2,
        1,
        4,
        1
      ],
      [
        3,
        2,
        2,
        3,
        3
      ],
      [
        1,
        4,
        2,
        1,
        1
      ],
      [
        2,
        4,
        2,
        4,
        3
      ],
      [
        1,
        3,
        2,
        4,
        3
      ]
    ],
    "optimal": 5
  },
  {
    "name": "Inner Square",
    "phase": "The Pivot",
    "w": 5,
    "h": 5,
    "start": [
      0,
      0
    ],
    "goal": [
      2,
      2
    ],
    "grid": [
      [
        3,
        3,
        2,
        3,
        2
      ],
      [
        2,
        4,
        1,
        3,
        3
      ],
      [
        2,
        2,
        1,
        3,
        1
      ],
      [
        4,
        3,
        4,
        3,
        3
      ],
      [
        2,
        3,
        4,
        1,
        4
      ]
    ],
    "optimal": 5
  },
  {
    "name": "Deceptive 3",
    "phase": "The Pivot",
    "w": 5,
    "h": 5,
    "start": [
      2,
      0
    ],
    "goal": [
      2,
      4
    ],
    "grid": [
      [
        2,
        2,
        2,
        2,
        3
      ],
      [
        1,
        1,
        3,
        3,
        1
      ],
      [
        1,
        2,
        3,
        2,
        1
      ],
      [
        3,
        4,
        3,
        1,
        2
      ],
      [
        4,
        2,
        1,
        1,
        4
      ]
    ],
    "optimal": 5
  },
  {
    "name": "Deadly Turn",
    "phase": "The Pivot",
    "w": 5,
    "h": 5,
    "start": [
      4,
      4
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        4,
        2,
        1,
        1
      ],
      [
        4,
        2,
        1,
        4,
        1
      ],
      [
        1,
        4,
        4,
        1,
        4
      ],
      [
        2,
        4,
        2,
        3,
        1
      ],
      [
        2,
        3,
        1,
        4,
        3
      ]
    ],
    "optimal": 5
  },
  {
    "name": "Narrow Bridge",
    "phase": "The Pivot",
    "w": 5,
    "h": 5,
    "start": [
      0,
      2
    ],
    "goal": [
      4,
      2
    ],
    "grid": [
      [
        1,
        1,
        1,
        1,
        3
      ],
      [
        3,
        1,
        1,
        3,
        2
      ],
      [
        4,
        4,
        4,
        1,
        2
      ],
      [
        3,
        1,
        2,
        4,
        3
      ],
      [
        2,
        1,
        1,
        2,
        1
      ]
    ],
    "optimal": 5
  },
  {
    "name": "Trapped In Corner",
    "phase": "The Pivot",
    "w": 5,
    "h": 5,
    "start": [
      4,
      2
    ],
    "goal": [
      2,
      2
    ],
    "grid": [
      [
        2,
        4,
        4,
        1,
        2
      ],
      [
        4,
        4,
        3,
        4,
        2
      ],
      [
        2,
        1,
        1,
        4,
        3
      ],
      [
        1,
        1,
        4,
        1,
        2
      ],
      [
        1,
        3,
        1,
        4,
        4
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Pivot Master",
    "phase": "The Pivot",
    "w": 5,
    "h": 5,
    "start": [
      4,
      0
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        2,
        2,
        1,
        3
      ],
      [
        4,
        1,
        4,
        2,
        2
      ],
      [
        1,
        2,
        4,
        2,
        1
      ],
      [
        1,
        4,
        2,
        2,
        1
      ],
      [
        1,
        3,
        3,
        4,
        1
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Open Field",
    "phase": "Vectors",
    "w": 5,
    "h": 5,
    "start": [
      0,
      0
    ],
    "goal": [
      4,
      4
    ],
    "grid": [
      [
        3,
        3,
        4,
        4,
        4
      ],
      [
        3,
        3,
        3,
        4,
        2
      ],
      [
        2,
        1,
        4,
        1,
        2
      ],
      [
        3,
        1,
        3,
        1,
        2
      ],
      [
        4,
        2,
        1,
        4,
        1
      ]
    ],
    "optimal": 5
  },
  {
    "name": "Five Steps",
    "phase": "Vectors",
    "w": 5,
    "h": 5,
    "start": [
      4,
      0
    ],
    "goal": [
      0,
      4
    ],
    "grid": [
      [
        1,
        4,
        3,
        3,
        1
      ],
      [
        2,
        3,
        3,
        1,
        1
      ],
      [
        1,
        2,
        2,
        3,
        3
      ],
      [
        1,
        2,
        3,
        1,
        2
      ],
      [
        3,
        1,
        2,
        1,
        2
      ]
    ],
    "optimal": 5
  },
  {
    "name": "Crossroad Axis",
    "phase": "Vectors",
    "w": 5,
    "h": 5,
    "start": [
      2,
      2
    ],
    "goal": [
      4,
      0
    ],
    "grid": [
      [
        4,
        2,
        4,
        3,
        3
      ],
      [
        4,
        1,
        4,
        4,
        3
      ],
      [
        3,
        1,
        2,
        2,
        3
      ],
      [
        3,
        2,
        1,
        1,
        1
      ],
      [
        1,
        2,
        4,
        1,
        1
      ]
    ],
    "optimal": 5
  },
  {
    "name": "Alternating Pace",
    "phase": "Vectors",
    "w": 5,
    "h": 5,
    "start": [
      0,
      4
    ],
    "goal": [
      4,
      0
    ],
    "grid": [
      [
        1,
        2,
        2,
        4,
        2
      ],
      [
        2,
        3,
        2,
        1,
        2
      ],
      [
        1,
        1,
        1,
        3,
        3
      ],
      [
        1,
        1,
        3,
        4,
        1
      ],
      [
        1,
        2,
        3,
        1,
        3
      ]
    ],
    "optimal": 5
  },
  {
    "name": "The Diagonal Trap",
    "phase": "Vectors",
    "w": 5,
    "h": 5,
    "start": [
      0,
      0
    ],
    "goal": [
      2,
      2
    ],
    "grid": [
      [
        4,
        4,
        1,
        1,
        3
      ],
      [
        3,
        2,
        1,
        1,
        4
      ],
      [
        4,
        3,
        1,
        1,
        1
      ],
      [
        3,
        2,
        2,
        3,
        3
      ],
      [
        1,
        1,
        3,
        2,
        1
      ]
    ],
    "optimal": 5
  },
  {
    "name": "Cycle Break",
    "phase": "Vectors",
    "w": 5,
    "h": 5,
    "start": [
      2,
      0
    ],
    "goal": [
      2,
      4
    ],
    "grid": [
      [
        4,
        3,
        3,
        1,
        1
      ],
      [
        3,
        1,
        4,
        2,
        1
      ],
      [
        3,
        4,
        2,
        2,
        1
      ],
      [
        3,
        1,
        1,
        1,
        4
      ],
      [
        1,
        2,
        1,
        2,
        1
      ]
    ],
    "optimal": 5
  },
  {
    "name": "Centering",
    "phase": "Vectors",
    "w": 5,
    "h": 5,
    "start": [
      4,
      4
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        4,
        1,
        4,
        1
      ],
      [
        1,
        4,
        2,
        1,
        2
      ],
      [
        1,
        2,
        2,
        2,
        3
      ],
      [
        1,
        2,
        4,
        1,
        3
      ],
      [
        1,
        1,
        1,
        4,
        2
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Woven Paths",
    "phase": "Vectors",
    "w": 5,
    "h": 5,
    "start": [
      0,
      2
    ],
    "goal": [
      4,
      2
    ],
    "grid": [
      [
        3,
        2,
        3,
        3,
        2
      ],
      [
        4,
        4,
        1,
        4,
        4
      ],
      [
        4,
        2,
        1,
        2,
        4
      ],
      [
        4,
        1,
        2,
        1,
        4
      ],
      [
        3,
        1,
        1,
        3,
        2
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Hidden Choice",
    "phase": "Vectors",
    "w": 5,
    "h": 5,
    "start": [
      4,
      2
    ],
    "goal": [
      2,
      2
    ],
    "grid": [
      [
        2,
        3,
        3,
        4,
        3
      ],
      [
        2,
        3,
        2,
        4,
        4
      ],
      [
        2,
        2,
        1,
        3,
        4
      ],
      [
        4,
        2,
        3,
        1,
        1
      ],
      [
        2,
        1,
        3,
        4,
        1
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Vector Climax",
    "phase": "Vectors",
    "w": 5,
    "h": 5,
    "start": [
      4,
      0
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        4,
        3,
        3,
        4
      ],
      [
        1,
        4,
        1,
        1,
        3
      ],
      [
        4,
        4,
        1,
        2,
        3
      ],
      [
        1,
        1,
        2,
        3,
        1
      ],
      [
        2,
        2,
        4,
        3,
        2
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Tempting Branch",
    "phase": "Crossroads",
    "w": 5,
    "h": 5,
    "start": [
      0,
      0
    ],
    "goal": [
      4,
      4
    ],
    "grid": [
      [
        3,
        4,
        2,
        3,
        3
      ],
      [
        2,
        1,
        2,
        4,
        1
      ],
      [
        4,
        2,
        3,
        1,
        1
      ],
      [
        3,
        3,
        2,
        1,
        2
      ],
      [
        1,
        3,
        1,
        2,
        1
      ]
    ],
    "optimal": 5
  },
  {
    "name": "Echo Lane",
    "phase": "Crossroads",
    "w": 5,
    "h": 5,
    "start": [
      4,
      0
    ],
    "goal": [
      0,
      4
    ],
    "grid": [
      [
        3,
        4,
        2,
        2,
        1
      ],
      [
        3,
        2,
        1,
        3,
        1
      ],
      [
        3,
        1,
        3,
        2,
        3
      ],
      [
        2,
        2,
        3,
        4,
        4
      ],
      [
        3,
        3,
        1,
        2,
        2
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Mirror Step",
    "phase": "Crossroads",
    "w": 5,
    "h": 5,
    "start": [
      2,
      2
    ],
    "goal": [
      4,
      0
    ],
    "grid": [
      [
        3,
        4,
        3,
        4,
        4
      ],
      [
        4,
        2,
        4,
        1,
        2
      ],
      [
        4,
        4,
        1,
        3,
        2
      ],
      [
        1,
        3,
        1,
        4,
        2
      ],
      [
        1,
        2,
        4,
        3,
        2
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Long Span",
    "phase": "Crossroads",
    "w": 6,
    "h": 6,
    "start": [
      0,
      5
    ],
    "goal": [
      5,
      0
    ],
    "grid": [
      [
        4,
        1,
        2,
        5,
        3,
        1
      ],
      [
        5,
        3,
        1,
        2,
        3,
        3
      ],
      [
        5,
        3,
        1,
        5,
        5,
        1
      ],
      [
        3,
        5,
        5,
        2,
        1,
        1
      ],
      [
        5,
        2,
        2,
        2,
        5,
        2
      ],
      [
        1,
        4,
        1,
        5,
        1,
        5
      ]
    ],
    "optimal": 7
  },
  {
    "name": "The Spiral",
    "phase": "Crossroads",
    "w": 6,
    "h": 6,
    "start": [
      0,
      0
    ],
    "goal": [
      3,
      3
    ],
    "grid": [
      [
        1,
        5,
        2,
        4,
        3,
        4
      ],
      [
        3,
        1,
        4,
        5,
        1,
        1
      ],
      [
        5,
        4,
        1,
        1,
        1,
        3
      ],
      [
        1,
        2,
        3,
        1,
        5,
        5
      ],
      [
        2,
        3,
        2,
        5,
        3,
        3
      ],
      [
        2,
        4,
        5,
        2,
        1,
        1
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Decoy Trail",
    "phase": "Crossroads",
    "w": 6,
    "h": 6,
    "start": [
      3,
      0
    ],
    "goal": [
      3,
      5
    ],
    "grid": [
      [
        4,
        3,
        3,
        4,
        2,
        2
      ],
      [
        2,
        2,
        2,
        2,
        5,
        3
      ],
      [
        1,
        4,
        3,
        2,
        2,
        5
      ],
      [
        3,
        4,
        2,
        5,
        3,
        1
      ],
      [
        4,
        3,
        5,
        1,
        5,
        2
      ],
      [
        2,
        1,
        5,
        3,
        1,
        4
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Shadow Route",
    "phase": "Crossroads",
    "w": 6,
    "h": 6,
    "start": [
      5,
      5
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        5,
        4,
        1,
        3,
        3
      ],
      [
        4,
        5,
        2,
        5,
        5,
        4
      ],
      [
        4,
        3,
        5,
        1,
        4,
        3
      ],
      [
        3,
        4,
        3,
        3,
        5,
        5
      ],
      [
        3,
        4,
        1,
        4,
        1,
        3
      ],
      [
        2,
        5,
        5,
        3,
        1,
        3
      ]
    ],
    "optimal": 7
  },
  {
    "name": "The False Choice",
    "phase": "Crossroads",
    "w": 6,
    "h": 6,
    "start": [
      0,
      3
    ],
    "goal": [
      5,
      3
    ],
    "grid": [
      [
        2,
        5,
        2,
        3,
        4,
        2
      ],
      [
        4,
        3,
        5,
        5,
        3,
        1
      ],
      [
        4,
        2,
        1,
        5,
        1,
        3
      ],
      [
        3,
        4,
        4,
        1,
        5,
        4
      ],
      [
        3,
        3,
        2,
        5,
        5,
        2
      ],
      [
        5,
        2,
        5,
        1,
        4,
        4
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Deep Lookahead",
    "phase": "Crossroads",
    "w": 6,
    "h": 6,
    "start": [
      5,
      3
    ],
    "goal": [
      3,
      3
    ],
    "grid": [
      [
        5,
        4,
        1,
        2,
        3,
        5
      ],
      [
        5,
        5,
        5,
        5,
        4,
        2
      ],
      [
        1,
        3,
        2,
        4,
        4,
        1
      ],
      [
        4,
        3,
        3,
        1,
        5,
        2
      ],
      [
        1,
        4,
        1,
        3,
        5,
        2
      ],
      [
        3,
        1,
        4,
        5,
        4,
        5
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Crossroads Trial",
    "phase": "Crossroads",
    "w": 6,
    "h": 6,
    "start": [
      5,
      0
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        1,
        1,
        4,
        5,
        2
      ],
      [
        4,
        3,
        4,
        4,
        2,
        4
      ],
      [
        4,
        3,
        2,
        4,
        4,
        3
      ],
      [
        4,
        4,
        2,
        5,
        3,
        4
      ],
      [
        3,
        4,
        2,
        2,
        5,
        3
      ],
      [
        4,
        2,
        1,
        1,
        3,
        2
      ]
    ],
    "optimal": 7
  },
  {
    "name": "The Trench",
    "phase": "The Chasm I",
    "w": 5,
    "h": 5,
    "start": [
      0,
      0
    ],
    "goal": [
      4,
      4
    ],
    "grid": [
      [
        1,
        2,
        2,
        3,
        1
      ],
      [
        1,
        2,
        3,
        4,
        1
      ],
      [
        1,
        2,
        4,
        0,
        3
      ],
      [
        3,
        3,
        1,
        1,
        1
      ],
      [
        0,
        0,
        4,
        3,
        1
      ]
    ],
    "optimal": 5
  },
  {
    "name": "The Gap",
    "phase": "The Chasm I",
    "w": 5,
    "h": 5,
    "start": [
      4,
      0
    ],
    "goal": [
      0,
      4
    ],
    "grid": [
      [
        1,
        4,
        1,
        4,
        1
      ],
      [
        0,
        3,
        0,
        2,
        3
      ],
      [
        1,
        1,
        1,
        0,
        0
      ],
      [
        1,
        4,
        0,
        2,
        4
      ],
      [
        2,
        2,
        4,
        1,
        4
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Single Island",
    "phase": "The Chasm I",
    "w": 5,
    "h": 5,
    "start": [
      2,
      2
    ],
    "goal": [
      4,
      0
    ],
    "grid": [
      [
        2,
        4,
        3,
        1,
        3
      ],
      [
        2,
        2,
        3,
        2,
        3
      ],
      [
        3,
        3,
        2,
        1,
        1
      ],
      [
        3,
        4,
        1,
        3,
        2
      ],
      [
        1,
        1,
        4,
        3,
        1
      ]
    ],
    "optimal": 5
  },
  {
    "name": "Leap Across",
    "phase": "The Chasm I",
    "w": 5,
    "h": 5,
    "start": [
      0,
      4
    ],
    "goal": [
      4,
      0
    ],
    "grid": [
      [
        0,
        3,
        4,
        3,
        3
      ],
      [
        2,
        1,
        4,
        4,
        2
      ],
      [
        2,
        3,
        1,
        4,
        2
      ],
      [
        1,
        4,
        3,
        4,
        1
      ],
      [
        1,
        2,
        2,
        0,
        1
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Twin Chasms",
    "phase": "The Chasm I",
    "w": 5,
    "h": 5,
    "start": [
      0,
      0
    ],
    "goal": [
      2,
      2
    ],
    "grid": [
      [
        1,
        0,
        2,
        1,
        4
      ],
      [
        1,
        4,
        1,
        1,
        0
      ],
      [
        1,
        2,
        1,
        0,
        0
      ],
      [
        2,
        2,
        4,
        1,
        2
      ],
      [
        4,
        1,
        3,
        1,
        0
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Divided Board",
    "phase": "The Chasm I",
    "w": 5,
    "h": 5,
    "start": [
      2,
      0
    ],
    "goal": [
      2,
      4
    ],
    "grid": [
      [
        4,
        4,
        4,
        1,
        3
      ],
      [
        3,
        0,
        0,
        0,
        4
      ],
      [
        1,
        2,
        1,
        0,
        1
      ],
      [
        2,
        4,
        3,
        2,
        1
      ],
      [
        4,
        0,
        0,
        0,
        4
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Hollow Bridge",
    "phase": "The Chasm I",
    "w": 5,
    "h": 5,
    "start": [
      4,
      4
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        4,
        3,
        2,
        1
      ],
      [
        2,
        3,
        3,
        2,
        2
      ],
      [
        2,
        1,
        4,
        4,
        3
      ],
      [
        3,
        4,
        2,
        1,
        2
      ],
      [
        0,
        1,
        0,
        4,
        4
      ]
    ],
    "optimal": 6
  },
  {
    "name": "River of Voids",
    "phase": "The Chasm I",
    "w": 6,
    "h": 6,
    "start": [
      0,
      3
    ],
    "goal": [
      5,
      3
    ],
    "grid": [
      [
        3,
        2,
        1,
        1,
        4,
        1
      ],
      [
        0,
        1,
        0,
        1,
        2,
        0
      ],
      [
        0,
        2,
        3,
        2,
        0,
        5
      ],
      [
        3,
        1,
        0,
        0,
        2,
        2
      ],
      [
        3,
        0,
        2,
        0,
        5,
        3
      ],
      [
        3,
        2,
        0,
        1,
        4,
        1
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Island Hopper",
    "phase": "The Chasm I",
    "w": 6,
    "h": 6,
    "start": [
      5,
      3
    ],
    "goal": [
      3,
      3
    ],
    "grid": [
      [
        1,
        4,
        4,
        5,
        4,
        2
      ],
      [
        2,
        0,
        1,
        5,
        0,
        1
      ],
      [
        0,
        2,
        2,
        3,
        0,
        4
      ],
      [
        0,
        5,
        5,
        1,
        3,
        2
      ],
      [
        3,
        0,
        1,
        1,
        5,
        5
      ],
      [
        4,
        3,
        1,
        3,
        3,
        3
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Chasm Crossing",
    "phase": "The Chasm I",
    "w": 6,
    "h": 6,
    "start": [
      5,
      0
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        4,
        3,
        3,
        1,
        0
      ],
      [
        4,
        4,
        1,
        1,
        1,
        0
      ],
      [
        3,
        2,
        0,
        3,
        1,
        3
      ],
      [
        4,
        3,
        3,
        1,
        0,
        3
      ],
      [
        5,
        0,
        3,
        1,
        1,
        0
      ],
      [
        1,
        4,
        1,
        2,
        3,
        3
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Archipelago",
    "phase": "The Chasm II",
    "w": 6,
    "h": 6,
    "start": [
      0,
      0
    ],
    "goal": [
      5,
      5
    ],
    "grid": [
      [
        5,
        0,
        3,
        1,
        5,
        4
      ],
      [
        3,
        1,
        1,
        3,
        5,
        3
      ],
      [
        1,
        1,
        4,
        0,
        5,
        2
      ],
      [
        2,
        2,
        4,
        0,
        4,
        0
      ],
      [
        3,
        3,
        1,
        0,
        4,
        4
      ],
      [
        0,
        0,
        3,
        5,
        1,
        1
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Deep Abyss",
    "phase": "The Chasm II",
    "w": 6,
    "h": 6,
    "start": [
      5,
      0
    ],
    "goal": [
      0,
      5
    ],
    "grid": [
      [
        3,
        4,
        0,
        5,
        1,
        1
      ],
      [
        2,
        0,
        1,
        5,
        1,
        0
      ],
      [
        5,
        4,
        5,
        0,
        2,
        3
      ],
      [
        4,
        4,
        1,
        5,
        1,
        2
      ],
      [
        3,
        4,
        4,
        5,
        1,
        0
      ],
      [
        1,
        4,
        1,
        5,
        5,
        0
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Precision Leap",
    "phase": "The Chasm II",
    "w": 6,
    "h": 6,
    "start": [
      3,
      3
    ],
    "goal": [
      5,
      0
    ],
    "grid": [
      [
        4,
        1,
        0,
        5,
        3,
        5
      ],
      [
        2,
        5,
        3,
        0,
        4,
        4
      ],
      [
        4,
        2,
        4,
        5,
        4,
        1
      ],
      [
        1,
        3,
        1,
        1,
        1,
        4
      ],
      [
        1,
        0,
        0,
        2,
        0,
        2
      ],
      [
        1,
        5,
        5,
        5,
        0,
        3
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Void Maze",
    "phase": "The Chasm II",
    "w": 6,
    "h": 6,
    "start": [
      0,
      5
    ],
    "goal": [
      5,
      0
    ],
    "grid": [
      [
        3,
        2,
        1,
        1,
        3,
        4
      ],
      [
        3,
        3,
        2,
        2,
        0,
        3
      ],
      [
        5,
        1,
        4,
        5,
        2,
        5
      ],
      [
        5,
        5,
        2,
        4,
        2,
        1
      ],
      [
        4,
        0,
        4,
        2,
        5,
        2
      ],
      [
        1,
        0,
        3,
        4,
        2,
        5
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Broken Causeway",
    "phase": "The Chasm II",
    "w": 6,
    "h": 6,
    "start": [
      0,
      0
    ],
    "goal": [
      3,
      3
    ],
    "grid": [
      [
        1,
        4,
        2,
        1,
        0,
        4
      ],
      [
        0,
        1,
        2,
        2,
        5,
        2
      ],
      [
        0,
        1,
        1,
        5,
        4,
        3
      ],
      [
        4,
        3,
        1,
        1,
        5,
        0
      ],
      [
        0,
        1,
        4,
        5,
        1,
        5
      ],
      [
        5,
        0,
        1,
        4,
        2,
        2
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Stepping Stones",
    "phase": "The Chasm II",
    "w": 6,
    "h": 6,
    "start": [
      3,
      0
    ],
    "goal": [
      3,
      5
    ],
    "grid": [
      [
        2,
        1,
        1,
        4,
        4,
        0
      ],
      [
        4,
        3,
        2,
        3,
        4,
        3
      ],
      [
        0,
        4,
        5,
        2,
        1,
        4
      ],
      [
        1,
        3,
        1,
        3,
        0,
        1
      ],
      [
        4,
        1,
        1,
        5,
        4,
        4
      ],
      [
        3,
        3,
        0,
        4,
        1,
        2
      ]
    ],
    "optimal": 7
  },
  {
    "name": "The Outer Rift",
    "phase": "The Chasm II",
    "w": 6,
    "h": 6,
    "start": [
      5,
      5
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        0,
        1,
        2,
        0,
        5
      ],
      [
        2,
        2,
        4,
        0,
        5,
        0
      ],
      [
        3,
        5,
        5,
        5,
        5,
        3
      ],
      [
        1,
        4,
        2,
        1,
        2,
        2
      ],
      [
        0,
        1,
        1,
        2,
        2,
        4
      ],
      [
        1,
        2,
        4,
        0,
        3,
        4
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Dual Shores",
    "phase": "The Chasm II",
    "w": 6,
    "h": 6,
    "start": [
      0,
      3
    ],
    "goal": [
      5,
      3
    ],
    "grid": [
      [
        0,
        3,
        2,
        1,
        0,
        5
      ],
      [
        0,
        0,
        2,
        1,
        2,
        2
      ],
      [
        2,
        0,
        3,
        0,
        4,
        5
      ],
      [
        1,
        3,
        5,
        5,
        1,
        2
      ],
      [
        1,
        2,
        4,
        1,
        2,
        3
      ],
      [
        5,
        0,
        5,
        1,
        3,
        0
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Void Labyrinth",
    "phase": "The Chasm II",
    "w": 6,
    "h": 6,
    "start": [
      5,
      3
    ],
    "goal": [
      3,
      3
    ],
    "grid": [
      [
        1,
        4,
        1,
        5,
        1,
        3
      ],
      [
        5,
        2,
        4,
        4,
        1,
        3
      ],
      [
        2,
        3,
        1,
        0,
        2,
        2
      ],
      [
        1,
        3,
        3,
        1,
        4,
        3
      ],
      [
        5,
        0,
        4,
        1,
        1,
        5
      ],
      [
        2,
        4,
        1,
        3,
        3,
        1
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Chasm Apex",
    "phase": "The Chasm II",
    "w": 6,
    "h": 6,
    "start": [
      5,
      0
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        2,
        1,
        1,
        4,
        2
      ],
      [
        3,
        0,
        1,
        3,
        5,
        3
      ],
      [
        3,
        4,
        2,
        2,
        2,
        2
      ],
      [
        0,
        1,
        5,
        0,
        0,
        2
      ],
      [
        5,
        3,
        3,
        3,
        5,
        3
      ],
      [
        4,
        4,
        2,
        2,
        4,
        0
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Labyrinth Entry",
    "phase": "Labyrinth I",
    "w": 6,
    "h": 6,
    "start": [
      0,
      0
    ],
    "goal": [
      5,
      5
    ],
    "grid": [
      [
        3,
        1,
        4,
        2,
        4,
        2
      ],
      [
        3,
        5,
        1,
        3,
        2,
        3
      ],
      [
        4,
        2,
        2,
        3,
        3,
        2
      ],
      [
        1,
        4,
        3,
        5,
        5,
        3
      ],
      [
        5,
        3,
        2,
        1,
        5,
        2
      ],
      [
        3,
        2,
        3,
        3,
        2,
        1
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Dense Grid",
    "phase": "Labyrinth I",
    "w": 6,
    "h": 6,
    "start": [
      5,
      0
    ],
    "goal": [
      0,
      5
    ],
    "grid": [
      [
        3,
        1,
        4,
        4,
        1,
        1
      ],
      [
        2,
        1,
        1,
        3,
        4,
        5
      ],
      [
        1,
        2,
        3,
        5,
        4,
        2
      ],
      [
        1,
        1,
        4,
        5,
        5,
        5
      ],
      [
        5,
        4,
        5,
        3,
        3,
        3
      ],
      [
        3,
        5,
        1,
        4,
        5,
        1
      ]
    ],
    "optimal": 6
  },
  {
    "name": "Geometric Lock",
    "phase": "Labyrinth I",
    "w": 6,
    "h": 6,
    "start": [
      3,
      3
    ],
    "goal": [
      5,
      0
    ],
    "grid": [
      [
        3,
        3,
        3,
        5,
        2,
        2
      ],
      [
        1,
        2,
        4,
        2,
        5,
        5
      ],
      [
        3,
        4,
        5,
        5,
        4,
        4
      ],
      [
        2,
        5,
        5,
        1,
        5,
        5
      ],
      [
        2,
        1,
        4,
        1,
        5,
        3
      ],
      [
        1,
        2,
        3,
        2,
        1,
        1
      ]
    ],
    "optimal": 8
  },
  {
    "name": "The Long Turn",
    "phase": "Labyrinth I",
    "w": 6,
    "h": 6,
    "start": [
      0,
      5
    ],
    "goal": [
      5,
      0
    ],
    "grid": [
      [
        1,
        1,
        5,
        4,
        4,
        5
      ],
      [
        2,
        3,
        3,
        2,
        5,
        5
      ],
      [
        3,
        2,
        4,
        3,
        4,
        3
      ],
      [
        3,
        2,
        3,
        3,
        4,
        5
      ],
      [
        2,
        2,
        3,
        2,
        1,
        1
      ],
      [
        1,
        5,
        5,
        5,
        4,
        3
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Tangled Lines",
    "phase": "Labyrinth I",
    "w": 6,
    "h": 6,
    "start": [
      0,
      0
    ],
    "goal": [
      3,
      3
    ],
    "grid": [
      [
        3,
        2,
        5,
        5,
        3,
        5
      ],
      [
        4,
        1,
        2,
        4,
        2,
        3
      ],
      [
        5,
        2,
        5,
        1,
        3,
        2
      ],
      [
        2,
        1,
        5,
        1,
        4,
        4
      ],
      [
        4,
        5,
        2,
        4,
        4,
        1
      ],
      [
        1,
        5,
        4,
        5,
        3,
        3
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Outer Bounds",
    "phase": "Labyrinth I",
    "w": 6,
    "h": 6,
    "start": [
      3,
      0
    ],
    "goal": [
      3,
      5
    ],
    "grid": [
      [
        5,
        4,
        2,
        2,
        5,
        2
      ],
      [
        5,
        3,
        3,
        1,
        4,
        2
      ],
      [
        1,
        1,
        2,
        2,
        1,
        2
      ],
      [
        4,
        5,
        4,
        3,
        3,
        1
      ],
      [
        5,
        3,
        3,
        2,
        2,
        1
      ],
      [
        2,
        2,
        3,
        4,
        4,
        2
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Inner Nexus",
    "phase": "Labyrinth I",
    "w": 7,
    "h": 7,
    "start": [
      6,
      6
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        4,
        5,
        5,
        1,
        2,
        3
      ],
      [
        4,
        3,
        2,
        2,
        3,
        4,
        1
      ],
      [
        1,
        5,
        5,
        3,
        5,
        4,
        1
      ],
      [
        2,
        2,
        2,
        4,
        3,
        1,
        2
      ],
      [
        4,
        4,
        4,
        3,
        2,
        2,
        3
      ],
      [
        3,
        3,
        5,
        1,
        2,
        5,
        4
      ],
      [
        4,
        2,
        4,
        1,
        4,
        1,
        4
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Threaded Leaps",
    "phase": "Labyrinth I",
    "w": 7,
    "h": 7,
    "start": [
      0,
      3
    ],
    "goal": [
      6,
      3
    ],
    "grid": [
      [
        2,
        3,
        4,
        5,
        4,
        2,
        2
      ],
      [
        4,
        2,
        5,
        3,
        2,
        1,
        4
      ],
      [
        2,
        1,
        1,
        3,
        2,
        3,
        1
      ],
      [
        2,
        1,
        4,
        1,
        3,
        1,
        2
      ],
      [
        5,
        1,
        5,
        5,
        5,
        1,
        1
      ],
      [
        3,
        1,
        5,
        3,
        4,
        3,
        3
      ],
      [
        5,
        3,
        2,
        1,
        2,
        3,
        3
      ]
    ],
    "optimal": 8
  },
  {
    "name": "The False 5",
    "phase": "Labyrinth I",
    "w": 7,
    "h": 7,
    "start": [
      6,
      3
    ],
    "goal": [
      3,
      3
    ],
    "grid": [
      [
        5,
        4,
        1,
        4,
        1,
        2,
        2
      ],
      [
        5,
        1,
        3,
        4,
        1,
        5,
        2
      ],
      [
        2,
        4,
        2,
        5,
        3,
        5,
        4
      ],
      [
        1,
        5,
        5,
        1,
        5,
        2,
        4
      ],
      [
        4,
        5,
        2,
        2,
        4,
        4,
        5
      ],
      [
        5,
        2,
        2,
        4,
        4,
        2,
        4
      ],
      [
        2,
        3,
        3,
        1,
        5,
        5,
        3
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Labyrinth Core",
    "phase": "Labyrinth I",
    "w": 7,
    "h": 7,
    "start": [
      6,
      0
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        2,
        2,
        1,
        3,
        2,
        3
      ],
      [
        4,
        2,
        1,
        3,
        5,
        5,
        1
      ],
      [
        1,
        4,
        2,
        3,
        5,
        2,
        2
      ],
      [
        5,
        2,
        5,
        4,
        3,
        4,
        4
      ],
      [
        2,
        4,
        3,
        1,
        2,
        4,
        1
      ],
      [
        2,
        1,
        2,
        3,
        4,
        2,
        4
      ],
      [
        5,
        4,
        1,
        3,
        4,
        3,
        2
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Seven Seas",
    "phase": "Labyrinth II",
    "w": 7,
    "h": 7,
    "start": [
      0,
      0
    ],
    "goal": [
      6,
      6
    ],
    "grid": [
      [
        5,
        4,
        1,
        1,
        4,
        2,
        3
      ],
      [
        1,
        3,
        3,
        4,
        5,
        4,
        1
      ],
      [
        1,
        2,
        2,
        1,
        4,
        5,
        1
      ],
      [
        2,
        4,
        2,
        2,
        1,
        4,
        5
      ],
      [
        4,
        2,
        4,
        1,
        3,
        1,
        1
      ],
      [
        5,
        3,
        2,
        5,
        5,
        4,
        4
      ],
      [
        1,
        2,
        5,
        3,
        1,
        2,
        1
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Expansive Field",
    "phase": "Labyrinth II",
    "w": 7,
    "h": 7,
    "start": [
      6,
      0
    ],
    "goal": [
      0,
      6
    ],
    "grid": [
      [
        2,
        2,
        5,
        3,
        5,
        4,
        1
      ],
      [
        1,
        4,
        3,
        2,
        5,
        5,
        4
      ],
      [
        1,
        5,
        4,
        4,
        5,
        4,
        3
      ],
      [
        5,
        4,
        1,
        2,
        1,
        1,
        5
      ],
      [
        3,
        1,
        4,
        4,
        3,
        5,
        3
      ],
      [
        2,
        2,
        4,
        4,
        2,
        1,
        1
      ],
      [
        3,
        5,
        2,
        3,
        3,
        5,
        3
      ]
    ],
    "optimal": 7
  },
  {
    "name": "Deep Threading",
    "phase": "Labyrinth II",
    "w": 7,
    "h": 7,
    "start": [
      3,
      3
    ],
    "goal": [
      6,
      0
    ],
    "grid": [
      [
        1,
        4,
        2,
        5,
        1,
        4,
        4
      ],
      [
        2,
        2,
        4,
        2,
        3,
        1,
        4
      ],
      [
        1,
        2,
        2,
        2,
        3,
        2,
        3
      ],
      [
        2,
        4,
        1,
        3,
        3,
        5,
        1
      ],
      [
        4,
        3,
        1,
        1,
        1,
        3,
        4
      ],
      [
        2,
        4,
        4,
        2,
        2,
        2,
        3
      ],
      [
        1,
        1,
        3,
        4,
        3,
        1,
        5
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Perimeter Walk",
    "phase": "Labyrinth II",
    "w": 7,
    "h": 7,
    "start": [
      0,
      6
    ],
    "goal": [
      6,
      0
    ],
    "grid": [
      [
        1,
        3,
        1,
        3,
        5,
        4,
        1
      ],
      [
        3,
        2,
        1,
        1,
        1,
        2,
        5
      ],
      [
        1,
        2,
        5,
        2,
        1,
        4,
        5
      ],
      [
        5,
        4,
        4,
        1,
        4,
        2,
        1
      ],
      [
        2,
        2,
        5,
        4,
        1,
        4,
        2
      ],
      [
        3,
        4,
        4,
        4,
        3,
        3,
        3
      ],
      [
        1,
        4,
        4,
        5,
        4,
        3,
        3
      ]
    ],
    "optimal": 8
  },
  {
    "name": "The Wide Sweep",
    "phase": "Labyrinth II",
    "w": 7,
    "h": 7,
    "start": [
      0,
      0
    ],
    "goal": [
      3,
      3
    ],
    "grid": [
      [
        5,
        2,
        2,
        2,
        4,
        4,
        2
      ],
      [
        5,
        4,
        4,
        1,
        5,
        5,
        3
      ],
      [
        3,
        2,
        1,
        2,
        5,
        1,
        4
      ],
      [
        4,
        3,
        5,
        1,
        3,
        5,
        3
      ],
      [
        2,
        1,
        3,
        2,
        4,
        3,
        1
      ],
      [
        5,
        1,
        1,
        5,
        4,
        5,
        2
      ],
      [
        1,
        1,
        4,
        1,
        5,
        2,
        1
      ]
    ],
    "optimal": 8
  },
  {
    "name": "High Stakes",
    "phase": "Labyrinth II",
    "w": 7,
    "h": 7,
    "start": [
      3,
      0
    ],
    "goal": [
      3,
      6
    ],
    "grid": [
      [
        5,
        3,
        2,
        2,
        3,
        3,
        5
      ],
      [
        2,
        1,
        2,
        2,
        4,
        1,
        1
      ],
      [
        2,
        4,
        5,
        2,
        5,
        2,
        5
      ],
      [
        1,
        3,
        4,
        5,
        1,
        4,
        1
      ],
      [
        5,
        5,
        1,
        5,
        1,
        2,
        5
      ],
      [
        5,
        1,
        5,
        4,
        4,
        2,
        1
      ],
      [
        5,
        2,
        4,
        3,
        5,
        5,
        5
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Centrifugal",
    "phase": "Labyrinth II",
    "w": 7,
    "h": 7,
    "start": [
      6,
      6
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        4,
        2,
        1,
        1,
        4,
        2
      ],
      [
        5,
        4,
        4,
        3,
        4,
        2,
        5
      ],
      [
        1,
        5,
        5,
        3,
        1,
        1,
        3
      ],
      [
        4,
        3,
        1,
        3,
        2,
        4,
        3
      ],
      [
        3,
        5,
        4,
        2,
        4,
        5,
        2
      ],
      [
        3,
        4,
        4,
        3,
        4,
        3,
        1
      ],
      [
        1,
        2,
        5,
        2,
        1,
        1,
        5
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Silent Trap",
    "phase": "Labyrinth II",
    "w": 7,
    "h": 7,
    "start": [
      0,
      3
    ],
    "goal": [
      6,
      3
    ],
    "grid": [
      [
        1,
        1,
        1,
        1,
        5,
        4,
        4
      ],
      [
        4,
        6,
        2,
        4,
        1,
        1,
        6
      ],
      [
        1,
        1,
        4,
        1,
        6,
        2,
        3
      ],
      [
        5,
        4,
        1,
        2,
        5,
        5,
        5
      ],
      [
        6,
        4,
        6,
        1,
        1,
        6,
        3
      ],
      [
        2,
        4,
        3,
        2,
        3,
        6,
        6
      ],
      [
        3,
        4,
        4,
        1,
        2,
        2,
        5
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Long Range",
    "phase": "Labyrinth II",
    "w": 7,
    "h": 7,
    "start": [
      6,
      3
    ],
    "goal": [
      3,
      3
    ],
    "grid": [
      [
        4,
        1,
        6,
        5,
        6,
        6,
        6
      ],
      [
        6,
        2,
        6,
        1,
        1,
        1,
        4
      ],
      [
        4,
        6,
        6,
        3,
        5,
        5,
        5
      ],
      [
        2,
        4,
        1,
        1,
        6,
        2,
        2
      ],
      [
        4,
        5,
        4,
        4,
        6,
        1,
        3
      ],
      [
        4,
        6,
        5,
        4,
        1,
        1,
        4
      ],
      [
        1,
        2,
        4,
        4,
        3,
        3,
        6
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Labyrinth Apex",
    "phase": "Labyrinth II",
    "w": 7,
    "h": 7,
    "start": [
      6,
      0
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        3,
        2,
        1,
        5,
        1,
        3
      ],
      [
        3,
        6,
        3,
        4,
        4,
        2,
        6
      ],
      [
        5,
        3,
        1,
        6,
        3,
        6,
        6
      ],
      [
        2,
        6,
        5,
        5,
        1,
        5,
        1
      ],
      [
        5,
        6,
        4,
        4,
        2,
        2,
        4
      ],
      [
        2,
        6,
        2,
        3,
        5,
        2,
        3
      ],
      [
        1,
        6,
        6,
        4,
        6,
        2,
        6
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Citadel Gates",
    "phase": "The Citadel",
    "w": 7,
    "h": 7,
    "start": [
      0,
      0
    ],
    "goal": [
      6,
      6
    ],
    "grid": [
      [
        6,
        4,
        3,
        3,
        4,
        2,
        2
      ],
      [
        3,
        5,
        1,
        3,
        3,
        5,
        5
      ],
      [
        2,
        4,
        3,
        4,
        6,
        2,
        3
      ],
      [
        3,
        2,
        1,
        4,
        3,
        3,
        5
      ],
      [
        4,
        4,
        6,
        6,
        1,
        2,
        1
      ],
      [
        5,
        4,
        3,
        3,
        5,
        3,
        3
      ],
      [
        2,
        4,
        2,
        1,
        6,
        3,
        1
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Outer Wall",
    "phase": "The Citadel",
    "w": 7,
    "h": 7,
    "start": [
      6,
      0
    ],
    "goal": [
      0,
      6
    ],
    "grid": [
      [
        3,
        1,
        2,
        6,
        2,
        6,
        1
      ],
      [
        1,
        1,
        1,
        3,
        4,
        3,
        1
      ],
      [
        3,
        2,
        5,
        5,
        6,
        6,
        5
      ],
      [
        6,
        6,
        3,
        3,
        3,
        1,
        6
      ],
      [
        6,
        2,
        6,
        5,
        3,
        4,
        1
      ],
      [
        6,
        5,
        6,
        3,
        2,
        2,
        4
      ],
      [
        3,
        2,
        3,
        2,
        3,
        2,
        3
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Bastion Step",
    "phase": "The Citadel",
    "w": 7,
    "h": 7,
    "start": [
      3,
      3
    ],
    "goal": [
      6,
      0
    ],
    "grid": [
      [
        5,
        2,
        6,
        1,
        6,
        3,
        2
      ],
      [
        6,
        1,
        5,
        3,
        5,
        5,
        1
      ],
      [
        5,
        5,
        1,
        5,
        4,
        4,
        5
      ],
      [
        3,
        4,
        6,
        2,
        4,
        4,
        1
      ],
      [
        6,
        4,
        2,
        6,
        4,
        4,
        2
      ],
      [
        6,
        5,
        4,
        4,
        3,
        1,
        5
      ],
      [
        1,
        5,
        1,
        2,
        3,
        1,
        3
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Inner Keep",
    "phase": "The Citadel",
    "w": 7,
    "h": 7,
    "start": [
      0,
      6
    ],
    "goal": [
      6,
      0
    ],
    "grid": [
      [
        3,
        5,
        3,
        1,
        4,
        2,
        5
      ],
      [
        4,
        5,
        1,
        2,
        4,
        2,
        1
      ],
      [
        5,
        3,
        5,
        5,
        1,
        6,
        1
      ],
      [
        2,
        6,
        2,
        5,
        4,
        6,
        6
      ],
      [
        2,
        2,
        6,
        2,
        4,
        1,
        1
      ],
      [
        6,
        1,
        3,
        3,
        6,
        6,
        6
      ],
      [
        1,
        3,
        6,
        2,
        1,
        1,
        4
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Watchtower",
    "phase": "The Citadel",
    "w": 8,
    "h": 8,
    "start": [
      0,
      0
    ],
    "goal": [
      4,
      4
    ],
    "grid": [
      [
        5,
        6,
        5,
        2,
        1,
        6,
        6,
        3
      ],
      [
        1,
        1,
        5,
        1,
        1,
        1,
        1,
        1
      ],
      [
        2,
        3,
        2,
        4,
        5,
        4,
        2,
        2
      ],
      [
        1,
        3,
        2,
        5,
        6,
        1,
        1,
        5
      ],
      [
        5,
        4,
        2,
        3,
        1,
        6,
        6,
        1
      ],
      [
        6,
        6,
        2,
        3,
        3,
        6,
        5,
        5
      ],
      [
        5,
        5,
        4,
        5,
        3,
        6,
        4,
        4
      ],
      [
        4,
        1,
        4,
        5,
        3,
        3,
        6,
        5
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Stone Lattice",
    "phase": "The Citadel",
    "w": 8,
    "h": 8,
    "start": [
      4,
      0
    ],
    "goal": [
      4,
      7
    ],
    "grid": [
      [
        5,
        6,
        6,
        4,
        6,
        2,
        1,
        6
      ],
      [
        1,
        6,
        5,
        5,
        2,
        3,
        5,
        1
      ],
      [
        4,
        6,
        1,
        1,
        1,
        5,
        1,
        5
      ],
      [
        1,
        4,
        4,
        3,
        2,
        2,
        1,
        2
      ],
      [
        1,
        5,
        5,
        1,
        2,
        5,
        5,
        1
      ],
      [
        2,
        1,
        5,
        6,
        4,
        3,
        6,
        3
      ],
      [
        5,
        5,
        1,
        3,
        5,
        1,
        6,
        3
      ],
      [
        4,
        3,
        6,
        2,
        5,
        4,
        2,
        2
      ]
    ],
    "optimal": 8
  },
  {
    "name": "High Walk",
    "phase": "The Citadel",
    "w": 8,
    "h": 8,
    "start": [
      7,
      7
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        3,
        6,
        1,
        4,
        2,
        3,
        4
      ],
      [
        5,
        1,
        3,
        6,
        1,
        1,
        2,
        4
      ],
      [
        3,
        1,
        3,
        5,
        5,
        1,
        4,
        3
      ],
      [
        6,
        6,
        3,
        4,
        6,
        6,
        4,
        2
      ],
      [
        2,
        1,
        2,
        2,
        5,
        5,
        3,
        2
      ],
      [
        2,
        6,
        1,
        6,
        1,
        3,
        6,
        3
      ],
      [
        5,
        5,
        4,
        5,
        3,
        3,
        5,
        3
      ],
      [
        2,
        4,
        1,
        4,
        5,
        3,
        6,
        6
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Courtyard",
    "phase": "The Citadel",
    "w": 8,
    "h": 8,
    "start": [
      0,
      4
    ],
    "goal": [
      7,
      4
    ],
    "grid": [
      [
        3,
        2,
        5,
        5,
        2,
        6,
        2,
        6
      ],
      [
        4,
        3,
        2,
        5,
        5,
        2,
        3,
        6
      ],
      [
        4,
        4,
        4,
        6,
        3,
        3,
        5,
        6
      ],
      [
        5,
        6,
        3,
        5,
        4,
        3,
        3,
        6
      ],
      [
        1,
        4,
        5,
        4,
        6,
        4,
        2,
        1
      ],
      [
        3,
        2,
        6,
        3,
        3,
        2,
        2,
        4
      ],
      [
        1,
        4,
        5,
        5,
        3,
        5,
        1,
        4
      ],
      [
        3,
        5,
        1,
        5,
        1,
        5,
        4,
        5
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Fortress Loop",
    "phase": "The Citadel",
    "w": 8,
    "h": 8,
    "start": [
      7,
      4
    ],
    "goal": [
      4,
      4
    ],
    "grid": [
      [
        4,
        1,
        4,
        1,
        4,
        4,
        2,
        5
      ],
      [
        4,
        3,
        4,
        5,
        4,
        3,
        3,
        5
      ],
      [
        1,
        2,
        3,
        2,
        6,
        6,
        1,
        4
      ],
      [
        5,
        2,
        1,
        2,
        6,
        4,
        2,
        4
      ],
      [
        3,
        5,
        3,
        6,
        1,
        4,
        6,
        1
      ],
      [
        1,
        2,
        3,
        3,
        2,
        4,
        2,
        5
      ],
      [
        6,
        2,
        1,
        5,
        6,
        4,
        1,
        3
      ],
      [
        4,
        5,
        4,
        1,
        4,
        4,
        1,
        5
      ]
    ],
    "optimal": 10
  },
  {
    "name": "Citadel Crown",
    "phase": "The Citadel",
    "w": 8,
    "h": 8,
    "start": [
      7,
      0
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        6,
        4,
        2,
        5,
        3,
        4,
        2
      ],
      [
        6,
        2,
        4,
        3,
        6,
        1,
        5,
        6
      ],
      [
        2,
        4,
        2,
        6,
        4,
        6,
        3,
        1
      ],
      [
        1,
        2,
        5,
        4,
        2,
        4,
        2,
        3
      ],
      [
        3,
        3,
        6,
        4,
        2,
        3,
        5,
        5
      ],
      [
        2,
        4,
        4,
        5,
        3,
        2,
        1,
        3
      ],
      [
        2,
        1,
        3,
        2,
        2,
        5,
        3,
        5
      ],
      [
        1,
        6,
        4,
        2,
        2,
        5,
        5,
        6
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Master Opening",
    "phase": "Grand Master",
    "w": 8,
    "h": 8,
    "start": [
      0,
      0
    ],
    "goal": [
      7,
      7
    ],
    "grid": [
      [
        6,
        5,
        2,
        4,
        5,
        1,
        6,
        6
      ],
      [
        6,
        5,
        4,
        5,
        3,
        4,
        5,
        2
      ],
      [
        3,
        2,
        4,
        3,
        1,
        5,
        6,
        4
      ],
      [
        1,
        4,
        2,
        6,
        3,
        3,
        6,
        5
      ],
      [
        3,
        2,
        5,
        1,
        3,
        4,
        5,
        1
      ],
      [
        6,
        4,
        3,
        5,
        5,
        3,
        6,
        6
      ],
      [
        6,
        5,
        3,
        3,
        1,
        5,
        4,
        5
      ],
      [
        1,
        6,
        5,
        6,
        3,
        2,
        4,
        1
      ]
    ],
    "optimal": 8
  },
  {
    "name": "Eight by Eight",
    "phase": "Grand Master",
    "w": 8,
    "h": 8,
    "start": [
      7,
      0
    ],
    "goal": [
      0,
      7
    ],
    "grid": [
      [
        6,
        6,
        1,
        5,
        6,
        4,
        3,
        1
      ],
      [
        4,
        2,
        6,
        6,
        4,
        3,
        4,
        6
      ],
      [
        3,
        6,
        4,
        3,
        4,
        4,
        4,
        5
      ],
      [
        6,
        4,
        2,
        4,
        6,
        4,
        5,
        3
      ],
      [
        2,
        5,
        6,
        6,
        3,
        3,
        2,
        2
      ],
      [
        6,
        4,
        6,
        4,
        6,
        6,
        5,
        2
      ],
      [
        4,
        2,
        1,
        5,
        5,
        2,
        1,
        4
      ],
      [
        6,
        5,
        6,
        3,
        1,
        1,
        6,
        1
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Grand Traverse",
    "phase": "Grand Master",
    "w": 8,
    "h": 8,
    "start": [
      4,
      4
    ],
    "goal": [
      7,
      0
    ],
    "grid": [
      [
        3,
        1,
        5,
        3,
        2,
        1,
        4,
        1
      ],
      [
        5,
        5,
        4,
        5,
        1,
        5,
        4,
        2
      ],
      [
        5,
        1,
        2,
        4,
        5,
        2,
        1,
        2
      ],
      [
        2,
        4,
        4,
        1,
        3,
        1,
        5,
        6
      ],
      [
        5,
        1,
        1,
        3,
        4,
        6,
        4,
        3
      ],
      [
        6,
        5,
        2,
        5,
        1,
        2,
        1,
        1
      ],
      [
        4,
        1,
        6,
        6,
        3,
        6,
        4,
        2
      ],
      [
        1,
        5,
        3,
        2,
        6,
        3,
        6,
        6
      ]
    ],
    "optimal": 9
  },
  {
    "name": "The Iron Maze",
    "phase": "Grand Master",
    "w": 8,
    "h": 8,
    "start": [
      0,
      7
    ],
    "goal": [
      7,
      0
    ],
    "grid": [
      [
        4,
        5,
        3,
        3,
        1,
        1,
        2,
        5
      ],
      [
        4,
        1,
        5,
        2,
        5,
        6,
        5,
        1
      ],
      [
        4,
        4,
        3,
        6,
        4,
        6,
        3,
        2
      ],
      [
        6,
        2,
        1,
        6,
        1,
        4,
        6,
        3
      ],
      [
        5,
        3,
        4,
        3,
        5,
        1,
        3,
        2
      ],
      [
        4,
        5,
        5,
        5,
        5,
        6,
        6,
        2
      ],
      [
        6,
        2,
        6,
        6,
        4,
        2,
        6,
        2
      ],
      [
        1,
        1,
        2,
        5,
        6,
        6,
        2,
        3
      ]
    ],
    "optimal": 9
  },
  {
    "name": "Calculated Leap",
    "phase": "Grand Master",
    "w": 8,
    "h": 8,
    "start": [
      0,
      0
    ],
    "goal": [
      4,
      4
    ],
    "grid": [
      [
        3,
        6,
        6,
        6,
        5,
        2,
        2,
        4
      ],
      [
        2,
        5,
        1,
        6,
        6,
        3,
        4,
        1
      ],
      [
        4,
        2,
        1,
        6,
        1,
        4,
        4,
        3
      ],
      [
        3,
        1,
        2,
        5,
        4,
        5,
        3,
        5
      ],
      [
        5,
        2,
        6,
        5,
        1,
        4,
        2,
        4
      ],
      [
        5,
        6,
        6,
        5,
        5,
        3,
        3,
        4
      ],
      [
        4,
        2,
        2,
        6,
        6,
        4,
        4,
        6
      ],
      [
        4,
        2,
        3,
        5,
        2,
        2,
        3,
        2
      ]
    ],
    "optimal": 9
  },
  {
    "name": "The Deep End",
    "phase": "Grand Master",
    "w": 8,
    "h": 8,
    "start": [
      4,
      0
    ],
    "goal": [
      4,
      7
    ],
    "grid": [
      [
        4,
        3,
        4,
        1,
        1,
        4,
        4,
        6
      ],
      [
        2,
        6,
        6,
        3,
        4,
        5,
        5,
        1
      ],
      [
        5,
        4,
        1,
        2,
        1,
        6,
        4,
        2
      ],
      [
        5,
        4,
        1,
        1,
        5,
        1,
        4,
        6
      ],
      [
        5,
        5,
        6,
        3,
        5,
        1,
        6,
        1
      ],
      [
        6,
        1,
        6,
        5,
        1,
        6,
        4,
        4
      ],
      [
        5,
        3,
        6,
        5,
        3,
        2,
        5,
        2
      ],
      [
        1,
        3,
        6,
        6,
        3,
        5,
        3,
        1
      ]
    ],
    "optimal": 10
  },
  {
    "name": "Infinite Eye",
    "phase": "Grand Master",
    "w": 8,
    "h": 8,
    "start": [
      7,
      7
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        5,
        1,
        6,
        3,
        2,
        1,
        1
      ],
      [
        4,
        6,
        6,
        1,
        2,
        1,
        1,
        1
      ],
      [
        6,
        4,
        3,
        2,
        6,
        3,
        6,
        4
      ],
      [
        3,
        2,
        3,
        2,
        6,
        1,
        2,
        3
      ],
      [
        1,
        4,
        3,
        5,
        6,
        6,
        5,
        2
      ],
      [
        1,
        2,
        3,
        1,
        5,
        1,
        2,
        2
      ],
      [
        6,
        2,
        3,
        1,
        2,
        4,
        5,
        1
      ],
      [
        6,
        4,
        2,
        4,
        1,
        1,
        2,
        4
      ]
    ],
    "optimal": 10
  },
  {
    "name": "Sovereign Path",
    "phase": "Grand Master",
    "w": 8,
    "h": 8,
    "start": [
      0,
      4
    ],
    "goal": [
      7,
      4
    ],
    "grid": [
      [
        6,
        4,
        2,
        3,
        1,
        6,
        3,
        4
      ],
      [
        1,
        6,
        1,
        4,
        5,
        3,
        3,
        4
      ],
      [
        6,
        3,
        2,
        2,
        4,
        2,
        4,
        2
      ],
      [
        6,
        6,
        6,
        2,
        6,
        4,
        5,
        5
      ],
      [
        4,
        5,
        6,
        1,
        3,
        6,
        4,
        1
      ],
      [
        1,
        3,
        4,
        4,
        4,
        3,
        3,
        6
      ],
      [
        6,
        4,
        2,
        6,
        5,
        2,
        5,
        3
      ],
      [
        5,
        1,
        5,
        5,
        1,
        3,
        5,
        5
      ]
    ],
    "optimal": 10
  },
  {
    "name": "The Final Turn",
    "phase": "Grand Master",
    "w": 8,
    "h": 8,
    "start": [
      7,
      4
    ],
    "goal": [
      4,
      4
    ],
    "grid": [
      [
        3,
        6,
        2,
        6,
        6,
        2,
        5,
        5
      ],
      [
        6,
        2,
        1,
        1,
        3,
        5,
        4,
        1
      ],
      [
        3,
        5,
        3,
        5,
        5,
        6,
        4,
        1
      ],
      [
        3,
        5,
        5,
        5,
        3,
        5,
        6,
        6
      ],
      [
        6,
        2,
        2,
        4,
        1,
        1,
        3,
        6
      ],
      [
        6,
        5,
        6,
        1,
        3,
        6,
        6,
        1
      ],
      [
        5,
        1,
        6,
        3,
        4,
        6,
        3,
        2
      ],
      [
        1,
        3,
        5,
        5,
        2,
        5,
        1,
        2
      ]
    ],
    "optimal": 10
  },
  {
    "name": "Grand Master Pinnacle",
    "phase": "Grand Master",
    "w": 8,
    "h": 8,
    "start": [
      7,
      0
    ],
    "goal": [
      0,
      0
    ],
    "grid": [
      [
        1,
        2,
        5,
        6,
        1,
        4,
        5,
        2
      ],
      [
        3,
        5,
        6,
        3,
        3,
        4,
        3,
        2
      ],
      [
        2,
        4,
        6,
        6,
        4,
        3,
        4,
        3
      ],
      [
        6,
        1,
        4,
        6,
        6,
        1,
        2,
        3
      ],
      [
        5,
        4,
        2,
        2,
        4,
        5,
        3,
        3
      ],
      [
        4,
        6,
        1,
        3,
        5,
        1,
        6,
        2
      ],
      [
        1,
        1,
        1,
        4,
        6,
        4,
        2,
        3
      ],
      [
        6,
        2,
        6,
        4,
        1,
        5,
        4,
        3
      ]
    ],
    "optimal": 11
  }
];
