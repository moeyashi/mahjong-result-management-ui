import { Order } from '../../domain/model/Order';
import firebase, { firebaseDb as db } from '../../lib/firebaseClient';
import { parseLocaleISOString } from '../../util';
import { ResultEntity } from '../entity/ResultEntity';
import { IResultRepository } from './IRepository';

export class ResultRepository implements IResultRepository {
  public static resultReducer(
    doc:
      firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
      | firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>,
  ): ResultEntity {
    const result = doc.data() as {
      roomId: string
      ymd: string
      resultSetId: string
      uname: string
      order: Order
      point: number
      created_at: firebase.firestore.Timestamp
      updated_at: firebase.firestore.Timestamp
      created_by: string
      updated_by: string,
    };
    return {
      id: doc.id,
      roomId: result.roomId,
      ymd: new Date(result.ymd),
      resultSetId: result.resultSetId,
      uname: result.uname,
      order: result.order,
      point: result.point,
      created_at: result.created_at.toDate(),
      created_by: result.created_by,
      updated_at: result.updated_at.toDate(),
      updated_by: result.updated_by,
    };
  }

  public async listByResultSet(
    roomId: string,
    resultSetId: string,
  ) {
    const results = await db
      .collection('rooms')
      .doc(roomId)
      .collection('resultSets')
      .doc(resultSetId)
      .collection('results')
      .get();
    return results.docs.map(ResultRepository.resultReducer);
  }

  public async add(result: ResultEntity) {
    const ret = await db
      .collection('rooms')
      .doc(result.roomId)
      .collection('resultSets')
      .doc(result.resultSetId)
      .collection('results')
      .add({
        roomId: result.roomId,
        ymd: parseLocaleISOString(result.ymd),
        resultSetId: result.resultSetId,
        uname: result.uname,
        order: result.order,
        point: result.point,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        created_by: result.created_by,
        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        updated_by: result.updated_by,
      });
    return ResultRepository.resultReducer(await ret.get());
  }
}
