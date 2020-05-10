export default class Result {
  public constructor(
    public readonly ref: firebase.firestore.DocumentReference<
      firebase.firestore.DocumentData
    >,
    public readonly id: string,
    public eastPlayerId: string,
    public westPlayerId: string,
    public northPlayerId: string,
    public southPlayerId: string,
    public eastPoint: number,
    public westPoint: number,
    public northPoint: number,
    public southPoint: number
  ) {}

  public static fromSnap(snap: firebase.firestore.DocumentSnapshot): Result {
    const data = snap.data() || {};
    const ret = new Result(
      snap.ref,
      snap.id,
      data.eastPlayerId,
      data.westPlayerId,
      data.northPlayerId,
      data.southPlayerId,
      data.eastPoint,
      data.westPoint,
      data.northPoint,
      data.southPoint
    );
    return ret;
  }
}
