import firebase, { firebaseDb as db } from '../../lib/firebaseClient';
import { RoomEntity } from '../entity';
import { IRoomRepository } from './IRepository';

interface IRoom {
  name: string;
  created_by: string;
  created_at: firebase.firestore.Timestamp;
  updated_by: string;
  updated_at: firebase.firestore.Timestamp;
}

interface INewRoom {
  name: string;
  created_by: string;
  created_at: firebase.firestore.FieldValue;
  updated_by: string;
  updated_at: firebase.firestore.FieldValue;
}

export class RoomRepository implements IRoomRepository {

  public roomReducer(
    doc:
      firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
      | firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>,
    ): RoomEntity {
    const {
      name,
      created_at,
      created_by,
      updated_at,
      updated_by,
    } = doc.data() as IRoom;
    const room: RoomEntity = {
      id: doc.id,
      name,
      created_at: created_at.toDate(),
      created_by,
      updated_at: updated_at.toDate(),
      updated_by,
    };
    return room;
  }

  public async get(id: string) {
    const result = await db
      .collection('rooms')
      .doc(id)
      .get();
    if (!result.exists) {
      return undefined;
    }
    return this.roomReducer(result);
  }

  public async getByName(uid: string, name: string) {
    const result = await db
      .collection('rooms')
      .where('created_by', '==', uid)
      .where('name', '==', name)
      .get();
    if (result.size === 0) {
      return undefined;
    }
    return this.roomReducer(result.docs[0]);
  }

  public async list(uid: string) {
    const result = await db
      .collection('rooms')
      .where('created_by', '==', uid)
      .get();
    return result.docs.map(this.roomReducer);
  }

  public async add(roomName: string, uid: string) {
    const data: INewRoom = {
      name: roomName,
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
      created_by: uid,
      updated_at: firebase.firestore.FieldValue.serverTimestamp(),
      updated_by: uid,
    };
    const result = await db
      .collection('rooms')
      .add(data);
    return this.roomReducer(await result.get());
  }
}
