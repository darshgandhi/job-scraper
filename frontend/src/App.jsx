import { Routes, Route, BrowserRouter } from "react-router-dom";
import { JobProvider } from "@/context/JobContext";
import { loadFull } from "tsparticles";
import particlesConfig from "./config/particlesConfig";
import Particles from "react-tsparticles";
import Home from "@/pages/Home";
import Jobs from "@/pages/Jobs";
import Layout from "@/pages/Layout";

function App() {
  const particlesInit = async (main) => {
    console.log("Particles Loaded! 🎉");
    await loadFull(main);
  };
  return (
    <div className="relative min-h-screen">
      {/* Particles container */}
      <Particles
        id="particles-container"
        className="absolute inset-0 z-0"
        init={particlesInit}
        options={particlesConfig}
      />

      {/* Routes */}
      <div className="relative z-10">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route
                path="jobs"
                element={
                  <JobProvider>
                    <Jobs />
                  </JobProvider>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
