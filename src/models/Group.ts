import { firestore } from "../lib/firebase";
import Result from "./Result";
import Player from "./Player";

export default class Group {
  public players: firebase.firestore.CollectionReference<
    firebase.firestore.DocumentData
  >;

  public results: firebase.firestore.CollectionReference<
    firebase.firestore.DocumentData
  >;

  public constructor(
    public readonly ref: firebase.firestore.DocumentReference<
      firebase.firestore.DocumentData
    >,
    public readonly id: string,
    public readonly name: string = ""
  ) {
    this.players = ref.collection("players");
    this.results = ref.collection("results");
  }

  public static async get(id: string): Promise<Group | undefined> {
    const snap = await firestore.collection("groups").doc(id).get();
    if (!snap.exists) {
      return undefined;
    }
    return this.fromSnap(snap);
  }

  public static fromSnap(snap: firebase.firestore.DocumentSnapshot): Group {
    const ret = new Group(snap.ref, snap.id, snap.data()?.name);
    return ret;
  }

  public async addPlayer(name: string): Promise<Player> {
    const result = await this.players.add({
      name,
    });
    return Player.fromSnap(await result.get());
  }

  public async getOrCreatePlayer(
    players: Player[],
    name: string
  ): Promise<Player> {
    const gotPlayer = players.find((p) => p.name === name);
    if (gotPlayer) {
      return gotPlayer;
    }
    return await this.addPlayer(name);
  }

  public async addResult(
    players: Player[],
    eastPlayerName: string,
    westPlayerName: string,
    northPlayerName: string,
    southPlayerName: string,
    eastPoint: number,
    westPoint: number,
    northPoint: number,
    southPoint: number
  ): Promise<Result> {
    const eastPlayer = await this.getOrCreatePlayer(players, eastPlayerName);
    const westPlayer = await this.getOrCreatePlayer(players, westPlayerName);
    const northPlayer = await this.getOrCreatePlayer(players, northPlayerName);
    const southPlayer = await this.getOrCreatePlayer(players, southPlayerName);
    const result = await this.results.add({
      eastPlayerId: eastPlayer.id,
      westPlayerId: westPlayer.id,
      northPlayerId: northPlayer.id,
      southPlayerId: southPlayer.id,
      eastPoint,
      westPoint,
      northPoint,
      southPoint,
    });
    return Result.fromSnap(await result.get());
  }
}
