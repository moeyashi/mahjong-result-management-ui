import { Order } from './Order';

export interface IResult {
  uname: string;
  order: Order;
  point: number;
}

export class Result implements IResult {
  public uname: string;
  public order: Order;
  public point: number;
  constructor({
    uname,
    order,
    point,
  }) {
    this.uname = uname;
    this.order = order;
    this.point = point;
  }
}
