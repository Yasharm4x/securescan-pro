import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<div style={{ padding: 40 }}>HOME OK</div>}
      />
      <Route
        path="/verify"
        element={<div style={{ padding: 40 }}>VERIFY OK</div>}
      />
      <Route
        path="*"
        element={<div style={{ padding: 40 }}>NOT FOUND</div>}
      />
    </Routes>
  );
};

export default App;
