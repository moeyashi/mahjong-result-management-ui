import { atom } from "recoil";
import Group from "models/Group";

export const uidState = atom({
  key: "uidState",
  default: "",
});

export const ownerGroupsState = atom<Group[]>({
  key: "ownerGroupsState",
  default: [],
  dangerouslyAllowMutability: true,
});

export const guestGroupsState = atom<Group[]>({
  key: "guestGroupsState",
  default: [],
  dangerouslyAllowMutability: true,
});
