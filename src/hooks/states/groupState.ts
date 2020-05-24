import Group from "models/Group";
import Player from "models/Player";
import Result from "models/Result";
import { atom } from "recoil";

export const groupIDState = atom({
  key: "groupIDState",
  default: "1",
});

export const groupState = atom<Group | undefined>({
  key: "groupState",
  default: undefined,
  dangerouslyAllowMutability: true,
});

export const loadingGroupState = atom({
  key: "loadingGroupState",
  default: true,
});

export const playersState = atom<Player[]>({
  key: "playersState",
  default: [],
  dangerouslyAllowMutability: true,
});

export const loadingPlayersState = atom({
  key: "loadingPlayersState",
  default: true,
});

export const resultsState = atom<Result[]>({
  key: "resultsState",
  default: [],
  dangerouslyAllowMutability: true,
});

export const loadingResultsState = atom({
  key: "loadingResultsState",
  default: true,
});
