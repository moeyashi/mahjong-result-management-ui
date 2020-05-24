import React, { FC, ReactNode, useEffect } from "react";
import Header from "./Header";
import { useSetRecoilState, useRecoilValue } from "recoil";
import {
  groupState,
  groupIDState,
  playersState,
  resultsState,
  loadingGroupState,
  loadingPlayersState,
  loadingResultsState,
} from "hooks/states/groupState";
import Group from "models/Group";
import { firestore } from "lib/firebase";
import Player from "models/Player";
import Result from "models/Result";

const App: FC<{ children: ReactNode }> = ({ children }) => {
  const groupID = useRecoilValue(groupIDState);
  const setGroup = useSetRecoilState(groupState);
  const setLoadingGroup = useSetRecoilState(loadingGroupState);
  const setPlayers = useSetRecoilState(playersState);
  const setLoadingPlayers = useSetRecoilState(loadingPlayersState);
  const setResults = useSetRecoilState(resultsState);
  const setLoadingResults = useSetRecoilState(loadingResultsState);
  useEffect(() => {
    setLoadingGroup(true);
    const unsubsc = firestore
      .collection("groups")
      .doc(groupID)
      .onSnapshot((snap) => {
        setGroup(Group.fromSnap(snap));
        setLoadingGroup(false);
      });
    return () => unsubsc();
  }, [groupID, setGroup, setLoadingGroup]);
  useEffect(() => {
    setLoadingPlayers(true);
    const unsubsc = firestore
      .collection("groups")
      .doc(groupID)
      .collection("players")
      .onSnapshot((snap) => {
        setLoadingPlayers(false);
        setPlayers(snap.docs.map((doc) => Player.fromSnap(doc)));
      });
    return () => unsubsc();
  }, [groupID, setPlayers, setLoadingPlayers]);
  useEffect(() => {
    setLoadingResults(true);
    const unsubsc = firestore
      .collection("groups")
      .doc(groupID)
      .collection("results")
      .onSnapshot((snap) => {
        setLoadingResults(false);
        setResults(snap.docs.map((doc) => Result.fromSnap(doc)));
      });
    return () => unsubsc();
  }, [groupID, setResults, setLoadingResults]);
  return (
    <main>
      <Header />
      {children}
    </main>
  );
};

export default App;
