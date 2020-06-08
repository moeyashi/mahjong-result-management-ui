export type Role = "owner" | "editor" | "member";

export type TGroupMember = {
  ref: firebase.firestore.DocumentReference;
  name: string;
  role: Role;
};

export class GroupMember implements TGroupMember {
  public ref: firebase.firestore.DocumentReference;
  public id: string;
  public name: string;
  public role: Role;

  public constructor(data: TGroupMember) {
    this.ref = data.ref;
    this.id = data.ref.id;
    this.name = data.name;
    this.role = data.role;
  }

  public static fromSnap(
    snap: firebase.firestore.DocumentSnapshot
  ): GroupMember {
    const d = snap.data();
    return new GroupMember({
      ref: snap.ref,
      name: d?.name || "",
      role: d?.role || "member",
    });
  }

  public createDocument(): firebase.firestore.DocumentData {
    return {
      name: this.name,
      role: this.role,
    };
  }

  public async create(): Promise<void> {
    await this.ref.set(this.createDocument());
  }
}
