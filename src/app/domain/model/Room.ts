export interface IRoom {
  id: string;
  name: string;
  createdBy: string;
  createdAt?: Date;
  updatedBy: string;
  updatedAt?: Date;
}

export class Room implements IRoom {
  public id: string;
  public name: string;
  public createdBy: string;
  public createdAt: Date;
  public updatedBy: string;
  public updatedAt: Date;
  constructor({
    id,
    name,
    createdBy,
    createdAt = new Date(),
    updatedBy,
    updatedAt = new Date(),
  }: IRoom) {
    this.id = id;
    this.name = name;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedBy = updatedBy;
    this.updatedAt = updatedAt;
  }
}
