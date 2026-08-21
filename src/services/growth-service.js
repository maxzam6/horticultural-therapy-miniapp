export function getGrowthLevel(completedCount) {
  if (completedCount <= 0) return '等待启程'
  if (completedCount === 1) return '初识自然'
  if (completedCount <= 3) return '自然探索者'
  if (completedCount <= 5) return '五感漫游者'
  return '自然同行者'
}

export function summarizeGrowth(records = []) {
  const validRecords = Array.isArray(records) ? records : []
  const completedCount = validRecords.length
  const exploredSenseCount = new Set(
    validRecords.map((record) => record?.sense).filter(Boolean),
  ).size
  const totalMinutes = validRecords.reduce((total, record) => {
    const duration = Number(record?.duration)
    return total + (Number.isFinite(duration) && duration > 0 ? duration : 0)
  }, 0)

  return {
    completedCount,
    exploredSenseCount,
    totalMinutes,
    level: getGrowthLevel(completedCount),
  }
}
