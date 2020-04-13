import firebase, { firebaseDb as db } from '../../lib/firebaseClient';
import { parseLocaleISOString } from '../../util';
import { ResultSetEntity } from '../entity';
import { IResultSetRepository } from './IRepository';

export class ResultSetRepository implements IResultSetRepository {

  public static async resultSetReducer(
    doc:
      firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
      | firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>,
  ): Promise<ResultSetEntity> {
    const resultSet = doc.data() as {
      roomId: string,
      ymd: string,
      created_at: firebase.firestore.Timestamp,
      created_by: string,
      updated_at: firebase.firestore.Timestamp,
      updated_by: string,
    };
    return {
      id: doc.id,
      roomId: resultSet.roomId,
      ymd: new Date(resultSet.ymd),
      created_at: resultSet.created_at.toDate(),
      created_by: resultSet.created_by,
      updated_at: resultSet.updated_at.toDate(),
      updated_by: resultSet.updated_by,
    };
  }

  public async listByRoomAndYmd(roomId: string, ymd: Date) {
    const result = await db
      .collectionGroup('resultSets')
      .where('roomId', '==', roomId)
      .where('ymd', '==', parseLocaleISOString(ymd))
      .get();
    return Promise.all(
      result.docs.map(ResultSetRepository.resultSetReducer),
    );
  }

  public async add(resultSet: ResultSetEntity) {
    const ret = await db
      .collection('rooms')
      .doc(resultSet.roomId)
      .collection('resultSets')
      .add({
        roomId: resultSet.roomId,
        ymd: parseLocaleISOString(resultSet.ymd),
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        created_by: resultSet.created_by,
        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        updated_by: resultSet.updated_by,
      });
    return ResultSetRepository.resultSetReducer(await ret.get());
  }
}
