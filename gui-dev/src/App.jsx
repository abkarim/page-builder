import { Route, Routes } from "react-router-dom";
import Builder from "./components/pages/Builder";
import Dashboard from "./components/pages/Dashboard";
import NotFound from "./components/pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/builder" element={<Builder />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
