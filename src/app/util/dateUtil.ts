export const parseLocaleISOString = (date: Date) => {
  return date.toISOString().substring(0, 10);
};
