export const normalizeValue = (count: number | string) => +(+count / 1e18).toFixed(2)

export const calculatePercent = (count1: number, count2: number, side: string): number => {
  const a = normalizeValue(count1)
  const b = normalizeValue(count2)
  const sum = a + b
  let res = 0
  side === 'left' ? (res = (a / sum) * 100) : (res = (b / sum) * 100)
  return res
}