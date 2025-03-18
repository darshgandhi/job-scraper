import { Routes, Route, BrowserRouter } from "react-router-dom";
import { JobProvider } from "@/context/JobContext";
import Home from "@/pages/Home";
import Jobs from "@/pages/Jobs";
import Layout from "@/pages/Layout";

function App() {
  return (
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
  );
}

export default App;
