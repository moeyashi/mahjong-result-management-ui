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
  loadingGroup: boolean;
  players: Player[];
  loadingPlayers: boolean;
  results: Result[];
  loadingResults: boolean;
};

export const GroupContext = createContext<GroupContextType>({
  loadingGroup: true,
  players: [],
  loadingPlayers: true,
  results: [],
  loadingResults: true,
});

export const GroupProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [group, setGroup] = useState<Group>();
  const [loadingGroup, setLoadingGroup] = useState(true);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [results, setResults] = useState<Result[]>([]);
  const [loadingResults, setLoadingResults] = useState(true);
  useEffect(() => {
    const f = async (): Promise<void> => {
      const group = await Group.get("1");
      setGroup(group);
      setLoadingGroup(false);
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
      setLoadingPlayers(false);
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
      setLoadingResults(false);
    };
    f();
  }, [group]);
  return (
    <GroupContext.Provider
      value={{
        group,
        loadingGroup,
        players,
        loadingPlayers,
        results,
        loadingResults,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

const useGroup = (): GroupContextType => useContext(GroupContext);

export default useGroup;
