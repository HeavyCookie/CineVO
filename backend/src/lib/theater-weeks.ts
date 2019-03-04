import { startOfWeek, endOfWeek, addWeeks } from 'date-fns'

const options = { weekStartsOn: 4 }

export function getWeekFromDate(date: Date = new Date()): [Date, Date] {
  return [startOfWeek(date, options), endOfWeek(date, options)]
}

export const getWeek = (week: number) =>
  getWeekFromDate(addWeeks(new Date(), week))
