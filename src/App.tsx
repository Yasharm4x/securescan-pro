import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { VerificationPage } from "./components/VerificationPage";
import NotFound from "./pages/NotFound";

const App = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/verify" element={<VerificationPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
