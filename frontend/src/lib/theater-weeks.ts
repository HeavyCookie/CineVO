import { startOfWeek, endOfWeek, addWeeks } from 'date-fns'

export function getWeekFromDate(date: Date = new Date()): [Date, Date] {
  return [
    startOfWeek(date, { weekStartsOn: 4 }),
    endOfWeek(date, { weekStartsOn: 4 }),
  ]
}

export const getWeek = (week: number) =>
  getWeekFromDate(addWeeks(new Date(), week))
