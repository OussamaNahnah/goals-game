// Default color list: letter -> integer RGB code
// These match the Rust backend format (e.g. 255 = #0000FF = blue)
// This file can be overwritten by the Rust server with actual colors
const defaultColorList = {
    F: 255,
    L: 16711680,
    R: 32768,
};

// Simulation parameters
const defaultNumRobots = 2;   // number of robots in the swarm
const defaultVisibility = 1;  // sensing/visibility radius (in grid units)
