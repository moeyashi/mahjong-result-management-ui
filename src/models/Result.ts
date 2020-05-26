import firebase from "lib/firebase";

export type PlayerResult = {
  id: string;
  point: number;
  order: number;
  rankBonus: number;
  topPrize: number;
  priority: number;
};

export type PlayerMap = {
  east: PlayerResult;
  west: PlayerResult;
  south: PlayerResult;
  north: PlayerResult;
};

const initPlayerMap = (
  eastPlayerId: string,
  westPlayerId: string,
  northPlayerId: string,
  southPlayerId: string,
  eastPoint: number,
  westPoint: number,
  northPoint: number,
  southPoint: number
): PlayerMap => ({
  east: {
    id: eastPlayerId,
    point: eastPoint,
    order: 0,
    rankBonus: 0,
    topPrize: 0,
    priority: 1,
  },
  south: {
    id: southPlayerId,
    point: southPoint,
    order: 0,
    rankBonus: 0,
    topPrize: 0,
    priority: 2,
  },
  west: {
    id: westPlayerId,
    point: westPoint,
    order: 0,
    rankBonus: 0,
    topPrize: 0,
    priority: 3,
  },
  north: {
    id: northPlayerId,
    point: northPoint,
    order: 0,
    rankBonus: 0,
    topPrize: 0,
    priority: 4,
  },
});

export default class Result {
  public readonly id: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly playerMap: PlayerMap;
  public constructor(
    public readonly ref: firebase.firestore.DocumentReference<
      firebase.firestore.DocumentData
    >,
    public readonly startPoint: number,
    public readonly topPrize: number,
    public readonly rankBonus: [number, number, number, number],
    public readonly eastPlayerId: string,
    public readonly westPlayerId: string,
    public readonly northPlayerId: string,
    public readonly southPlayerId: string,
    public readonly eastPoint: number,
    public readonly westPoint: number,
    public readonly northPoint: number,
    public readonly southPoint: number,
    // public //供託
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.id = ref.id;
    const date = new Date();
    this.createdAt = createdAt || date;
    this.updatedAt = updatedAt || date;
    const playerMap = initPlayerMap(
      eastPlayerId,
      westPlayerId,
      northPlayerId,
      southPlayerId,
      eastPoint,
      westPoint,
      northPoint,
      southPoint
    );
    Object.entries(playerMap)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .sort(([_, p1], [__, p2]) => {
        const point = p2.point - p1.point;
        if (point !== 0) {
          return point;
        }
        return p1.priority - p2.priority;
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .forEach(([_, p], idx) => {
        p.rankBonus = rankBonus[idx];
        p.order = idx + 1;
        p.topPrize = idx === 0 ? topPrize * 4 : -1 * topPrize;
      });
    this.playerMap = playerMap;
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
