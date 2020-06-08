import { useRecoilCallback } from "recoil";
import { resultsState, groupState, playersState } from "./states/groupState";
import Result from "models/Result";
import { firestore } from "lib/firebase";
import { round } from "utils/round";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useAddResult = () => {
  return useRecoilCallback(
    async (
      { getPromise, set },
      eastPlayerName: string,
      southPlayerName: string,
      westPlayerName: string,
      northPlayerName: string,
      eastPoint: number,
      southPoint: number,
      westPoint: number,
      northPoint: number,
      eastExtraPoint: number,
      southExtraPoint: number,
      westExtraPoint: number,
      northExtraPoint: number
    ) => {
      const playerNames = new Set([
        eastPlayerName,
        westPlayerName,
        northPlayerName,
        southPlayerName,
      ]);
      if (Array.from(playerNames).some((id) => !id)) {
        return "プレイヤー名に入力漏れがあります";
      }
      if (playerNames.size !== 4) {
        return "プレイヤー名が重複しています";
      }
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
        group.results().doc(),
        25,
        5,
        [20, 10, -10, -20],
        eastPlayer.player.id,
        westPlayer.player.id,
        northPlayer.player.id,
        southPlayer.player.id,
        round(eastPoint / 10, 1),
        round(westPoint / 10, 1),
        round(northPoint / 10, 1),
        round(southPoint / 10, 1),
        round(eastExtraPoint / 10, 1),
        round(westExtraPoint / 10, 1),
        round(northExtraPoint / 10, 1),
        round(southExtraPoint / 10, 1)
      );
      const ng = result.validate();
      if (ng) {
        return ng;
      }

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
