import { firestore } from "../lib/firebase";

export default class Player {
  public constructor(
    public readonly ref: firebase.firestore.DocumentReference<
      firebase.firestore.DocumentData
    >,
    public readonly id: string,
    public readonly name: string = ""
  ) {}

  public static async get(path: string): Promise<Player> {
    const snap = await firestore.doc(path).get();
    return this.fromSnap(snap);
  }

  public static fromSnap(snap: firebase.firestore.DocumentSnapshot): Player {
    const player = new Player(snap.ref, snap.id, snap.data()?.name);
    return player;
  }
}
