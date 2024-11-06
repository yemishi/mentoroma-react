import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container, CssBaseline } from "@mui/material";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import Header from "./components/Header";

const App: React.FC = () => {
  return (
    <Router>
      <CssBaseline />
      <Header />

      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </Container>
    </Router>

  );
};

export default App;
