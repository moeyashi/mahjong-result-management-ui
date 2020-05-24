import { firestore } from "../lib/firebase";

export default class Player {
  public readonly id: string;
  public constructor(
    public readonly ref: firebase.firestore.DocumentReference<
      firebase.firestore.DocumentData
    >,
    public readonly name: string
  ) {
    this.id = ref.id;
  }

  public static async get(path: string): Promise<Player> {
    const snap = await firestore.doc(path).get();
    return this.fromSnap(snap);
  }

  public documentData(): firebase.firestore.DocumentData {
    return {
      name: this.name,
    };
  }

  public async create(): Promise<void> {
    await this.ref.set(this.documentData());
  }

  public static fromSnap(snap: firebase.firestore.DocumentSnapshot): Player {
    const player = new Player(snap.ref, snap.data()?.name);
    return player;
  }
}
