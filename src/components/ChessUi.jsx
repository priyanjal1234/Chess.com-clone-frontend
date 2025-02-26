import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket, { connectSocket } from "../config/socket";
import { Chessboard } from "react-chessboard";

const ChessUi = () => {
  let { gameId } = useParams();
  const [fen, setFen] = useState("start");
  const [color, setColor] = useState("white");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    connectSocket();
    socket.emit("join-game", { gameId });

    socket.on("game-full", function (data) {
      alert(data.message);
      return;
    });

    socket.on("color-assignment", function ({ color }) {
      setColor(color);
    });

    socket.on("invalid-move", function (error) {
      // Update state rather than calling alert
      setErrorMessage(error);
      
    });

    socket.on("game-state", function (newFen) {
      setFen(newFen);
    });

    return () => {
      socket.off("game-state");
      socket.off("color-assignment");
      socket.off("invalid-move");
    };
  }, [gameId]);

  function onPieceDrop(source, target) {
    const move = source + target;
    socket.emit("move", { gameId, move });
    // Return false to let the board be controlled by the server state
    return false;
  }

  return (
    <div className="w-full h-screen bg-zinc-900 text-white flex flex-col items-center justify-center">
      <h2 className="text-xl font-semibold mb-6">Chess Game: {gameId}</h2>
      {errorMessage && (
        <div className="bg-red-500 p-2 rounded mb-4">
          {errorMessage}
        </div>
      )}
      <div className="flex justify-center items-center">
        <Chessboard
          position={fen}
          onPieceDrop={onPieceDrop}
          boardWidth={500}
          boardOrientation={color}
        />
      </div>
    </div>
  );
};

export default ChessUi;
