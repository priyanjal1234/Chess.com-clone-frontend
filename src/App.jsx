import React from "react";
import { Routes, Route } from "react-router-dom";
import CreateGame from "./components/CreateGame";
import ChessUi from "./components/ChessUi";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<CreateGame />} />
        <Route path="/game/:gameId" element={<ChessUi />} />
      </Routes>
    </div>
  );
};

export default App;
