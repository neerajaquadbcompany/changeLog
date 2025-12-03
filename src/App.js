import React from "react";
import Login from "./pages/Login";
import ChangeLogpage from "./pages/ChangeLog";
import ChangeLogDetails from "./pages/ChangelogDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChangeLogpage />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/changelog/:id"
          element={
            
              <ChangeLogDetails />
            
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
