export const orders = [1, 2, 3, 4] as const;
export type Order = typeof orders[number];
