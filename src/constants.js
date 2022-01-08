export const prizes = [
  { id: 1, name: '一等奖', num: 2 },
  { id: 2, name: '二等奖', num: 4 },
  { id: 3, name: '三等奖', num: 6 },
  { id: 4, name: '安慰奖', num: 10 },
  { id: 5, name: '再来一次' },
  { id: 0, name: '新年快乐' },
]
const map = {}
prizes.forEach((prize) => {
  map[prize.id] = prize.name
})

export const prizeMap = map
