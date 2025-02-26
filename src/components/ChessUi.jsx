import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket, { connectSocket } from "../config/socket";
import { Chessboard } from "react-chessboard";

const ChessUi = () => {
  let { gameId } = useParams();
  const [fen, setfen] = useState("start");
  const [color, setcolor] = useState("white");

  useEffect(() => {
    connectSocket();

    socket.emit("join-game", { gameId });

    socket.on("game-full", function (data) {
      alert(data.message);
      return;
    });

    socket.on("color-assignment", function ({ color }) {
      setcolor(color);
    });

    socket.on("invalid-move", function (error) {
      alert(error);
    });

    socket.on("game-state", function (newFen) {
      setfen(newFen);
    });

    return () => {
      socket.off("game-state");
      socket.off("color-assignment");
      socket.off("invalid-move");
    };
  }, []);

  function onPieceDrop(source, target) {
    const move = source + target;
    console.log("Move attempted:", move);
    socket.emit("move", { gameId, move });
  }

  return (
    <div className="w-full h-screen bg-zinc-900 text-white flex flex-col items-center justify-center">
      <h2 className="text-xl font-semibold mb-6">Chess Game: {gameId}</h2>

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
