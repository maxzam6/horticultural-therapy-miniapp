const placeholder = ({ id, sense, senseName, title, duration = 15 }) => ({
  id, sense, senseName, title,
  subtitle: '一段温和的自然体验正在准备中',
  cover: '/static/illustrations/sensory-garden.jpg',
  duration,
  description: '课程内容仍为可替换 Mock，当前可先了解体验方向。',
  materials: [],
  safetyTips: ['如感到不适，请随时停下并休息。'],
  mindfulnessPrompt: '放慢一点，留意此刻最清晰的一种感受。',
  steps: [],
  status: 'available',
})

export const mockCourses = [
  placeholder({ id: 'course-printing', sense: 'visual', senseName: '视觉', title: '植物拓印' }),
  {
    id: 'course-succulent', sense: 'touch', senseName: '触觉', title: '多肉种植体验',
    subtitle: '用双手安放一株小小的生命',
    cover: '/static/illustrations/sensory-garden.jpg',
    duration: 20,
    description: '通过铺土、安放多肉与整理表面，感受土壤、植物和呼吸带来的稳定节奏。本内容为体验 Mock，尚未经过园艺或护理专业审核。',
    materials: ['带排水孔的小花盆', '多肉植物一株', '多肉专用土', '铺面石', '小铲或勺子'],
    safetyTips: [
      '操作后及时洗手，避免揉眼或误食土壤、植物。',
      '使用工具时动作放缓；皮肤敏感时可佩戴手套。',
      '若植物有尖刺或操作中感到不适，请立即停止并寻求协助。',
    ],
    mindfulnessPrompt: '不必追求完美，留意指尖触碰土壤时的温度、颗粒和力度。',
    steps: [
      { id: 'succulent-step-1', title: '准备材料', description: '把花盆、多肉、土壤和小工具放在容易取用的位置，给自己留出舒适的操作空间。', image: '' },
      { id: 'succulent-step-2', title: '铺入底土', description: '缓慢加入土壤至花盆约三分之二处，感受土粒落下的声音和触感。', image: '' },
      { id: 'succulent-step-3', title: '安放多肉', description: '轻轻托住植株根部，将它放在花盆中央，再从四周补土固定。', image: '' },
      { id: 'succulent-step-4', title: '整理表面', description: '轻压表层土壤并铺上少量铺面石，让植株保持稳定。', image: '' },
      { id: 'succulent-step-5', title: '停留观察', description: '整理桌面，看看刚完成的作品，做三次自然呼吸，为这段体验收尾。', image: '' },
    ],
    status: 'available',
  },
  placeholder({ id: 'course-sachet', sense: 'smell', senseName: '嗅觉', title: '香草香囊' }),
  placeholder({ id: 'course-tea', sense: 'taste', senseName: '味觉', title: '花草茶制作', duration: 20 }),
  placeholder({ id: 'course-sound', sense: 'hearing', senseName: '听觉', title: '自然声音与正念' }),
]
