import App from "../components/App";
import { NextPage } from "next";
import { useState, useEffect } from "react";
import Player from "../models/Player";
import Group from "../models/Group";

const Index: NextPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  useEffect(() => {
    let unmounted = false;
    const f = async (): Promise<void> => {
      const group = await Group.get("1");
      const playersSnap = await group?.players.get();
      if (!unmounted) {
        setPlayers(playersSnap?.docs.map(Player.fromSnap) || []);
      }
    };
    f();
    const cleanup = (): void => {
      unmounted = true;
    };
    return cleanup;
  }, []);
  return (
    <App>
      <p>Index Page</p>
      {players.map((player) => (
        <p key={player.ref.path}>{player.name}</p>
      ))}
    </App>
  );
};

export default Index;
