import { RoomEntity } from '../entity';

export interface IRoomRepository {
  get(id: string): Promise<RoomEntity | undefined>;
  getByName(uid: string, name: string): Promise<RoomEntity | undefined>;
  list(uid: string): Promise<RoomEntity[]>;
  add(roomName: string, uid: string): Promise<RoomEntity>;
}
