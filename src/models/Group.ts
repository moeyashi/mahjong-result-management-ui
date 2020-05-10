import { firestore } from "../lib/firebase";

export default class Group {
  public players: firebase.firestore.CollectionReference<
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
}
