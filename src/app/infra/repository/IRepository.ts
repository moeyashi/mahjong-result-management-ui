import { AddEntity, ResultEntity, ResultSetEntity, RoomEntity } from '../entity';

// TODO uidはinteractorで入れるべきかな
//     modelからupdated~とかを削除すれば良いんだと思う
export interface IRoomRepository {
  get(id: string): Promise<RoomEntity | undefined>;
  getByName(uid: string, name: string): Promise<RoomEntity | undefined>;
  list(uid: string): Promise<RoomEntity[]>;
  add(roomName: string, uid: string): Promise<RoomEntity>;
}

export interface IResultRepository {
  listByResultSet(roomId: string, resultSetId: string): Promise<ResultEntity[]>;
  add(result: AddEntity<ResultEntity>): Promise<ResultEntity>;
}

export interface IResultSetRepository {
  listByRoomAndYmd(roomId: string, ymd: Date): Promise<ResultSetEntity[]>;
  add(resultSet: AddEntity<ResultSetEntity>): Promise<ResultSetEntity>;
}
