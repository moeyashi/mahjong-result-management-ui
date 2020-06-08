import firebase, { firestore } from "../lib/firebase";
import Player from "./Player";
import { GroupMember } from "./GroupMember";

const resetDateDefault = new Date(2000, 0, 1);

export default class Group {
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
  ) {}

  public players(): firebase.firestore.CollectionReference {
    return this.ref.collection("players");
  }

  public results(): firebase.firestore.CollectionReference {
    return this.ref.collection("results");
  }

  public members(): firebase.firestore.CollectionReference {
    return this.ref.collection("members");
  }

  public static async get(id: string): Promise<Group | undefined> {
    const snap = await firestore.collection("groups").doc(id).get();
    if (!snap.exists) {
      return undefined;
    }
    return this.fromSnap(snap);
  }

  public createDocument(): firebase.firestore.DocumentData {
    return {
      name: this.name,
      ownerUid: this.ownerUid,
      guestUids: this.guestUids,
      resetDate: resetDateDefault,
      inviteParam: this.inviteParam,
      inviteParamExpiration: this.inviteParamExpiration,
    };
  }

  public async create(): Promise<void> {
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error("need login");
    }
    if (!firestore) {
      throw new Error("firestore is not initted");
    }
    const member = new GroupMember({
      ref: this.members().doc(user.uid),
      name: user.displayName || "オーナー",
      role: "owner",
    });
    const batch = firestore.batch();
    batch.set(this.ref, this.createDocument());
    batch.set(member.ref, member.createDocument());
    await batch.commit();
  }

  public static fromSnap(snap: firebase.firestore.DocumentSnapshot): Group {
    const d = snap.data();
    const ret = new Group(
      snap.ref,
      snap.id,
      d?.name,
      d?.ownerUid,
      d?.guestUids,
      d?.resetDate?.toDate() || resetDateDefault,
      d?.inviteParam,
      d?.inviteParamExpiration?.toDate() || resetDateDefault
    );
    return ret;
  }

  public async addPlayer(name: string): Promise<Player> {
    const result = await this.players().add({
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
    return { new: true, player: new Player(this.players().doc(), name) };
  }

  public async reset(): Promise<void> {
    await this.ref.update({
      resetDate: new Date(),
    });
  }

  private _inviteURL(inviteParam: string): string {
    if (!inviteParam) {
      return "";
    }
    return `https://${location.hostname}/join-group?groupId=${this.id}&inviteParam=${inviteParam}`;
  }

  public inviteURL(): string {
    return this._inviteURL(this.inviteParam);
  }

  public async createInviteURL(inviteParamExpiration: Date): Promise<string> {
    const inviteParam = this.ref.collection("hoge").doc().id;
    await this.ref.update({
      inviteParam,
      inviteParamExpiration,
    });
    return this._inviteURL(inviteParam);
  }

  public async addMember(
    uid: string,
    name: string,
    inviteParam: string
  ): Promise<string> {
    if (!firestore) {
      return "firestore is not initted";
    }
    if (this.inviteParam !== inviteParam) {
      return "招待URLが正しくありません。";
    }
    if (this.inviteParamExpiration.getTime() < new Date().getTime()) {
      return "招待URLの有効期限が切れています。";
    }
    const m = new GroupMember({
      ref: this.members().doc(uid),
      name,
      role: "member",
    });
    const batch = firestore.batch();
    batch.set(m.ref, m.createDocument());
    batch.update(this.ref, {
      guestUids: firebase.firestore.FieldValue.arrayUnion(uid),
    });
    await batch.commit();
    return "";
  }
}
