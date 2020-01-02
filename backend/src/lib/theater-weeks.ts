import { startOfWeek, endOfWeek, addWeeks } from 'date-fns'

export function getWeekFromDate(date: Date = new Date()): [Date, Date] {
  return [
    startOfWeek(date, { weekStartsOn: 3 }),
    endOfWeek(date, { weekStartsOn: 3 }),
  ]
}

export const getWeek = (week: number) =>
  getWeekFromDate(addWeeks(new Date(), week))
