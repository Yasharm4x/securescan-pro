import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "white" }}>
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
    </div>
  );
};

export default App;
