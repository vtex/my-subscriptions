export function getFutureDate({
  date,
  days,
  months,
}: {
  days?: number
  months?: number
  date: Date
}) {
  const newDate = new Date(date)

  if (days) {
    newDate.setDate(newDate.getDate() + days)
  }

  if (months) {
    newDate.setMonth(newDate.getMonth() + months)
  }

  return newDate
}
