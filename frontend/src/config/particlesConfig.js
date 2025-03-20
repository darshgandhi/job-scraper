const particlesConfig = {
  background: {
    color: {
      value: "#f8f9fa",
    },
  },
  particles: {
    number: {
      value: 60,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    color: {
      value: ["#3b82f6", "#2563eb", "#1d4ed8"],
    },
    shape: {
      type: "circle",
      polygon: {
        sides: 4,
      },
    },
    opacity: {
      value: 0.1,
      random: true,
      anim: {
        enable: true,
        speed: 0.3,
        opacity_min: 0.1,
        sync: false,
      },
    },
    size: {
      value: 4,
      random: true,
      anim: {
        enable: true,
        speed: 1,
        size_min: 0.5,
        sync: false,
      },
    },
    move: {
      enable: true,
      speed: 1,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "bounce",
      bounce: true,
      attract: {
        enable: false,
      },
    },
    lineLinked: {
      enable: true,
      distance: 150,
      color: "#3b82f6",
      opacity: 0.2,
      width: 1,
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onHover: {
        enable: true,
        mode: "grab",
      },
      onClick: {
        enable: true,
        mode: "push",
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 160,
        lineLinked: {
          opacity: 0.5,
        },
      },
      push: {
        particles_nb: 6,
      },
    },
  },
  retina_detect: true,
};

export default particlesConfig;
