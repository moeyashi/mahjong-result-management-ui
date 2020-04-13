import { IEntityBase } from './EntityBase';

export type ResultSetEntity = IEntityBase & {
  roomId: string
  ymd: Date,
};
