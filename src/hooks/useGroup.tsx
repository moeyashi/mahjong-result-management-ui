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

export type GroupContextType = {
  group?: Group;
  players: Player[];
};

export const GroupContext = createContext<GroupContextType>({
  players: [],
});

export const GroupProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [group, setGroup] = useState<Group>();
  const [players, setPlayers] = useState<Player[]>([]);
  useEffect(() => {
    const f = async (): Promise<void> => {
      const group = await Group.get("1");
      setGroup(group);
    };
    f();
  }, []);
  useEffect(() => {
    const f = async (): Promise<void> => {
      const playersSnap = await group?.players.get();
      setPlayers(playersSnap?.docs.map(Player.fromSnap) || []);
    };
    f();
  }, [group]);
  return (
    <GroupContext.Provider
      value={{
        group,
        players,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

const useGroup = (): GroupContextType => useContext(GroupContext);

export default useGroup;
