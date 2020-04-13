import { orders } from './Order';
import { Result } from './Result';

export class ResultSet {
  public roomId: string;
  public ymd: Date;
  public resultRet: Result[];
  constructor(
    roomId: string,
    ymd: Date,
    resultSet: Result[],
  ) {
    if (resultSet.length !== orders.length) {
      throw new Error(`resultSet must be 4 Result. your length is ${resultSet.length}`);
    }
    const unameSet = resultSet
      .map((result) => result.uname)
      .filter((uname, i, self) => self.indexOf(uname) === i);
    if (unameSet.length !== orders.length) {
      throw new Error(`Each Result must have a different uname`);
    }
    this.roomId = roomId;
    this.ymd = ymd;
    this.resultRet = resultSet;
  }
}
