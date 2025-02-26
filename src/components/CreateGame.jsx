import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { disconnectSocket } from "../config/socket";

const CreateGame = () => {
  const [name, setname] = useState("");
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    disconnectSocket();
  }, []);

  useEffect(() => {
    async function fetchRunningGames() {
      try {
        let runningGamesRes = await axios.get(
          "https://chess-com-clone-backend.onrender.com/api/games/running-games",
          { withCredentials: true }
        );
        if (runningGamesRes.status === 200) {
          setGames(runningGamesRes.data);
        }
      } catch (error) {
        console.log(error?.response?.data?.message);
      }
    }
    fetchRunningGames();
  }, []);

  async function handleCreateGame(e) {
    e.preventDefault();

    try {
      let response = await axios.post(
        "https://chess-com-clone-backend.onrender.com/api/games/create-game",
        { name },
        { withCredentials: true }
      );
      if (response.status === 201) {
        navigate(`/game/${response?.data?._id}`);
        setname("");
      }
    } catch (error) {
      alert(error?.response?.data?.message);
    }
  }

  async function handleJoinGame(gameId) {
    try {
      let joinRoomRes = await axios.put(
        `https://chess-com-clone-backend.onrender.com/api/games/join-game/${gameId}`,
        {},
        { withCredentials: true }
      );
      if (joinRoomRes.status === 200) {
        navigate(`/game/${gameId}`);
      }
    } catch (error) {
      alert(error?.response?.data?.message);
    }
  }

  return (
    <div className="w-full h-screen bg-zinc-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-2xl font-semibold mb-5">
        Create Game or Join Existing One
      </h1>

      <form onSubmit={handleCreateGame}>
        <input
          type="text"
          name="name"
          placeholder="Enter Game Name"
          value={name}
          onChange={(e) => setname(e.target.value)}
          className="px-3 py-2 bg-zinc-700 outline-none"
        />
        <button className="px-3 py-2 bg-blue-600 ml-4 rounded-lg" type="submit">
          Create
        </button>
      </form>

      <div className="mt-5">
        {games?.map((game) => (
          <div className="px-3 py-2 w-[200px] rounded-lg bg-zinc-700 mt-4 flex items-center justify-between">
            <div>
              <h2>{game?.name}</h2>
              <h2>{game?.players} Player</h2>
            </div>
            <button
              onClick={() => handleJoinGame(game?._id)}
              className="px-3 py-2 bg-blue-600 rounded-lg"
            >
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateGame;
