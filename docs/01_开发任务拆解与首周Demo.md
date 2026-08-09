# 园艺疗法小程序开发任务拆解与首周 Demo

> 版本：v1.0  
> 产品依据：《园艺疗法小程序_PRD合订版_v1.2.md》  
> 适用团队：两人开发  
> 当前定位：护理学院大创展示型微信小程序

## 1. 开发目标与边界

核心目标：

> 用一个完整、漂亮、可演示的小程序展示园艺疗法数字化体验流程。

本期不追求商业化运营、公开社区、高并发、复杂后台或科研级量表系统。

开发默认规则：

- Mock 数据优先。
- 页面和核心交互先完成。
- 微信云开发在页面闭环稳定后接入。
- 不建设 Express/MySQL 后端。
- 不开发真实社区功能。
- 不先做复杂微信登录；首批使用 Mock 身份。
- 专业园艺疗法内容由甲方提供，未到位时使用可替换 Mock。

## 2. MVP 页面优先级

| 顺序 | 页面 | 分级 | 本阶段目标 | 完成标准 |
|---:|---|---|---|---|
| 1 | P01 首页 | P0-A | 理解产品并开始体验 | CTA 可进入 P02 |
| 2 | P02 开启体验 | P0-A | 建立演示身份 | Mock 身份可稳定进入 P03 |
| 3 | P03 自然档案 | P0-A | 保存基础偏好 | 必填校验、本地保存、重新进入可恢复 |
| 4 | P04 评估介绍 | P0-A | 解释状态探索 | 明确 10 题、仅作体验反馈 |
| 5 | P05 状态探索 | P0-A | 完成 10 题 | 可前进、后退、保留答案、防重复提交 |
| 6 | P06 状态报告 | P0-A | 展示反馈和推荐 | 显示三维度、概览分和推荐课程 |
| 7 | P07 探索主页 | P0-A | 承接状态报告 | CTA 可进入五感花园 |
| 8 | P08 五感花园 | P0-A | 展示五类体验 | 五张课程卡可点击 |
| 9 | P09 体验详情 | P0-A | 展示多肉体验内容 | 材料、步骤、提示完整，CTA 可进入任务 |
| 10 | P10 体验任务 | P0-A | 完成步骤和反馈 | 步骤、心情、感受、完成操作可用 |
| 11 | P11 自然印记 | P0-A | 生成体验结果 | 使用刚生成的 Record，能进入 P12 |
| 12 | P12 记录 | P0-B | 承接历史体验 | 自然旅程、历史记录、印记详情可用 |
| 13 | P13 我的 | P0-B | 补全产品结构 | 六项基础内容齐全 |
| 14 | P14 社区占位 | P0-C | 保证 Tab 完整 | 仅展示未来开放文案，无社交按钮 |

### 视觉打磨顺序

1. S 级：首页、状态报告、五感花园、自然印记。
2. A 级：体验详情、记录、我的。
3. C 级：社区占位，只保证与全局视觉一致。

## 3. 两人任务拆分

### 3.1 开发者 A：入口、探索与视觉体验链

主要任务：

- A001：全局 UI Token、页面容器和安全区。
- A002：公共按钮、卡片、标题、空状态组件。
- A010：P01 首页。
- A011：P02 开启体验。
- A012：P03 自然档案。
- A030：P07 探索主页。
- A031：P08 五感花园。
- A032：P09 多肉体验详情。
- A042：P11 自然印记视觉实现。
- A044：P13 我的。
- A070：S/A 级页面视觉一致性检查。

主要组件所有权：

- `NatureCard`
- `SenseCard`
- `CourseCard`
- `GrowthCard`
- `ImprintCard`
- `PrimaryButton`
- `EmptyState`
- 页面背景、间距、卡片和插画规范

### 3.2 开发者 B：评估、任务与数据状态链

主要任务：

- B001：Mock 数据目录和统一 Data Adapter。
- B002：Pinia 用户、评估、体验状态。
- B020：P04 评估介绍。
- B021：P05 状态探索。
- B022：评估评分 Service。
- B023：P06 状态报告数据逻辑。
- B040：体验 Session 状态。
- B041：P10 体验任务。
- B042：Record 生成和重复提交保护。
- B043：P12 记录。
- B045：P14 社区占位。
- B050：页面稳定后的微信云开发接入。

主要数据所有权：

- 用户 Mock 与自然档案
- 评估题、答案和结果
- 课程 Mock
- 体验 Session
- Record 与自然印记数据
- Mock/Real Adapter

### 3.3 共同任务

- C001：冻结路由表、TabBar 和目录结构。
- C002：冻结 Mock 数据契约。
- C003：联调 P05 → P06。
- C004：联调 P09 → P10 → P11。
- C005：确认 P10、P11、P12 使用同一个 Record ID。
- C006：每天走查当前可运行主链。
- C007：双机真机验收。
- C008：答辩前连续完整演练至少 3 次。

## 4. 任务依赖与交接规则

| 上游任务 | 交付物 | 下游任务 | 交接条件 |
|---|---|---|---|
| A001/A002 | UI Token、公共组件 | 所有页面 | 示例页可运行，组件 API 已说明 |
| B001/B002 | Mock Adapter、Store | P02–P13 | 数据可读取、更新和重置 |
| A012 | 自然档案表单 | B002 | 字段名与用户 Mock 一致 |
| B021/B022 | 答案与评分结果 | A/B P06 | 输出契约固定，无旧评分字段 |
| A031 | 课程卡片和五感入口 | A032 | `courseId` 路由参数可用 |
| A032 | 多肉详情 | B041 | 课程步骤结构可直接读取 |
| B041/B042 | 体验完成记录 | A042/B043 | 返回唯一 `recordId`，重复点击不新增 |
| A042 | 自然印记页面 | B043 | 能按 `recordId` 展示并跳转记录 |
| B043 | 记录列表 | A044 | 我的记录入口可进入 P12 |

交接要求：

- 上游任务未达到交接条件，下游不得自行复制一套临时字段。
- 公共字段变更必须同时通知另一位开发者。
- 不允许页面直接导入 Mock 文件，统一通过 Data Adapter。
- 合并前必须提供：运行方式、完成项、自测路径和已知问题。

## 5. 第一周可运行 Demo

### 5.1 第一周范围

```text
首页
↓
Mock 开启体验
↓
自然档案
↓
评估介绍
↓
10 题状态探索
↓
状态报告
↓
探索主页
↓
五感花园
```

第一周结束时，该流程必须在微信开发者工具或真机连续运行，不依赖后端。

### 5.2 每日建议安排

| 日期 | 开发者 A | 开发者 B | 当日共同验收 |
|---|---|---|---|
| Day 1 | 项目骨架、TabBar、UI Token | Mock目录、Adapter、Store、数据契约 | 项目启动，五 Tab 可进入，Mock 可读取 |
| Day 2 | 公共组件、P01、P02 | P04、评估题 Mock、答题状态 | 首页可进入体验；评估页可加载题目 |
| Day 3 | P03 自然档案 | P05 答题、前后切题、答案保留 | 首页到答题页连续可走 |
| Day 4 | P07、P08 页面骨架 | 评分 Service、P06 报告逻辑 | 10 题提交后生成稳定报告 |
| Day 5 | P01/P06/P08 视觉联调和真机适配 | 状态恢复、异常提示、防重复提交 | 首页到五感花园完整走通两遍 |

### 5.3 第一周必须完成

- uni-app + Vue3 + Pinia 项目可运行。
- 五个 Tab 路由已注册且点击不崩溃。
- UI Token、按钮、卡片和页面容器可复用。
- Mock 用户可进入，不等待真实微信授权。
- 自然档案可保存并恢复。
- 10 道状态探索题完整可答。
- 正确输出 `emotion`、`stress`、`nature`。
- 正确输出 `experienceOverviewScore`。
- 状态报告包含非医学诊断说明。
- 状态报告可进入探索主页和五感花园。
- 五类课程卡片已存在，多肉为默认推荐。

### 5.4 第一周不做

- 真实微信授权登录。
- 云函数、云数据库和云存储联调。
- Node.js、Express、MySQL 或后台。
- 真实图片上传。
- 社区内容与社交功能。
- 复杂动画、分享卡片和正式量表。

## 6. Mock 数据结构

### 6.1 推荐目录

```text
src/
├─ mock/
│  ├─ user.js
│  ├─ assessment-questions.js
│  ├─ courses.js
│  ├─ records.js
│  └─ index.js
├─ services/
│  ├─ data-adapter.js
│  ├─ assessment-service.js
│  └─ experience-service.js
└─ stores/
   ├─ user.js
   ├─ assessment.js
   └─ experience.js
```

### 6.2 用户 Mock

```js
export const mockUser = {
  id: 'demo-user-001',
  openid: 'mock-openid-001',
  nickname: '自然体验者',
  avatarUrl: '/static/images/mock/avatar.png',
  profileCompleted: false,
  ageRange: '',
  gardenExperience: '',
  goals: [],
  growthIdentity: '等待启程'
}
```

### 6.3 评估题 Mock

```js
export const mockAssessmentQuestions = [
  {
    id: 'E1',
    dimension: 'emotion',
    title: '此刻，我感到心情平静',
    reverse: false,
    options: [
      { label: '完全不符合', value: 1 },
      { label: '比较不符合', value: 2 },
      { label: '一般', value: 3 },
      { label: '比较符合', value: 4 },
      { label: '非常符合', value: 5 }
    ]
  }
]
```

字段约束：

- `dimension` 只能是 `emotion`、`stress`、`nature`。
- 共 10 题。
- 反向题通过 `reverse: true` 标记。
- 页面不写死选项文案。

### 6.4 评估结果 Mock

```js
export const mockAssessmentResult = {
  submissionId: 'assessment-demo-001',
  experienceOverviewScore: 78,
  emotion: { score: 76, label: '良好' },
  stress: { score: 55, label: '中等' },
  nature: { score: 72, label: '较高' },
  recommendedCourseId: 'course-succulent',
  createdAt: '2026-08-09T09:00:00+08:00'
}
```

规则：

- UI 名称为「状态体验概览分」。
- 字段统一使用 `experienceOverviewScore`。
- 仅用于产品体验反馈。
- 不属于医学诊断，不等同于 PANAS、PSS-10、NR-6 等正式量表。

### 6.5 课程 Mock

```js
export const mockCourses = [
  {
    id: 'course-succulent',
    sense: 'touch',
    senseName: '触觉',
    title: '多肉种植体验',
    subtitle: '用双手感受土壤与植物',
    cover: '/static/images/mock/succulent-cover.png',
    duration: 20,
    description: '通过种植多肉，完成一次轻量自然体验。',
    materials: ['多肉植物', '花盆', '种植土', '小铲子'],
    safetyTips: ['操作后及时清洁双手'],
    mindfulnessPrompt: '感受土壤的触感，慢慢完成每一步。',
    steps: [
      {
        id: 'step-1',
        title: '准备花盆',
        description: '将花盆放置在平稳桌面。',
        image: '/static/images/mock/succulent-step-1.png'
      }
    ],
    status: 'available'
  }
]
```

固定五条课程：

| sense | 课程 |
|---|---|
| visual | 植物拓印 |
| touch | 多肉种植 |
| smell | 香草香囊 |
| taste | 花草茶制作 |
| hearing | 自然声音与正念 |

多肉种植提供完整步骤，其他四项首批至少支持进入详情。

### 6.6 体验记录 Mock

```js
export const mockRecords = [
  {
    id: 'record-demo-001',
    userId: 'demo-user-001',
    courseId: 'course-succulent',
    courseTitle: '多肉种植体验',
    sense: 'touch',
    mood: '平静',
    feeling: '触摸土壤让我慢慢安静下来。',
    imageUrl: '',
    completedAt: '2026-08-09T10:00:00+08:00',
    duration: 20,
    growthIdentity: '初识自然'
  }
]
```

记录约束：

- P10 完成后只生成一个 Record。
- P11、P12 根据同一个 `recordId` 读取数据。
- 历史记录按 `completedAt` 倒序。
- 图片为可选字段，上传失败不能丢失文字和心情。

## 7. 首批页面清单

### 第一批：第一周完成

1. P01 首页
2. P02 开启体验
3. P03 自然档案
4. P04 评估介绍
5. P05 状态探索
6. P06 状态报告
7. P07 探索主页
8. P08 五感花园基础页

同时只建立以下 Tab 路由壳：

- P12 记录
- P13 我的
- P14 社区占位

### 第二批：核心闭环补全

1. P09 多肉体验详情
2. P10 体验任务
3. P11 自然印记
4. P12 记录基础版
5. P13 我的基础版
6. P14 社区静态占位

## 8. 分支与提交约定

建议分支：

- `main`：始终保持可运行。
- `feat/experience-ui`：开发者 A。
- `feat/assessment-data`：开发者 B。
- 需要修改公共路由或数据契约时创建短分支，确认后尽快合并。

提交信息示例：

```text
feat(home): implement P01 hero and start CTA
feat(assessment): add ten-question mock flow
feat(records): connect imprint record to history list
fix(router): correct tab navigation after assessment
```

禁止：

- 在未沟通时修改公共字段名。
- 将多个未关联页面堆在一次提交中。
- 把密钥、appid secret 或真实用户数据提交到仓库。
- 合并后让 `main` 无法运行。

## 9. 每个任务的完成定义

任务满足以下条件才可交接：

- 页面或逻辑可以运行。
- 符合 PRD v1.2 产品边界。
- 使用统一 UI Token 和组件。
- loading、empty、error、normal 中与页面相关的状态已处理。
- 没有明显控制台错误。
- 提供自测入口和操作路径。
- 另一位开发者至少走查一次。
- 不阻塞当前答辩核心流程。

## 10. 第一周验收清单

- [ ] 项目可在微信开发者工具启动。
- [ ] 五个 Tab 点击不崩溃。
- [ ] 首页 10 秒内可理解产品主题。
- [ ] Mock 开启体验可用。
- [ ] 自然档案保存和恢复正常。
- [ ] 10 题状态探索可以完整完成。
- [ ] 回退后答案仍保留。
- [ ] 重复提交不会产生两份结果。
- [ ] 状态报告显示三个维度。
- [ ] 状态报告显示「状态体验概览分」。
- [ ] 报告页明确非医学诊断、非正式量表。
- [ ] 推荐课程为多肉种植。
- [ ] 状态报告可进入探索主页。
- [ ] 探索主页可进入五感花园。
- [ ] 五类体验卡片齐全。
- [ ] 无真实后端时核心路径仍可运行。
- [ ] 至少完成一次真机走查。

