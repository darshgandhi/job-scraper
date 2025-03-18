const ParticleConfig = {
  particles: {
    number: {
      value: 100, // Increase the number of particles to make them more visible
    },
    size: {
      value: 5, // Increase the size to make them easier to see
    },
    move: {
      speed: 2,
    },
    opacity: {
      value: 0.5, // Set particle opacity to make them visible
    },
    shape: {
      type: "circle", // Shape of particles
    },
    color: {
      value: "#ff0000", // Particle color (red for visibility)
    },
  },
  interactivity: {
    events: {
      onhover: {
        enable: true,
        mode: "repulse", // Make particles react when hovered
      },
    },
  },
};

export default ParticleConfig;
