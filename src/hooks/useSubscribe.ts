import { useEffect } from "react";
import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";
import {
  groupIDState,
  playersState,
  resultsState,
  loadingPlayersState,
  loadingResultsState,
  groupState,
} from "hooks/states/groupState";
import Group from "models/Group";
import firebase, { firestore } from "lib/firebase";
import Player from "models/Player";
import Result from "models/Result";
import {
  uidState,
  ownerGroupsState,
  guestGroupsState,
  userLoadingState,
} from "./states/userState";

export const useSubscribe = (): void => {
  const setLoadingUser = useSetRecoilState(userLoadingState);
  const [uid, setUid] = useRecoilState(uidState);
  const [groupID, setGroupID] = useRecoilState(groupIDState);
  const group = useRecoilValue(groupState);
  const setOwners = useSetRecoilState(ownerGroupsState);
  const setGuests = useSetRecoilState(guestGroupsState);
  const setPlayers = useSetRecoilState(playersState);
  const setLoadingPlayers = useSetRecoilState(loadingPlayersState);
  const setResults = useSetRecoilState(resultsState);
  const setLoadingResults = useSetRecoilState(loadingResultsState);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        setUid("");
        setGroupID("");
        setLoadingUser(false);
        return;
      }

      const group = new Group(
        firestore.collection("groups").doc(user.uid),
        user.uid,
        "無名のグループ",
        user.uid,
        [],
        new Date()
      );
      if (!(await group.ref.get()).exists) {
        await group.create();
      }
      setGroupID(user.uid);
      setUid(user.uid);
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, [setLoadingUser, setUid, setGroupID]);

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
    if (!group) {
      return;
    }
    setLoadingResults(true);
    const unsubsc = firestore
      .collection("groups")
      .doc(group.id)
      .collection("results")
      .where(
        "createdAt",
        ">",
        firebase.firestore.Timestamp.fromDate(group.resetDate)
      )
      .orderBy("createdAt")
      .onSnapshot((snap) => {
        setLoadingResults(false);
        setResults(snap.docs.map((doc) => Result.fromSnap(doc)));
      });
    return () => unsubsc();
  }, [group, setResults, setLoadingResults]);
};
