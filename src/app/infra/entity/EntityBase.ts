export interface IEntityBase {
  id: string;
  created_by: string;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
}

export type AddEntity<T extends IEntityBase> = Omit<T,
  'id'
  | 'created_at'
  | 'updated_at'
>;
