import { useState } from 'react';
import { ResultRepositoryImpl, ResultSetRepositoryImpl } from '../di';
import { ResultSet } from '../domain/model';
import { ResultSetInteractor } from '../domain/usecase/ResultSetInteractor';

const resultSetInteractor = new ResultSetInteractor(
  ResultRepositoryImpl,
  ResultSetRepositoryImpl,
);

export const useResults = (roomId: string, ymd: Date) => {
  const [resultSets, setResultSets] = useState<ResultSet[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const fetchResultSets = async () => {
    setLoadingResults(true);
    setResultSets(await resultSetInteractor.listByYmd(roomId, ymd));
    setLoadingResults(false);
  };
  const addResultSet = async (resultSet: ResultSet) => {
    const added = await resultSetInteractor.add(resultSet);
    setResultSets([...resultSets, added]);
    await fetchResultSets();
  };
  return {
    resultSets,
    loadingResults,
    fetchResultSets,
    addResultSet,
  };
};
