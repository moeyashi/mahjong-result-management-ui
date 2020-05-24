import { useRecoilCallback } from "recoil";
import { resultsState, groupState, playersState } from "./states/groupState";
import Result from "models/Result";
import { firestore } from "lib/firebase";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useAddResult = () => {
  return useRecoilCallback(
    async (
      { getPromise, set },
      eastPlayerName: string,
      westPlayerName: string,
      northPlayerName: string,
      southPlayerName: string,
      eastPoint: number,
      westPoint: number,
      northPoint: number,
      southPoint: number
    ) => {
      const group = await getPromise(groupState);
      if (!group) {
        throw new Error("グループが未取得");
      }
      const players = await getPromise(playersState);
      const ps = [
        group.getOrCreatePlayer(players, eastPlayerName),
        group.getOrCreatePlayer(players, westPlayerName),
        group.getOrCreatePlayer(players, northPlayerName),
        group.getOrCreatePlayer(players, southPlayerName),
      ];
      const [eastPlayer, westPlayer, northPlayer, southPlayer] = ps;
      const result = new Result(
        group.results.doc(),
        eastPlayer.player.id,
        westPlayer.player.id,
        northPlayer.player.id,
        southPlayer.player.id,
        eastPoint,
        westPoint,
        northPoint,
        southPoint
      );

      set(playersState, [
        ...players,
        ...ps.filter((p) => p.new).map((p) => p.player),
      ]);
      set(resultsState, (results) => [...results, result]);

      const batch = firestore.batch();
      ps.forEach(({ player }) => batch.set(player.ref, player.documentData()));
      batch.set(result.ref, result.documentData());
      await batch.commit();
    }
  );
};
