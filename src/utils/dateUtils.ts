import { format, startOfDay } from "date-fns";

export const formatDateForQuery = (date: Date) => {
  const startOfDayDate = startOfDay(date);
  return format(startOfDayDate, 'yyyy-MM-dd');
};