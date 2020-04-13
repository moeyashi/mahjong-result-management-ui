import { ResultEntity, ResultSetEntity } from '../../infra/entity';
import { IResultRepository, IResultSetRepository } from '../../infra/repository';
import firebase from '../../lib/firebaseClient';
import { Result, ResultSet } from '../model';

export class ResultSetInteractor {

  public static resultReducer(result: ResultEntity): Result {
    return new Result({
      uname: result.uname,
      order: result.order,
      point: result.point,
    });
  }

  public static resultSetReducer(
    resultSet: ResultSetEntity,
    results: Result[],
  ): ResultSet {
    return new ResultSet(
      resultSet.roomId,
      resultSet.ymd,
      results,
    );
  }
  public resultRepository: IResultRepository;
  public resultSetRepository: IResultSetRepository;
  constructor(
    resultRepository: IResultRepository,
    resultSetRepository: IResultSetRepository,
  ) {
    this.resultRepository = resultRepository;
    this.resultSetRepository = resultSetRepository;
  }

  public async listByYmd(roomId: string, ymd: Date): Promise<ResultSet[]> {
    const resultSets = await this.resultSetRepository.listByRoomAndYmd(roomId, ymd);
    return Promise.all(
      resultSets.map(async (resultSet) => {
        const results = await this.resultRepository.listByResultSet(resultSet.roomId, resultSet.id);
        return ResultSetInteractor.resultSetReducer(
          resultSet,
          results.map(ResultSetInteractor.resultReducer),
        );
      }),
    );
  }

  public async add(resultSet: ResultSet): Promise<ResultSet> {
    const uid = firebase.auth().currentUser?.uid;
    if (!uid) {
      throw new Error('no logged in user');
    }
    const ret = await this.resultSetRepository.add({
      roomId: resultSet.roomId,
      ymd: resultSet.ymd,
      created_by: uid,
      updated_by: uid,
    });
    const results = await Promise.all(
      resultSet.resultRet.map(async (result) => {
        const added = await this.resultRepository.add({
          roomId: resultSet.roomId,
          resultSetId: ret.id,
          ymd: resultSet.ymd,
          uname: result.uname,
          order: result.order,
          point: result.point,
          created_by: uid,
          updated_by: uid,
        });
        return ResultSetInteractor.resultReducer(added);
      }),
    );
    return ResultSetInteractor.resultSetReducer(ret, results);
  }
}
