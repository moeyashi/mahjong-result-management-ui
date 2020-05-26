import { firestore } from "../lib/firebase";
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
    public readonly name: string = "",
    public readonly ownerUid: string
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

  public async create(): Promise<void> {
    await this.ref.set({
      ownerUid: this.ownerUid,
    });
  }

  public static fromSnap(snap: firebase.firestore.DocumentSnapshot): Group {
    const d = snap.data();
    const ret = new Group(snap.ref, snap.id, d?.name, d?.ownerUid);
    return ret;
  }

  public async addPlayer(name: string): Promise<Player> {
    const result = await this.players.add({
      name,
    });
    return Player.fromSnap(await result.get());
  }

  public getOrCreatePlayer(
    players: Player[],
    name: string
  ): { new: boolean; player: Player } {
    const gotPlayer = players.find((p) => p.name === name);
    if (gotPlayer) {
      return { new: false, player: gotPlayer };
    }
    return { new: true, player: new Player(this.players.doc(), name) };
  }

  public async reset(): Promise<void> {
    const batch = firestore.batch();
    const players = await this.players.get();
    const results = await this.results.get();
    players.forEach((doc) => batch.delete(doc.ref));
    results.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }
}
