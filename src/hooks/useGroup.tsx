import {
  createContext,
  useContext,
  ReactNode,
  FC,
  useState,
  useEffect,
} from "react";
import Group from "../models/Group";
import Player from "../models/Player";
import Result from "../models/Result";

export type GroupContextType = {
  group?: Group;
  players: Player[];
  results: Result[];
};

export const GroupContext = createContext<GroupContextType>({
  players: [],
  results: [],
});

export const GroupProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [group, setGroup] = useState<Group>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  useEffect(() => {
    const f = async (): Promise<void> => {
      const group = await Group.get("1");
      setGroup(group);
    };
    f();
  }, []);
  useEffect(() => {
    group?.players.onSnapshot((snap) => {
      setPlayers(snap.docs.map(Player.fromSnap) || []);
    });
    const f = async (): Promise<void> => {
      const playersSnap = await group?.players.get();
      setPlayers(playersSnap?.docs.map(Player.fromSnap) || []);
    };
    f();
  }, [group]);
  useEffect(() => {
    group?.results.onSnapshot((snap) => {
      setResults(snap.docs.map(Result.fromSnap) || []);
    });
    const f = async (): Promise<void> => {
      const resultsSnap = await group?.results.get();
      setResults(resultsSnap?.docs.map(Result.fromSnap) || []);
    };
    f();
  }, [group]);
  return (
    <GroupContext.Provider
      value={{
        group,
        players,
        results,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

const useGroup = (): GroupContextType => useContext(GroupContext);

export default useGroup;
