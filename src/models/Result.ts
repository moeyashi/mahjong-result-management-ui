import firebase from "lib/firebase";

export default class Result {
  public readonly id: string;
  public createdAt: Date;
  public updatedAt: Date;
  public constructor(
    public readonly ref: firebase.firestore.DocumentReference<
      firebase.firestore.DocumentData
    >,
    public startPoint: number,
    public topPrize: number,
    public rankBonus: [number, number, number, number],
    public eastPlayerId: string,
    public westPlayerId: string,
    public northPlayerId: string,
    public southPlayerId: string,
    public eastPoint: number,
    public westPoint: number,
    public northPoint: number,
    public southPoint: number,
    // public //供託
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.id = ref.id;
    const date = new Date();
    this.createdAt = createdAt || date;
    this.updatedAt = updatedAt || date;
  }

  public documentData(): firebase.firestore.DocumentData {
    return {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      startPoint: this.startPoint,
      topPrize: this.topPrize,
      rankBonus: this.rankBonus,
      eastPlayerId: this.eastPlayerId,
      westPlayerId: this.westPlayerId,
      northPlayerId: this.northPlayerId,
      southPlayerId: this.southPlayerId,
      eastPoint: this.eastPoint,
      westPoint: this.westPoint,
      northPoint: this.northPoint,
      southPoint: this.southPoint,
    };
  }

  public async create(): Promise<void> {
    await this.ref.set(this.documentData());
  }

  public static fromSnap(snap: firebase.firestore.DocumentSnapshot): Result {
    const data = snap.data() || {};
    const ret = new Result(
      snap.ref,
      data.startPoint,
      data.topPrize,
      data.rankBonus,
      data.eastPlayerId,
      data.westPlayerId,
      data.northPlayerId,
      data.southPlayerId,
      data.eastPoint,
      data.westPoint,
      data.northPoint,
      data.southPoint,
      data.createdAt?.toDate(),
      data.updatedAt?.toDate()
    );
    return ret;
  }

  public validate(): string {
    const playerIds = new Set([
      this.eastPlayerId,
      this.northPlayerId,
      this.southPlayerId,
      this.westPlayerId,
    ]);
    if (Array.from(playerIds).some((id) => !id)) {
      return "プレイヤー名に入力漏れがあります";
    }
    if (playerIds.size !== 4) {
      return "プレイヤー名が重複しています";
    }
    const sum =
      this.eastPoint + this.westPoint + this.southPoint + this.northPoint;
    if (sum !== 100) {
      return "合計得点が100になりません。" + sum;
    }
    return "";
  }
}
