import { RoomEntity } from '../../infra/entity';
import { IRoomRepository } from '../../infra/repository';
import firebase from '../../lib/firebaseClient';
import { Room } from '../model';

export interface IRoomInteractor {
  list(uid?: string): Promise<Room[]>;
  add(roomName: string): Promise<Room>;
}

export class RoomInteractor implements IRoomInteractor {
  public repository: IRoomRepository;
  constructor(repository: IRoomRepository) {
    this.repository = repository;
  }

  public roomReducer({
    id,
    name,
    created_by,
    created_at,
    updated_by,
    updated_at,
  }: RoomEntity): Room {
    return new Room({
      id,
      name,
      createdBy: created_by,
      createdAt: created_at,
      updatedBy: updated_by,
      updatedAt: updated_at,
    });
  }

  public async list(uid?: string) {
    if (!uid) {
      return new Promise<Room[]>((resolve) => resolve([]));
    }
    return (await this.repository.list(uid)).map(this.roomReducer);
  }

  public async add(roomName: string) {
    const uid = firebase.auth().currentUser?.uid;
    if (!uid) {
      throw new Error('no logged in user');
    }
    if (!!(await this.repository.getByName(uid, roomName))) {
      throw new Error('Room name is duplicated');
    }
    return this.roomReducer(await this.repository.add(roomName, uid));
  }
}
