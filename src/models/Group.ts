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
    public readonly ownerUid: string,
    public guestUids: string[],
    public resetDate: Date,
    public inviteParam: string = "",
    public inviteParamExpiration: Date = new Date(1900, 0, 1)
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
      guestUids: this.guestUids,
      inviteParam: this.inviteParam,
      inviteParamExpiration: this.inviteParamExpiration,
    });
  }

  public static fromSnap(snap: firebase.firestore.DocumentSnapshot): Group {
    const d = snap.data();
    const ret = new Group(
      snap.ref,
      snap.id,
      d?.name,
      d?.ownerUid,
      d?.guestUids,
      d?.resetDate.toDate(),
      d?.inviteParam,
      d?.inviteParamExpiration
    );
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
    await this.ref.update({
      resetDate: new Date(),
    });
  }
}
