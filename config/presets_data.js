const exec1 = {
  "number_of_robots": 2,
  "number_of_colors": 3,
  "visibility_range": 1,
  "all_color_letters": [
    ["F", 255],
    ["L", 16711680],
    ["R", 32768]
  ],
  "opacity": false,
  "generation_mode": {
    "ProgressiveValidationByLevels": 0
  },
  "goals": [
    {
      "initial_positions": [["L", 0, 0], ["F", -1, 0]],
      "targets": [[1, [["L", 1, 0], ["F", 0, 0]], [], []]],
      "boundary": [-2, 2, -1, 1],
      "wall": [null, null]
    },
    {
      "initial_positions": [["R", 0, 0], ["F", -1, 0]],
      "targets": [[1, [["R", 1, 0], ["F", 0, 0]], [], []]],
      "boundary": [-2, 2, -1, 1],
      "wall": [null, null]
    },
    {
      "initial_positions": [["L", 2, 0], ["F", 1, 0]],
      "targets": [[3, [["F", 1, 1], ["R", 0, 1]], [], [["-", 2, 1]]]],
      "boundary": [-1, 4, -1, 2],
      "wall": [3, null]
    },
    {
      "initial_positions": [["R", 2, 0], ["F", 1, 0]],
      "targets": [[3, [["L", 0, -1], ["F", 1, -1]], [], [["-", 2, -1]]]],
      "boundary": [-1, 4, -2, 1],
      "wall": [3, null]
    },
    {
      "initial_positions": [["L", 0, 0], ["F", -1, 0]],
      "targets": [[1, [["F", 0, 0], ["L", 1, 0]], [], []]],
      "boundary": [-2, 2, -1, 2],
      "wall": [null, 1]
    },
    {
      "initial_positions": [["R", 0, 0], ["F", -1, 0]],
      "targets": [[1, [["R", 1, 0], ["F", 0, 0]], [], []]],
      "boundary": [-2, 2, -2, 1],
      "wall": [null, -1]
    },
    {
      "initial_positions": [["R", 0, 0], ["F", -1, 0]],
      "targets": [[3, [["F", -1, 1], ["R", -2, 1]], [], [["-", 0, 1]]]],
      "boundary": [-3, 2, -2, 2],
      "wall": [1, -1]
    },
    {
      "initial_positions": [["R", 0, 0], ["F", 1, 0]],
      "targets": [[3, [["F", 1, 1], ["L", 2, 1]], [], [["-", 0, 1]]]],
      "boundary": [-3, 3, -1, 3],
      "wall": [-1, 2]
    },
    {
      "initial_positions": [["L", 0, 0], ["F", -1, 0]],
      "targets": [[3, [["L", -2, -1], ["F", -1, -1]], [], [["-", 0, -1]]]],
      "boundary": [-3, 2, -2, 2],
      "wall": [1, 1]
    },
    {
      "initial_positions": [["L", -2, 0], ["F", -1, 0]],
      "targets": [[3, [["R", 0, -1], ["F", -1, -1]], [], [["-", -2, -1]]]],
      "boundary": [-4, 1, -3, 1],
      "wall": [-3, -2]
    }
  ]
};

const exec2= {
  "number_of_robots": 2,
  "number_of_colors": 2,
  "visibility_range": 2,
  "all_color_letters": [
    ["F", 255],
    ["L", 16711680]
  ],
  "opacity": true,
  "generation_mode": {
    "ProgressiveValidationByLevels": 0
  },
  "goals": [
    {
      "initial_positions": [["L", 0, 0], ["F", -1, 0]],
      "targets": [[1, [["F", 0, 0], ["L", 1, 0]], [], []]],
      "boundary": [-2, 2, -1, 1],
      "wall": [null, null]
    },
    {
      "initial_positions": [["L", 0, 0], ["F", -2, 0]],
      "targets": [[1, [["L", 1, 0], ["F", -1, 0]], [], []]],
      "boundary": [-3, 2, -1, 1],
      "wall": [null, null]
    },
    {
      "initial_positions": [["L", 0, 0], ["F", -2, 0]],
      "targets": [[1, [["L", 1, 0], ["F", -1, 0]], [], []]],
      "boundary": [-3, 2, -1, 1],
      "wall": [null, -2]
    },
    {
      "initial_positions": [["L", 0, 0], ["F", -1, 0]],
      "targets": [[1, [["F", 0, 0], ["L", 1, 0]], [], []]],
      "boundary": [-2, 2, -1, 1],
      "wall": [null, 2]
    },
    {
      "initial_positions": [["L", 0, 0], ["F", -1, 0]],
      "targets": [[1, [["L", 1, 0], ["F", 0, 0]], [], []]],
      "boundary": [-2, 2, -3, 1],
      "wall": [null, -2]
    },
    {
      "initial_positions": [["F", -1, 0], ["L", 1, 0]],
      "targets": [[1, [["L", 2, 0], ["F", 0, 0]], [], []]],
      "boundary": [-2, 3, -2, 1],
      "wall": [null, -1]
    },
    {
      "initial_positions": [["L", 1, 0], ["F", -1, 0]],
      "targets": [[1, [["L", 2, 0], ["F", 0, 0]], [], []]],
      "boundary": [-2, 3, -1, 6],
      "wall": [null, 2]
    },
    {
      "initial_positions": [["L", 1, 0], ["F", 0, 0]],
      "targets": [[1, [["L", 2, 0], ["F", 1, 0]], [], []]],
      "boundary": [-1, 3, -1, 2],
      "wall": [null, 1]
    },
    {
      "initial_positions": [["L", 0, 1], ["F", 2, 1]],
      "targets": [[1, [["F", -1, 1], ["F", 1, 1]], [], []], [1, [["L", 1, 0], ["F", -1, 0]], [], []], [2, [["F", 1, 0], ["L", 3, 0]], [], []]],
      "boundary": [-3, 4, -1, 3],
      "wall": [-2, 2]
    },
    {
      "initial_positions": [["L", 0, 0], ["F", 1, 0]],
      "targets": [[1, [["F", -1, 0], ["F", 0, 0]], [], []], [1, [["L", 0, 1], ["F", -1, 1]], [], []], [2, [["L", 2, 1], ["F", 1, 1]], [], []]],
      "boundary": [-3, 3, -2, 2],
      "wall": [-2, -1]
    },
    {
      "initial_positions": [["L", 0, 0], ["F", -1, 0]],
      "targets": [[2, [["F", 1, 0], ["L", 1, 1]], [], [["*", 1, 0]]], [4, [["F", -1, 1], ["L", -3, 1]], [["-", -3, 0], ["-", -2, 0], ["-", -1, 0], ["-", 0, 0]], [["*", -1, 1], ["*", 0, 1], ["*", 1, 1]]]],
      "boundary": [-4, 3, -1, 2],
      "wall": [2, -2]
    },
    {
      "initial_positions": [["L", 1, 0], ["F", -1, 0]],
      "targets": [[2, [["L", 2, -1], ["F", 1, 0]], [], [["-", 2, 0]]], [1, [["F", 2, 0], ["L", 1, -1]], [], []], [3, [["F", 0, -1], ["L", -1, -1]], [["-", 0, 0], ["-", -1, 0], ["-", 1, 0]], [["*", 0, -1]]]],
      "boundary": [-2, 4, -2, 1],
      "wall": [3, null]
    },
    {
      "initial_positions": [["L", 1, 0], ["F", 0, 0]],
      "targets": [[2, [["F", 2, 0], ["L", 2, 1]], [], [["*", 2, 0]]], [4, [["F", 0, 1], ["L", -2, 1]], [["-", 1, 0], ["-", 0, 0], ["-", -1, 0], ["-", -2, 0]], [["*", 1, 1], ["*", 0, 1], ["F", 2, 1]]]],
      "boundary": [-3, 4, -1, 2],
      "wall": [3, null]
    },
    {
      "initial_positions": [["L", 1, 0], ["F", -1, 0]],
      "targets": [[2, [["L", 2, -1], ["F", 1, 0]], [], [["-", 2, 0]]], [1, [["F", 2, 0], ["L", 1, -1]], [], []], [3, [["F", 0, -1], ["L", -1, -1]], [["-", 0, 0], ["-", 1, 0], ["-", -1, 0]], [["*", 0, -1]]]],
      "boundary": [-2, 4, -2, 1],
      "wall": [3, -3]
    },
    {
      "initial_positions": [["L", 1, 0], ["F", 0, 0]],
      "targets": [[2, [["F", 2, 0], ["L", 2, 1]], [], [["*", 2, 0]]], [4, [["F", 0, 1], ["L", -2, 1]], [["-", 1, 0], ["-", 0, 0], ["-", -1, 0], ["-", -2, 0]], [["*", 0, 1], ["*", 1, 1], ["F", 2, 1]]]],
      "boundary": [-3, 4, -1, 2],
      "wall": [3, 3]
    },
    {
      "initial_positions": [["L", 1, 0], ["F", -1, 0]],
      "targets": [[2, [["L", 2, -1], ["F", 1, 0]], [], [["-", 2, 0]]], [1, [["F", 2, 0], ["L", 1, -1]], [], []], [3, [["F", 0, -1], ["L", -1, -1]], [["-", 0, 0], ["-", 1, 0], ["-", -1, 0]], [["*", 0, -1]]]],
      "boundary": [-2, 4, -2, 1],
      "wall": [3, -2]
    },
    {
      "initial_positions": [["L", 1, 0], ["F", 0, 0]],
      "targets": [[2, [["F", 2, 0], ["L", 2, 1]], [], [["*", 2, 0]]], [4, [["F", 0, 1], ["L", -2, 1]], [["-", 1, 0], ["-", 0, 0], ["-", -1, 0], ["-", -2, 0]], [["*", 1, 1], ["*", 0, 1], ["F", 2, 1]]]],
      "boundary": [-3, 4, -1, 2],
      "wall": [3, 2]
    },
    {
      "initial_positions": [["L", 1, 0], ["F", -1, 0]],
      "targets": [[2, [["F", 1, 0], ["L", 2, -1]], [], [["-", 2, 0]]], [1, [["L", 1, -1], ["F", 2, 0]], [], []], [3, [["L", -1, -1], ["F", 0, -1]], [["-", -1, 0], ["-", 0, 0], ["-", 1, 0]], [["*", 0, -1]]]],
      "boundary": [-2, 4, -2, 1],
      "wall": [3, 2]
    }
  ]
};

const exec3 = {
  "number_of_robots": 2,
  "number_of_colors": 2,
  "visibility_range": 2,
  "all_color_letters": [
    ["F", 255],
    ["L", 16711680]
  ],
  "opacity": true,
  "generation_mode": {
    "ProgressiveValidationByLevels": 0
  },
  "goals": [
    {
      "initial_positions": [["L", 0, 0], ["F", -1, 0]],
      "targets": [[1, [["F", 0, 0], ["L", 1, 0]], [], []]],
      "boundary": [-2, 2, -1, 1],
      "wall": [null, null]
    },
    {
      "initial_positions": [["L", 0, 0], ["F", -2, 0]],
      "targets": [[1, [["L", 1, 0], ["F", -1, 0]], [], []]],
      "boundary": [-3, 2, -1, 1],
      "wall": [null, null]
    },
    {
      "initial_positions": [["L", 0, 0], ["F", -2, 0]],
      "targets": [[1, [["L", 1, 0], ["F", -1, 0]], [], []]],
      "boundary": [-3, 2, -1, 1],
      "wall": [null, -2]
    },
    {
      "initial_positions": [["L", 0, 0], ["F", -1, 0]],
      "targets": [[1, [["F", 0, 0], ["L", 1, 0]], [], []]],
      "boundary": [-2, 2, -1, 1],
      "wall": [null, 2]
    },
    {
      "initial_positions": [["L", 0, 0], ["F", -1, 0]],
      "targets": [[1, [["L", 1, 0], ["F", 0, 0]], [], []]],
      "boundary": [-2, 2, -3, 1],
      "wall": [null, -2]
    },
    {
      "initial_positions": [["F", -1, 0], ["L", 1, 0]],
      "targets": [[1, [["L", 2, 0], ["F", 0, 0]], [], []]],
      "boundary": [-2, 3, -2, 1],
      "wall": [null, -1]
    },
    {
      "initial_positions": [["L", 1, 0], ["F", -1, 0]],
      "targets": [[1, [["L", 2, 0], ["F", 0, 0]], [], []]],
      "boundary": [-2, 3, -1, 6],
      "wall": [null, 2]
    },
    {
      "initial_positions": [["L", 1, 0], ["F", 0, 0]],
      "targets": [[1, [["L", 2, 0], ["F", 1, 0]], [], []]],
      "boundary": [-1, 3, -1, 2],
      "wall": [null, 1]
    },
    {
      "initial_positions": [["L", 0, 1], ["F", 2, 1]],
      "targets": [[2, [["L", 1, 0], ["F", -1, 0]], [], [["F", 1, 1], ["F", -1, 1]]], [2, [["F", 1, 0], ["L", 3, 0]], [], []]],
      "boundary": [-3, 4, -1, 3],
      "wall": [-2, 2]
    },
    {
      "initial_positions": [["L", 0, 0], ["F", 1, 0]],
      "targets": [[2, [["L", 0, 1], ["F", -1, 1]], [], [["F", -1, 0], ["F", 0, 0]]], [2, [["L", 2, 1], ["F", 1, 1]], [], []]],
      "boundary": [-3, 3, -2, 2],
      "wall": [-2, -1]
    },
    {
      "initial_positions": [["L", 0, 0], ["F", -1, 0]],
      "targets": [[2, [["F", 1, 0], ["L", 1, 1]], [], [["*", 1, 0]]], [4, [["F", -1, 1], ["L", -3, 1]], [["-", -3, 0], ["-", -2, 0], ["-", -1, 0], ["-", 0, 0]], [["*", -1, 1], ["*", 0, 1], ["*", 1, 1]]]],
      "boundary": [-4, 3, -1, 2],
      "wall": [2, -2]
    },
    {
      "initial_positions": [["L", 1, 0], ["F", -1, 0]],
      "targets": [[3, [["F", 2, 0], ["L", 1, -1]], [], [["F", 1, 0], ["L", 2, -1]]], [3, [["F", 0, -1], ["L", -1, -1]], [["-", 0, 0], ["-", -1, 0], ["-", 1, 0]], [["*", 0, -1]]]],
      "boundary": [-2, 4, -2, 1],
      "wall": [3, null]
    },
    {
      "initial_positions": [["L", 1, 0], ["F", 0, 0]],
      "targets": [[2, [["F", 2, 0], ["L", 2, 1]], [], [["*", 2, 0]]], [4, [["F", 0, 1], ["L", -2, 1]], [["-", 1, 0], ["-", 0, 0], ["-", -1, 0], ["-", -2, 0]], [["*", 1, 1], ["*", 0, 1], ["F", 2, 1]]]],
      "boundary": [-3, 4, -1, 2],
      "wall": [3, null]
    },
    {
      "initial_positions": [["L", 1, 0], ["F", -1, 0]],
      "targets": [[3, [["F", 2, 0], ["L", 1, -1]], [], [["F", 1, 0], ["L", 2, -1]]], [3, [["F", 0, -1], ["L", -1, -1]], [["-", 0, 0], ["-", 1, 0], ["-", -1, 0]], [["*", 0, -1]]]],
      "boundary": [-2, 4, -2, 1],
      "wall": [3, -3]
    },
    {
      "initial_positions": [["L", 1, 0], ["F", 0, 0]],
      "targets": [[2, [["F", 2, 0], ["L", 2, 1]], [], [["*", 2, 0]]], [4, [["F", 0, 1], ["L", -2, 1]], [["-", 1, 0], ["-", 0, 0], ["-", -1, 0], ["-", -2, 0]], [["*", 0, 1], ["*", 1, 1], ["F", 2, 1]]]],
      "boundary": [-3, 4, -1, 2],
      "wall": [3, 3]
    },
    {
      "initial_positions": [["L", 1, 0], ["F", -1, 0]],
      "targets": [[3, [["F", 2, 0], ["L", 1, -1]], [], [["L", 2, -1], ["F", 1, 0]]], [3, [["F", 0, -1], ["L", -1, -1]], [["-", 0, 0], ["-", 1, 0], ["-", -1, 0]], [["*", 0, -1]]]],
      "boundary": [-2, 4, -2, 1],
      "wall": [3, -2]
    },
    {
      "initial_positions": [["L", 1, 0], ["F", 0, 0]],
      "targets": [[2, [["F", 2, 0], ["L", 2, 1]], [], [["*", 2, 0]]], [4, [["F", 0, 1], ["L", -2, 1]], [["-", 1, 0], ["-", 0, 0], ["-", -1, 0], ["-", -2, 0]], [["*", 1, 1], ["*", 0, 1], ["F", 2, 1]]]],
      "boundary": [-3, 4, -1, 2],
      "wall": [3, 2]
    },
    {
      "initial_positions": [["L", 1, 0], ["F", -1, 0]],
      "targets": [[3, [["L", 1, -1], ["F", 2, 0]], [], [["F", 1, 0], ["L", 2, -1]]], [3, [["L", -1, -1], ["F", 0, -1]], [["-", -1, 0], ["-", 0, 0], ["-", 1, 0]], [["*", 0, -1]]]],
      "boundary": [-2, 4, -2, 1],
      "wall": [3, 2]
    }
  ]
};

const exec4 = {
  "number_of_robots": 3,
  "number_of_colors": 1,
  "visibility_range": 2,
  "all_color_letters": [
    ["L", 16711680]
  ],
  "opacity": true,
  "generation_mode": {
    "ProgressiveValidationByLevels": 0
  },
  "goals": [
    {
      "initial_positions": [["L", 0, 1], ["L", -1, 0], ["L", 0, -1]],
      "targets": [[1, [["L", 0, 0], ["L", 1, 1], ["L", 1, -1]], [], []]],
      "boundary": [-2, 2, -2, 2],
      "wall": [null, null]
    },
    {
      "initial_positions": [["L", -1, 0], ["L", 0, 1], ["L", 0, -1]],
      "targets": [[1, [["L", 0, 0], ["L", 1, 1], ["L", 1, -1]], [], []]],
      "boundary": [-2, 2, -2, 4],
      "wall": [null, 3]
    },
    {
      "initial_positions": [["L", 0, 1], ["L", -1, 0], ["L", 0, -1]],
      "targets": [[1, [["L", 0, 0], ["L", 1, 1], ["L", 1, -1]], [], []]],
      "boundary": [-2, 2, -2, 2],
      "wall": [null, -3]
    },
    {
      "initial_positions": [["L", 0, 1], ["L", -1, 0], ["L", 0, -1]],
      "targets": [[1, [["L", 0, 0], ["L", 1, 1], ["L", 1, -1]], [], []]],
      "boundary": [-2, 2, -2, 2],
      "wall": [null, 2]
    },
    {
      "initial_positions": [["L", 0, 1], ["L", -1, 0], ["L", 0, -1]],
      "targets": [[1, [["L", 0, 0], ["L", 1, 1], ["L", 1, -1]], [], []]],
      "boundary": [-2, 2, -2, 2],
      "wall": [null, -2]
    },
    {
      "initial_positions": [["L", 0, 1], ["L", -1, 1], ["L", -1, 0]],
      "targets": [[1, [["L", 0, 0], ["L", 0, 1], ["L", 1, 1]], [], []]],
      "boundary": [-2, 2, -1, 2],
      "wall": [null, null]
    },
    {
      "initial_positions": [["L", 0, -1], ["L", 0, 0], ["L", 1, 0]],
      "targets": [[1, [["L", 2, 0], ["L", 1, 0], ["L", 1, -1]], [], []]],
      "boundary": [-1, 3, -2, 1],
      "wall": [null, 2]
    },
    {
      "initial_positions": [["L", 0, 1], ["L", -1, 1], ["L", -1, 0]],
      "targets": [[1, [["L", 0, 0], ["L", 0, 1], ["L", 1, 1]], [], []]],
      "boundary": [-2, 2, -3, 2],
      "wall": [null, -2]
    },
    {
      "initial_positions": [["L", -1, 1], ["L", -1, -1], ["L", -2, 0]],
      "targets": [[4, [["L", -2, 0], ["L", -2, -1], ["L", -3, -1]], [], [["-", 0, 1], ["-", 0, 0], ["-", 0, -1]]]],
      "boundary": [-4, 2, -2, 2],
      "wall": [1, null]
    },
    {
      "initial_positions": [["L", -1, 1], ["L", -1, -1], ["L", -2, 0]],
      "targets": [[4, [["L", -2, 0], ["L", -2, -1], ["L", -3, -1]], [], [["-", 0, 1], ["-", 0, 0], ["-", 0, -1]]]],
      "boundary": [-4, 2, -2, 2],
      "wall": [1, -3]
    },
    {
      "initial_positions": [["L", -1, 1], ["L", -1, -1], ["L", -2, 0]],
      "targets": [[4, [["L", -2, 0], ["L", -2, -1], ["L", -3, -1]], [], [["-", 0, 1], ["-", 0, 0], ["-", 0, -1]]]],
      "boundary": [-4, 2, -2, 2],
      "wall": [1, 3]
    },
    {
      "initial_positions": [["L", -1, 1], ["L", -1, -1], ["L", -2, 0]],
      "targets": [[4, [["L", -2, 0], ["L", -2, -1], ["L", -3, -1]], [], [["-", 0, 1], ["-", 0, 0], ["-", 0, -1]]]],
      "boundary": [-4, 2, -2, 2],
      "wall": [1, 2]
    },
    {
      "initial_positions": [["L", -1, 1], ["L", -1, -1], ["L", -2, 0]],
      "targets": [[4, [["L", -3, -1], ["L", -3, 1], ["L", -2, 0]], [], [["-", 0, 1], ["-", 0, -1], ["-", 0, 0]]]],
      "boundary": [-4, 2, -2, 2],
      "wall": [1, -2]
    },
    {
      "initial_positions": [["L", 0, 0], ["L", 1, 0], ["L", 1, 1]],
      "targets": [[5, [["L", 2, 1], ["L", 2, -1], ["L", 1, 0]], [["-", -1, 1]], [["-", -1, 0], ["-", -1, -1]]]],
      "boundary": [-3, 3, -2, 2],
      "wall": [-2, null]
    },
    {
      "initial_positions": [["L", 0, 0], ["L", 1, 0], ["L", 1, 1]],
      "targets": [[5, [["L", 2, 1], ["L", 2, -1], ["L", 1, 0]], [["-", -1, 1]], [["-", -1, 0], ["-", -1, -1]]]],
      "boundary": [-3, 3, -2, 2],
      "wall": [-2, -3]
    },
    {
      "initial_positions": [["L", 0, 0], ["L", 1, 0], ["L", 1, 1]],
      "targets": [[5, [["L", 2, 1], ["L", 2, -1], ["L", 1, 0]], [["-", -1, 1]], [["-", -1, 0], ["-", -1, -1]]]],
      "boundary": [-3, 3, -2, 2],
      "wall": [-2, -2]
    },
    {
      "initial_positions": [["L", 0, 0], ["L", -1, 0], ["L", -1, -1]],
      "targets": [[5, [["L", -1, 0], ["L", -2, 1], ["L", -2, -1]], [["-", 1, -1]], [["-", 1, 0], ["-", 1, 1]]]],
      "boundary": [-3, 3, -3, 2],
      "wall": [2, -3]
    }
  ]
};

const exec5 = {
  "number_of_robots": 2,
  "number_of_colors": 3,
  "visibility_range": 1,
  "all_color_letters": [
    ["F", 255],
    ["L", 16711680],
    ["R", 32768]
  ],
  "opacity": false,
  "generation_mode": {
    "ProgressiveValidationByLevels": 0
  },
  "goals": [
    {
      "initial_positions": [["L", 0, 0], ["F", -1, 0]],
      "targets": [[1, [["L", 1, 0], ["F", 0, 0]], [], []]],
      "boundary": [-2, 2, -1, 1],
      "wall": [null, null]
    },
    {
      "initial_positions": [["F", 0, 0], ["L", 1, 0]],
      "targets": [[3, [["F", 0, 0], ["R", -1, 0]], [], []]],
      "boundary": [-2, 3, -2, 2],
      "wall": [2, null]
    },
    {
      "initial_positions": [["R", 0, 0], ["F", -1, 0]],
      "targets": [[1, [["R", 1, 0], ["F", 0, 0]], [], []]],
      "boundary": [-2, 2, -1, 1],
      "wall": [null, null]
    },
    {
      "initial_positions": [["R", 0, 0], ["F", -1, 0]],
      "targets": [[3, [["F", -1, 1], ["L", -2, 1]], [], []]],
      "boundary": [-3, 2, -1, 2],
      "wall": [1, null]
    },
    {
      "initial_positions": [["R", -1, 0], ["F", 0, 0]],
      "targets": [[3, [["L", 1, -1], ["F", 0, -1]], [], []]],
      "boundary": [-3, 2, -3, 1],
      "wall": [-2, -2]
    },
    {
      "initial_positions": [["L", 0, -1], ["F", -1, -1]],
      "targets": [[1, [["L", 1, -1], ["F", 0, -1]], [], []]],
      "boundary": [-2, 2, -3, 0],
      "wall": [null, -2]
    },
    {
      "initial_positions": [["L", 0, -1], ["F", -1, -1]],
      "targets": [[3, [["R", -2, -1], ["F", -1, -1]], [], []]],
      "boundary": [-3, 2, -3, 1],
      "wall": [1, -2]
    },
    {
      "initial_positions": [["F", -1, 0], ["R", 0, 0]],
      "targets": [[1, [["R", 1, 0], ["F", 0, 0]], [], []]],
      "boundary": [-2, 2, -1, 2],
      "wall": [null, 1]
    },
    {
      "initial_positions": [["R", 0, 0], ["F", 1, 0]],
      "targets": [[3, [["R", 0, 2], ["L", 0, 1]], [], []]],
      "boundary": [-6, 6, -6, 6],
      "wall": [-1, -1]
    },
    {
      "initial_positions": [["R", 0, 1], ["L", -1, 1]],
      "targets": [[1, [["R", 1, 1], ["L", 0, 1]], [], []]],
      "boundary": [-2, 2, 0, 3],
      "wall": [null, 2]
    },
    {
      "initial_positions": [["R", -1, 1], ["L", -1, 0]],
      "targets": [[3, [["L", 1, 1], ["F", 0, 1]], [], []]],
      "boundary": [-3, 2, -1, 3],
      "wall": [-2, 2]
    },
    {
      "initial_positions": [["L", 0, 0], ["F", -1, 0]],
      "targets": [[1, [["L", 1, 0], ["F", 0, 0]], [], []]],
      "boundary": [-2, 2, -1, 2],
      "wall": [null, 1]
    },
    {
      "initial_positions": [["L", 0, 0], ["F", -1, 0]],
      "targets": [[3, [["F", -1, 0], ["R", -2, 0]], [], []]],
      "boundary": [-3, 2, -3, 1],
      "wall": [1, -2]
    },
    {
      "initial_positions": [["L", 1, 0], ["F", 0, 0]],
      "targets": [[3, [["R", -1, 0], ["F", 0, 0]], [], []]],
      "boundary": [-2, 3, -2, 2],
      "wall": [2, 1]
    },
    {
      "initial_positions": [["R", 0, 1], ["F", 1, 1]],
      "targets": [[2, [["F", 0, 0], ["L", 0, -1]], [], []]],
      "boundary": [-1, 2, -2, 3],
      "wall": [null, 2]
    }
  ]
};

const exec5_2 ={
  "number_of_robots": 2,
  "number_of_colors": 3,
  "visibility_range": 1,
  "all_color_letters": [
    ["F", 255],
    ["L", 16711680],
    ["R", 32768]
  ],
  "opacity": false,
  "generation_mode": {
    "ProgressiveValidationByLevels": 0
  },
  "goals": [
    {
      "initial_positions": [["L", 0, 0], ["F", -1, 0]],
      "targets": [[1, [["L", 1, 0], ["F", 0, 0]], [], []]],
      "boundary": [-2, 2, -1, 1],
      "wall": [null, null]
    },
    {
      "initial_positions": [["F", 0, 0], ["L", 1, 0]],
      "targets": [[3, [["F", 0, 0], ["R", -1, 0]], [], []]],
      "boundary": [-2, 3, -2, 2],
      "wall": [2, null]
    },
    {
      "initial_positions": [["R", 0, 0], ["F", -1, 0]],
      "targets": [[1, [["R", 1, 0], ["F", 0, 0]], [], []]],
      "boundary": [-2, 2, -1, 1],
      "wall": [null, null]
    },
    {
      "initial_positions": [["R", 0, 0], ["F", -1, 0]],
      "targets": [[3, [["F", -1, 1], ["L", -2, 1]], [], []]],
      "boundary": [-3, 2, -1, 2],
      "wall": [1, null]
    },
    {
      "initial_positions": [["R", -1, 0], ["F", 0, 0]],
      "targets": [[3, [["L", 1, -1], ["F", 0, -1]], [], []]],
      "boundary": [-3, 2, -3, 1],
      "wall": [-2, -2]
    },
    {
      "initial_positions": [["L", 0, -1], ["F", -1, -1]],
      "targets": [[1, [["L", 1, -1], ["F", 0, -1]], [], []]],
      "boundary": [-2, 2, -3, 0],
      "wall": [null, -2]
    },
    {
      "initial_positions": [["L", 0, -1], ["F", -1, -1]],
      "targets": [[3, [["R", -2, -1], ["F", -1, -1]], [], []]],
      "boundary": [-3, 2, -3, 1],
      "wall": [1, -2]
    },
    {
      "initial_positions": [["F", -1, 0], ["R", 0, 0]],
      "targets": [[1, [["R", 1, 0], ["F", 0, 0]], [], []]],
      "boundary": [-2, 2, -1, 2],
      "wall": [null, 1]
    },
    {
      "initial_positions": [["R", 0, 0], ["F", 1, 0]],
      "targets": [[3, [["R", 0, 2], ["L", 0, 1]], [], []]],
      "boundary": [-6, 6, -6, 6],
      "wall": [-1, -1]
    },
    {
      "initial_positions": [["R", 0, 1], ["L", -1, 1]],
      "targets": [[1, [["R", 1, 1], ["L", 0, 1]], [], []]],
      "boundary": [-2, 2, 0, 3],
      "wall": [null, 2]
    },
    {
      "initial_positions": [["R", -1, 1], ["L", -1, 0]],
      "targets": [[3, [["L", 1, 1], ["F", 0, 1]], [], []]],
      "boundary": [-3, 2, -1, 3],
      "wall": [-2, 2]
    },
    {
      "initial_positions": [["L", 0, 0], ["F", -1, 0]],
      "targets": [[1, [["L", 1, 0], ["F", 0, 0]], [], []]],
      "boundary": [-2, 2, -1, 2],
      "wall": [null, 1]
    },
    {
      "initial_positions": [["L", 0, 0], ["F", -1, 0]],
      "targets": [[3, [["R", -2, -1], ["F", -1, -1]], [], []]],
      "boundary": [-3, 2, -3, 1],
      "wall": [1, -2]
    },
    {
      "initial_positions": [["L", 1, 0], ["F", 0, 0]],
      "targets": [[3, [["R", -1, 0], ["F", 0, 0]], [], []]],
      "boundary": [-2, 3, -2, 2],
      "wall": [2, 1]
    },
    {
      "initial_positions": [["R", 0, 1], ["F", 1, 1]],
      "targets": [[2, [["F", 0, 0], ["L", 0, -1]], [], []]],
      "boundary": [-1, 2, -2, 3],
      "wall": [null, 2]
    }
  ]
};


const exec5_3 = {
  "number_of_robots": 2,
  "number_of_colors": 3,
  "visibility_range": 1,
  "all_color_letters": [
    ["F", 255],
    ["L", 16711680],
    ["R", 32768]
  ],
  "opacity": false,
  "generation_mode": {
    "ProgressiveValidationByLevels": 0
  },
  "goals": [
    {
      "initial_positions": [["L", 0, 0], ["F", -1, 0]],
      "targets": [[1, [["L", 1, 0], ["F", 0, 0]], [], []]],
      "boundary": [-2, 2, -1, 1],
      "wall": [null, null]
    },
    {
      "initial_positions": [["F", 0, 0], ["L", 1, 0]],
      "targets": [[3, [["F", 0, 0], ["R", -1, 0]], [], []]],
      "boundary": [-2, 3, -2, 2],
      "wall": [2, null]
    },
    {
      "initial_positions": [["R", 0, 0], ["F", -1, 0]],
      "targets": [[1, [["R", 1, 0], ["F", 0, 0]], [], []]],
      "boundary": [-2, 2, -1, 1],
      "wall": [null, null]
    },
    {
      "initial_positions": [["R", 0, 0], ["F", -1, 0]],
      "targets": [[3, [["F", -1, 1], ["L", -2, 1]], [], []]],
      "boundary": [-3, 2, -1, 2],
      "wall": [1, null]
    },
    {
      "initial_positions": [["R", -1, 0], ["F", 0, 0]],
      "targets": [[3, [["L", 1, -1], ["F", 0, -1]], [], []]],
      "boundary": [-3, 2, -3, 1],
      "wall": [-2, -2]
    },
    {
      "initial_positions": [["L", 0, -1], ["F", -1, -1]],
      "targets": [[1, [["L", 1, -1], ["F", 0, -1]], [], []]],
      "boundary": [-2, 2, -3, 0],
      "wall": [null, -2]
    },
    {
      "initial_positions": [["L", 0, -1], ["F", -1, -1]],
      "targets": [[3, [["R", -2, -1], ["F", -1, -1]], [], []]],
      "boundary": [-3, 2, -3, 1],
      "wall": [1, -2]
    },
    {
      "initial_positions": [["F", -1, 0], ["R", 0, 0]],
      "targets": [[1, [["R", 1, 0], ["F", 0, 0]], [], []]],
      "boundary": [-2, 2, -1, 2],
      "wall": [null, 1]
    },
    {
      "initial_positions": [["R", 0, 0], ["F", 1, 0]],
      "targets": [[3, [["R", 0, 2], ["L", 0, 1]], [], []]],
      "boundary": [-6, 6, -6, 6],
      "wall": [-1, -1]
    },
    {
      "initial_positions": [["R", 0, 1], ["L", -1, 1]],
      "targets": [[1, [["R", 1, 1], ["L", 0, 1]], [], []]],
      "boundary": [-2, 2, 0, 3],
      "wall": [null, 2]
    },
    {
      "initial_positions": [["R", -1, 1], ["L", -1, 0]],
      "targets": [[3, [["L", 1, 1], ["F", 0, 1]], [], []]],
      "boundary": [-3, 2, -1, 3],
      "wall": [-2, 2]
    },
    {
      "initial_positions": [["L", 0, 0], ["F", -1, 0]],
      "targets": [[1, [["L", 1, 0], ["F", 0, 0]], [], []]],
      "boundary": [-2, 2, -1, 2],
      "wall": [null, 1]
    },
    {
      "initial_positions": [["L", 0, 0], ["F", -1, 0]],
      "targets": [[3, [["F", -1, 0], ["R", -2, 0]], [], []]],
      "boundary": [-3, 2, -3, 1],
      "wall": [1, -2]
    },
    {
      "initial_positions": [["L", 1, 0], ["F", 0, 0]],
      "targets": [[3, [["R", -1, 0], ["R", 0, 0]], [], []]],
      "boundary": [-2, 3, -2, 2],
      "wall": [2, 1]
    },
    {
      "initial_positions": [["R", 0, 0], ["R", 1, 0]],
      "targets": [[1, [["R", -1, 0], ["R", 0, 0]], [], []]],
      "boundary": [-2, 2, -1, 2],
      "wall": [null, 1]
    },
    {
      "initial_positions": [["R", 0, 0], ["R", 1, 0]],
      "targets": [[3, [["L", 0, -1], ["L", 0, -2]], [], []]],
      "boundary": [-2, 2, -3, 2],
      "wall": [-1, 1]
    },
    {
      "initial_positions": [["L", 0, 2], ["L", 0, 1]],
      "targets": [[3, [["R", 1, 1], ["F", 1, 2]], [], []]],
      "boundary": [-2, 3, -1, 3],
      "wall": [-1, null]
    }
  ]
};

const exec6= {
  "number_of_robots": 2,
  "number_of_colors": 3,
  "visibility_range": 1,
  "all_color_letters": [
    ["F", 255],
    ["L", 16711680],
    ["R", 32768]
  ],
  "opacity": false,
  "generation_mode": {
    "ProgressiveValidationByLevels": 0
  },
  "goals": [
    {
      "initial_positions": [["L", 0, 0], ["F", -1, 0]],
      "targets": [[1, [["L", 1, 0], ["F", 0, 0]], [], []]],
      "boundary": [-2, 2, -1, 1],
      "wall": [null, null]
    },
    {
      "initial_positions": [["F", 0, 0], ["L", 1, 0]],
      "targets": [[3, [["F", 0, 0], ["R", -1, 0]], [], []]],
      "boundary": [-2, 3, -2, 2],
      "wall": [2, null]
    },
    {
      "initial_positions": [["R", 0, 0], ["F", -1, 0]],
      "targets": [[1, [["R", 1, 0], ["F", 0, 0]], [], []]],
      "boundary": [-2, 2, -1, 1],
      "wall": [null, null]
    },
    {
      "initial_positions": [["R", 0, 0], ["F", -1, 0]],
      "targets": [[3, [["F", -1, 1], ["L", -2, 1]], [], []]],
      "boundary": [-3, 2, -1, 2],
      "wall": [1, null]
    },
    {
      "initial_positions": [["R", -1, 0], ["F", 0, 0]],
      "targets": [[3, [["L", 1, -1], ["F", 0, -1]], [], []]],
      "boundary": [-3, 2, -3, 1],
      "wall": [-2, -2]
    },
    {
      "initial_positions": [["L", 0, -1], ["F", -1, -1]],
      "targets": [[1, [["L", 1, -1], ["F", 0, -1]], [], []]],
      "boundary": [-2, 2, -3, 0],
      "wall": [null, -2]
    },
    {
      "initial_positions": [["L", 0, -1], ["F", -1, -1]],
      "targets": [[3, [["R", -2, -1], ["F", -1, -1]], [], []]],
      "boundary": [-3, 2, -3, 1],
      "wall": [1, -2]
    },
    {
      "initial_positions": [["F", -1, 0], ["R", 0, 0]],
      "targets": [[1, [["R", 1, 0], ["F", 0, 0]], [], []]],
      "boundary": [-2, 2, -1, 2],
      "wall": [null, 1]
    },
    {
      "initial_positions": [["R", 0, 0], ["F", 1, 0]],
      "targets": [[3, [["R", 0, 2], ["L", 0, 1]], [], []]],
      "boundary": [-6, 6, -6, 6],
      "wall": [-1, -1]
    },
    {
      "initial_positions": [["R", 0, 1], ["L", -1, 1]],
      "targets": [[1, [["R", 1, 1], ["L", 0, 1]], [], []]],
      "boundary": [-2, 2, 0, 3],
      "wall": [null, 2]
    },
    {
      "initial_positions": [["R", -1, 1], ["L", -1, 0]],
      "targets": [[3, [["L", 1, 1], ["F", 0, 1]], [], []]],
      "boundary": [-3, 2, -1, 3],
      "wall": [-2, 2]
    },
    {
      "initial_positions": [["L", 0, 0], ["F", -1, 0]],
      "targets": [[1, [["L", 1, 0], ["F", 0, 0]], [], []]],
      "boundary": [-2, 2, -1, 2],
      "wall": [null, 1]
    },
    {
      "initial_positions": [["L", 0, 0], ["F", -1, 0]],
      "targets": [[3, [["F", -1, 0], ["R", -2, 0]], [], []]],
      "boundary": [-3, 2, -3, 1],
      "wall": [1, -2]
    },
    {
      "initial_positions": [["L", 1, 0], ["F", 0, 0]],
      "targets": [[3, [["R", -1, 0], ["R", 0, 0]], [], []]],
      "boundary": [-2, 3, -2, 2],
      "wall": [2, 1]
    },
    {
      "initial_positions": [["R", 0, 0], ["R", 1, 0]],
      "targets": [[1, [["R", -1, 0], ["R", 0, 0]], [], []]],
      "boundary": [-2, 2, -1, 2],
      "wall": [null, 1]
    },
    {
      "initial_positions": [["R", 0, 0], ["R", 1, 0]],
      "targets": [[3, [["F", 0, -1], ["F", 0, -2]], [], []]],
      "boundary": [-2, 2, -3, 2],
      "wall": [-1, 1]
    },
    {
      "initial_positions": [["F", 0, 1], ["F", 0, 2]],
      "targets": [[2, [["F", 1, 1], ["R", 2, 1]], [], []]],
      "boundary": [-6, 5, 0, 3],
      "wall": [-1, null]
    }
  ]
};

const exec7 = {
  "number_of_robots": 2,
  "number_of_colors": 3,
  "visibility_range": 1,
  "all_color_letters": [
    ["F", 255],
    ["L", 16711680],
    ["R", 32768]
  ],
  "opacity": false,
  "generation_mode": {
    "ProgressiveValidationByLevels": 0
  },
  "goals": [
    {
      "initial_positions": [["L", 0, 1], ["F", 0, 0]],
      "targets": [[1, [["F", 1, 0], ["L", 1, 1]], [], []]],
      "boundary": [-1, 2, -1, 2],
      "wall": [null, null]
    },
    {
      "initial_positions": [["R", 0, 0], ["F", 0, 1]],
      "targets": [[1, [["F", 1, 1], ["R", 1, 0]], [], []]],
      "boundary": [-1, 2, -1, 2],
      "wall": [null, null]
    },
    {
      "initial_positions": [["L", 0, 1], ["F", 0, 0]],
      "targets": [[2, [["R", -1, 2], ["F", -1, 1]], [], []]],
      "boundary": [-3, 2, -1, 3],
      "wall": [1, null]
    },
    {
      "initial_positions": [["R", 0, 0], ["F", 0, 1]],
      "targets": [[1, [["R", 1, 0], ["F", 1, 1]], [], []]],
      "boundary": [-1, 2, -2, 2],
      "wall": [null, -1]
    },
    {
      "initial_positions": [["L", 0, 1], ["F", 0, 0]],
      "targets": [[2, [["R", -1, 2], ["F", -1, 1]], [], [["-", 0, 2]]]],
      "boundary": [-2, 2, -1, 4],
      "wall": [1, 3]
    },
    {
      "initial_positions": [["R", 0, 1], ["F", 0, 0]],
      "targets": [[3, [["F", 1, 0], ["R", 1, -1]], [], []]],
      "boundary": [-2, 2, -2, 3],
      "wall": [-1, 2]
    },
    {
      "initial_positions": [["F", 0, 1], ["R", 0, 0]],
      "targets": [[2, [["L", -1, -1], ["F", -1, 0]], [], []]],
      "boundary": [-2, 2, -2, 2],
      "wall": [1, null]
    },
    {
      "initial_positions": [["F", 0, 2], ["R", 0, 1]],
      "targets": [[2, [["L", -1, 0], ["F", -1, 1]], [], [["-", 0, 0]]]],
      "boundary": [-2, 2, -2, 3],
      "wall": [1, -1]
    },
    {
      "initial_positions": [["L", 0, 1], ["F", 0, 0]],
      "targets": [[1, [["L", 1, 1], ["F", 1, 0]], [], []]],
      "boundary": [-1, 2, -1, 3],
      "wall": [null, 2]
    },
    {
      "initial_positions": [["L", 1, 1], ["F", 1, 0]],
      "targets": [[3, [["F", 0, 0], ["L", 0, -1]], [], []]],
      "boundary": [-1, 3, -2, 3],
      "wall": [2, 2]
    }
  ]
};

const exec8 = {
  "number_of_robots": 2,
  "number_of_colors": 2,
  "visibility_range": 2,
  "all_color_letters": [
    ["F", 255],
    ["L", 16711680]
  ],
  "opacity": true,
  "generation_mode": {
    "ProgressiveValidationByLevels": 0
  },
  "goals": [
    {
      "initial_positions": [["L", 0, 1], ["F", 0, 0]],
      "targets": [[1, [["F", 1, 0], ["L", 1, 1]], [], []]],
      "boundary": [-2, 2, -1, 3],
      "wall": [null, null]
    },
    {
      "initial_positions": [["L", 0, 1], ["F", 0, 0]],
      "targets": [[1, [["L", 1, 1], ["F", 1, 0]], [], []], [3, [["F", -1, 2], ["L", -1, 0]], [["-", 0, 2], ["-", 1, 2]], [["F", 0, 1]]]],
      "boundary": [-2, 3, -1, 3],
      "wall": [2, null]
    },
    {
      "initial_positions": [["F", 0, 0], ["L", 0, 2]],
      "targets": [[1, [["L", 1, 2], ["F", 1, 0]], [], []]],
      "boundary": [-1, 2, -1, 3],
      "wall": [null, null]
    },
    {
      "initial_positions": [["F", 0, 2], ["L", 0, 0]],
      "targets": [[1, [["F", -1, 2], ["L", -1, 0]], [], []], [3, [["L", 1, 2], ["F", 1, 1]], [["-", 0, 0], ["-", 1, 0]], [["F", 0, 1]]]],
      "boundary": [-3, 2, -1, 3],
      "wall": [-2, null]
    },
    {
      "initial_positions": [["L", 0, 1], ["F", 0, -1]],
      "targets": [[1, [["L", 1, 1], ["F", 1, -1]], [], []]],
      "boundary": [-1, 2, -2, 4],
      "wall": [null, 3]
    },
    {
      "initial_positions": [["L", 0, 1], ["F", 0, -1]],
      "targets": [[1, [["F", 1, -1], ["L", 1, 1]], [], []]],
      "boundary": [-1, 2, -2, 3],
      "wall": [null, 2]
    },
    {
      "initial_positions": [["L", 0, 1], ["F", 0, 0]],
      "targets": [[1, [["L", 1, 1], ["F", 1, 0]], [], []]],
      "boundary": [-1, 2, -1, 4],
      "wall": [null, 3]
    },
    {
      "initial_positions": [["L", 0, 1], ["F", 0, 0]],
      "targets": [[1, [["L", 1, 1], ["F", 1, 0]], [], []]],
      "boundary": [-1, 2, -1, 3],
      "wall": [null, 2]
    },
    {
      "initial_positions": [["L", 0, 1], ["F", 0, -1]],
      "targets": [[1, [["L", 1, 1], ["F", 1, -1]], [], []]],
      "boundary": [-1, 2, -4, 2],
      "wall": [null, -3]
    },
    {
      "initial_positions": [["L", 0, 1], ["F", 0, -1]],
      "targets": [[1, [["F", 1, -1], ["L", 1, 1]], [], []]],
      "boundary": [-1, 2, -3, 3],
      "wall": [null, -2]
    },
    {
      "initial_positions": [["L", 0, 1], ["F", 0, 0]],
      "targets": [[1, [["L", 1, 1], ["F", 1, 0]], [], []]],
      "boundary": [-1, 2, -3, 2],
      "wall": [null, -2]
    },
    {
      "initial_positions": [["F", 1, 2], ["L", 1, 0]],
      "targets": [[1, [["L", 0, 0], ["F", 0, 2]], [], []], [3, [["L", 2, 2], ["F", 2, 1]], [["-", 2, 0], ["-", 1, 0]], [["F", 1, 1]]]],
      "boundary": [-2, 3, -1, 5],
      "wall": [-1, 4]
    },
    {
      "initial_positions": [["F", 1, 1], ["L", 1, -1]],
      "targets": [[1, [["F", 0, 1], ["L", 0, -1]], [], []], [3, [["L", 2, 1], ["F", 2, 0]], [["-", 2, -1], ["-", 1, -1]], [["F", 1, 0]]]],
      "boundary": [-2, 3, -2, 3],
      "wall": [-1, 2]
    },
    {
      "initial_positions": [["F", 0, 0], ["L", 0, 1]],
      "targets": [[1, [["L", 1, 1], ["F", 1, 0]], [], []], [4, [["F", -2, 2], ["L", -1, 1]], [["-", 1, 1]], [["-", 1, 2], ["F", -1, 2]]]],
      "boundary": [-3, 3, -1, 4],
      "wall": [2, 3]
    },
    {
      "initial_positions": [["F", 0, 0], ["L", -1, 1]],
      "targets": [[1, [["F", 1, 0], ["L", 0, 1]], [], []]],
      "boundary": [-2, 3, -2, 2],
      "wall": [null, -1]
    },
    {
      "initial_positions": [["F", -1, 1], ["L", 0, 0]],
      "targets": [[1, [["F", -2, 1], ["L", -1, 0]], [], []], [4, [["L", 0, 0], ["F", 0, -2]], [["-", -2, -2], ["-", -2, -1], ["-", -1, -2], ["-", -1, 1], ["-", 0, 1]], [["*", 0, 0], ["*", -1, 0], ["F", -1, -1], ["F", 0, -1]]]],
      "boundary": [-4, 1, -3, 3],
      "wall": [-3, 2]
    },
    {
      "initial_positions": [["L", 0, 1], ["F", 0, -1]],
      "targets": [[1, [["L", 1, 1], ["F", 1, -1]], [], []], [3, [["L", -1, -1], ["F", -1, 0]], [["-", -1, 1], ["-", 0, 1]], [["F", 0, 0]]]],
      "boundary": [-2, 3, -2, 4],
      "wall": [2, 3]
    },
    {
      "initial_positions": [["L", 0, 1], ["F", 0, -1]],
      "targets": [[1, [["L", 1, 1], ["F", 1, -1]], [], []], [3, [["L", -1, -1], ["F", -1, 0]], [["-", -1, 1], ["-", 0, 1]], [["F", 0, 0]]]],
      "boundary": [-2, 3, -2, 3],
      "wall": [2, 2]
    },
    {
      "initial_positions": [["L", 0, 0], ["F", 0, 1]],
      "targets": [[1, [["F", -1, 1], ["L", -1, 0]], [], []], [3, [["L", 1, 1], ["F", 1, -1]], [["-", 0, -1], ["-", -1, -1]], [["F", 0, 0]]]],
      "boundary": [-3, 2, -2, 2],
      "wall": [-2, 3]
    },
    {
      "initial_positions": [["L", 0, 1], ["F", 0, 0]],
      "targets": [[1, [["F", 1, 0], ["L", 1, 1]], [], []], [4, [["F", -1, 0], ["L", -2, 0]], [["-", -2, 1]], [["*", -1, 0], ["*", -1, 1]]]],
      "boundary": [-3, 3, -1, 3],
      "wall": [2, 2]
    }
  ]
};

const algorithmPresets = [
  // ═══════════════════════════════════════════════════
  //  2r-3c-v1 (2 robots · 3 colors · visibility 1)
  // ═══════════════════════════════════════════════════
  {
    title: "2R-3C-V1 | Ex01 ★ Algo1",
    description: "Go on a line, return on next line (base paper → Algo1).",
    data: exec1
  },
  {
    title: "2R-3C-V1 | Ex02",
    description: "Return same line, horizontal turn at 5th corner.",
    data: exec5
  },
  {
    title: "2R-3C-V1 | Ex03",
    description: "Return next line at 1st corner.",
    data: exec5_2
  },
  {
    title: "2R-3C-V1 | Ex04",
    description: "Return same line, horizontal turn at corner.",
    data: exec5_3
  },
  {
    title: "2R-3C-V1 | Ex05 ⚠️ BAD",
    description: "⚠️ BAD — Go line, return next line (horizontal robots format).",
    data: exec6
  },
  {
    title: "2R-3C-V1 | Ex06 ",
    description: "like {2R-3C-V1 | Ex01 ★ Algo1} strategy but with different moving patterns.",
    data: exec7
  },

  // ═══════════════════════════════════════════════════
  //  2r-2c-v2 (2 robots · 2 colors · visibility 2)
  // ═══════════════════════════════════════════════════
  {
    title: "2R-2C-V2 | Ex01 ★ Algo2",
    description: "Go on a line, return on next line (base paper → Algo2).",
    data: exec3
  },
  {
    title: "2R-2C-V2 | Ex02",
    description: "Same as Ex01 but with complex goals.",
    data: exec2
  },

  // ═══════════════════════════════════════════════════
  //  3r-1c-v2 (3 robots · 1 color · visibility 2)
  // ═══════════════════════════════════════════════════
  {
    title: "3R-1C-V2 | Ex01 ★ Algo3",
    description: "Go on a line, return on next line (base paper → Algo3).",
    data: exec4
  },
];