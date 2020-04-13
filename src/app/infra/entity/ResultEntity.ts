import { Order } from '../../domain/model/Order';
import { IEntityBase } from './EntityBase';

export type ResultEntity = IEntityBase & {
  roomId: string
  ymd: Date
  resultSetId: string
  uname: string
  order: Order
  point: number,
};
