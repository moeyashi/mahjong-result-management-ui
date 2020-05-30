import Group from "models/Group";
import Player from "models/Player";
import Result from "models/Result";
import { atom, selector } from "recoil";

export const groupIDState = atom({
  key: "groupIDState",
  default: "",
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

export const resultPlayerNames = selector({
  key: "resultPlayerNames",
  get: ({ get }) => {
    const players = get(playersState);
    return get(resultsState).reduce((ret: { [key: string]: string }, r) => {
      const ids = [
        r.eastPlayerId,
        r.westPlayerId,
        r.northPlayerId,
        r.southPlayerId,
      ];
      ids.forEach((id) => {
        if (!ret[id]) {
          ret[id] = players.find((p) => p.id === id)?.name || "";
        }
      });
      return ret;
    }, {});
  },
});

export const resultSummaryState = selector({
  key: "resultSummaryState",
  get: ({ get }) =>
    get(resultsState).reduce((ret: { [key: string]: number }, r) => {
      Object.values(r.playerMap).forEach((p) => {
        if (!ret[p.id]) {
          ret[p.id] =
            p.point - r.startPoint + p.rankBonus + p.topPrize + p.extraPoint;
        } else {
          ret[p.id] +=
            p.point - r.startPoint + p.rankBonus + p.topPrize + p.extraPoint;
        }
      });
      return ret;
    }, {}),
});

export const loadingResultsState = atom({
  key: "loadingResultsState",
  default: true,
});
