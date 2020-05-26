import React, { FC, ReactNode, useEffect } from "react";
import Header from "./Header";
import { useSetRecoilState, useRecoilState } from "recoil";
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
import firebase, { firestore } from "lib/firebase";
import Player from "models/Player";
import Result from "models/Result";
import { Login } from "./Login";

const App: FC<{ children: ReactNode }> = ({ children }) => {
  const [groupID, setGroupID] = useRecoilState(groupIDState);
  const setGroup = useSetRecoilState(groupState);
  const setLoadingGroup = useSetRecoilState(loadingGroupState);
  const setPlayers = useSetRecoilState(playersState);
  const setLoadingPlayers = useSetRecoilState(loadingPlayersState);
  const setResults = useSetRecoilState(resultsState);
  const setLoadingResults = useSetRecoilState(loadingResultsState);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        setGroupID("");
        return;
      }

      const group = new Group(
        firestore.collection("groups").doc(user.uid),
        user.uid,
        "",
        user.uid
      );
      if (!(await group.ref.get()).exists) {
        await group.create();
      }
      setGroupID(user.uid);
    });
    return () => unsubscribe();
  }, [setGroupID]);

  useEffect(() => {
    if (!groupID) {
      return;
    }
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
    if (!groupID) {
      return;
    }
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
    if (!groupID) {
      return;
    }
    setLoadingResults(true);
    const unsubsc = firestore
      .collection("groups")
      .doc(groupID)
      .collection("results")
      .orderBy("updatedAt")
      .onSnapshot((snap) => {
        setLoadingResults(false);
        setResults(snap.docs.map((doc) => Result.fromSnap(doc)));
      });
    return () => unsubsc();
  }, [groupID, setResults, setLoadingResults]);

  return (
    <main>
      <Header />
      {groupID ? children : <Login />}
    </main>
  );
};

export default App;
