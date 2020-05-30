import { useEffect } from "react";
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
import {
  uidState,
  ownerGroupsState,
  guestGroupsState,
} from "./states/userState";

export const useSubscribe = (): void => {
  const [uid, setUid] = useRecoilState(uidState);
  const [groupID, setGroupID] = useRecoilState(groupIDState);
  const setOwners = useSetRecoilState(ownerGroupsState);
  const setGuests = useSetRecoilState(guestGroupsState);
  const setGroup = useSetRecoilState(groupState);
  const setLoadingGroup = useSetRecoilState(loadingGroupState);
  const setPlayers = useSetRecoilState(playersState);
  const setLoadingPlayers = useSetRecoilState(loadingPlayersState);
  const setResults = useSetRecoilState(resultsState);
  const setLoadingResults = useSetRecoilState(loadingResultsState);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        setUid("");
        setGroupID("");
        return;
      }

      const group = new Group(
        firestore.collection("groups").doc(user.uid),
        user.uid,
        "無名のグループ",
        user.uid,
        []
      );
      if (!(await group.ref.get()).exists) {
        await group.create();
      }
      setGroupID(user.uid);
      setUid(user.uid);
    });
    return () => unsubscribe();
  }, [setUid, setGroupID]);

  useEffect(() => {
    if (!uid) {
      return;
    }
    const unsubsc = firestore
      .collection("groups")
      .where("ownerUid", "==", uid)
      .onSnapshot((snap) => {
        setOwners(snap.docs.map((doc) => Group.fromSnap(doc)));
      });
    return () => unsubsc();
  }, [uid, setOwners]);

  useEffect(() => {
    if (!uid) {
      return;
    }
    const unsubsc = firestore
      .collection("groups")
      .where("guestUid", "array-contains", uid)
      .onSnapshot((snap) => {
        setGuests(snap.docs.map((doc) => Group.fromSnap(doc)));
      });
    return () => unsubsc();
  }, [uid, setGuests]);

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
};
