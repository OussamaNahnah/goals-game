# Plan: Add Movement Panel with Toggle

## Structure
```
main-container
├── simulator-column (left - grids/canvas)
├── resize-handle
│   ├── toggleMovementBtn → toggles movement-column
│   └── toggleEditorBtn → toggles editor-column
└── movement-column (default OPEN)
└── editor-column (default CLOSED)
```

## Implemented Changes

### 1. Toggle Buttons in Resize Handle
- `toggleMovementBtn` (green) - toggles movement panel
- `toggleEditorBtn` (gray) - toggles editor panel
- Stacked vertically with gap

### 2. Movement Panel Components

#### Goal Selector
- Dropdown to list all available goals
- On selection: loads first grid's robots + boundaries to movement grid

#### Grid Controls
- X min/max inputs
- Y min/max inputs  
- Apply button to update boundary

#### Grid Canvas
- 300x300px canvas
- Black solid border (unlike goals grids which have dashed borders)
- Same visual style as goal grids (grid lines, axes)
- Can select and drag robots

#### Wall Alignment Logic
- Goals use relative positions; movement grid uses real positions
- Wall alignment shifts robots based on wall position:
  - Negative wall (e.g., -5): robots must be > wall position
  - Positive wall (e.g., 5): robots must be < wall position
- Robots are proportionally mapped within valid range (excluding wall)
- If no wall, robots use original relative coordinates

### 3. Editor Panel
- Existing `editor-column` (JSON textarea)
- Default state: **CLOSED**

### 4. Toggle Logic (Mutually Exclusive)
- Only **one panel** can be open at a time
- Clicking a toggle closes the other panel

### 5. Visual States
| Element | Closed | Open |
|---------|--------|------|
| Movement btn | Gray bg | Green bg |
| Editor btn | Gray bg | White bg |

## Files Modified
- `index.html`: Toggle buttons, movement panel, goal selector, grid controls, movement grid JS