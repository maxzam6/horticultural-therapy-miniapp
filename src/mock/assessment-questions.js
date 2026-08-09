export const assessmentOptions = [
  { label: '完全不符合', value: 1 },
  { label: '比较不符合', value: 2 },
  { label: '一般', value: 3 },
  { label: '比较符合', value: 4 },
  { label: '非常符合', value: 5 },
]

export const mockAssessmentQuestions = [
  { code: 'E1', dimension: 'emotion', text: '最近一段时间，我能感受到一些轻松或愉快的时刻。', reverse: false },
  { code: 'E2', dimension: 'emotion', text: '最近一段时间，我愿意投入自己感兴趣的事情。', reverse: false },
  { code: 'E3', dimension: 'emotion', text: '最近一段时间，我能够找到让自己慢下来的时刻。', reverse: false },
  { code: 'E4', dimension: 'emotion', text: '最近一段时间，我常常觉得情绪被消耗。', reverse: true },
  { code: 'S1', dimension: 'stress', text: '最近一段时间，我觉得需要同时处理的事情很多。', reverse: false },
  { code: 'S2', dimension: 'stress', text: '最近一段时间，我很难让自己真正放松下来。', reverse: false },
  { code: 'S3', dimension: 'stress', text: '最近一段时间，我容易因为小事感到紧绷。', reverse: false },
  { code: 'N1', dimension: 'nature', text: '接触植物或自然环境时，我会注意到一些细微变化。', reverse: false },
  { code: 'N2', dimension: 'nature', text: '我愿意花一些时间观察植物、天空、风或其他自然事物。', reverse: false },
  { code: 'N3', dimension: 'nature', text: '待在自然环境中时，我通常更容易感到平静。', reverse: false },
].map((question) => ({ ...question, options: assessmentOptions }))
