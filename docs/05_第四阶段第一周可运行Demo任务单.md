# 第四阶段任务单：第一周可运行 Demo（P01–P08）

> 状态：已发布，开发者 A / B 可直接执行
> 产品依据：《园艺疗法小程序_PRD合订版_v1.2.md》
> 技术基线：第三阶段冻结版本，`main` 基线提交 `baf224c`
> 阶段目标：在无真实后端条件下，连续走通 P01 首页至 P08 五感花园

## 1. 阶段唯一目标

本阶段只完成以下第一周演示链：

```text
P01 首页
→ P02 Mock 开启体验
→ P03 自然档案
→ P04 评估介绍
→ P05 10 题状态探索
→ P06 状态报告
→ P07 探索主页
→ P08 五感花园
```

完成后，演示者必须能够从首页开始，不依赖云开发、后台或真实微信授权，一次连续操作到五感花园。

其他功能不得阻塞该流程。

## 2. 本阶段明确不做

- 不实现 P09 体验详情、P10 体验任务、P11 自然印记的正式业务。
- 不实现 P12 记录、P13 我的的正式业务；现有 Tab 骨架保持可进入即可。
- 不实现 P14 社区内容，只保留现有静态占位。
- 不接入微信真实登录、openid、云函数、云数据库或云存储。
- 不建设 Node.js、Express、MySQL、管理后台。
- 不升级 uni-app 编译器，不新增 UI 框架或状态管理方案。
- 不扩展 PRD v1.2 以外的功能、量表或统计图。

## 3. 开发前统一动作

两侧开始编码前均执行：

```bash
git fetch origin
git checkout <自己的分支>
git merge origin/main
pnpm install --offline
pnpm check:mock
pnpm build:mp-weixin
```

分支固定：

| 开发者 | 分支 | 页面所有权 |
|---|---|---|
| A | `feat/experience-ui` | P01、P02、P03、P07、P08 |
| B | `feat/assessment-data` | P04、P05、P06及评估 Store/Service |

基线检查未通过时先报告，不得通过升级依赖或重做工程规避问题。

## 4. 文件所有权与冲突边界

| 文件范围 | 负责人 | 规则 |
|---|---|---|
| `src/pages/home/**` | A | B 不直接修改 |
| `src/pages/auth/**` | A | Mock 身份必须调用现有 userStore/Adapter |
| `src/pages/profile/**` | A | 字段名不得自行新增或改名 |
| `src/pages/explore/**` | A | 从 Store 读取最近评估，不复制评估逻辑 |
| `src/pages/garden/**` | A | 从 experienceStore/Adapter 读取课程 |
| `src/components/**`、`src/styles/**` | A | 只做本阶段必要修正，组件 API 变化必须通知 B |
| `src/pages/assessment/**` | B | A 只做 Review，不直接改业务逻辑 |
| `src/services/assessment-service.js` | B | 评分逻辑唯一实现位置 |
| `src/stores/assessment.js` | B | 答案、进度、结果与提交状态唯一来源 |
| `src/mock/assessment-questions.js` | B | 保持 10 题与三维度契约 |
| `src/services/data-adapter.js` | B | 已冻结接口不改名；确需变更先报告 |
| `src/pages.json`、`src/config/routes.js` | 冻结 | 本阶段不增删路由、Tab 或参数 |
| `package.json`、锁文件 | 冻结 | 本阶段原则上不新增依赖 |

页面仍然禁止直接导入 `src/mock/**`，业务数据统一经 Store 和 Data Adapter 获取。

## 任务依赖关系

| 任务 | 依赖任务 | 依赖类型 | 依赖说明 |
|---|---|---|---|
| A010 P01 首页 | 第三阶段冻结 | FS | 复用已冻结 UI Token、按钮、卡片与路由 |
| A011 P02 Mock 开启体验 | A010 | FS | 首页主 CTA 必须能够进入 P02 |
| A012 P03 自然档案 | A011 | FS | Mock 会话建立后保存自然档案 |
| B020 P04 评估介绍 | A012 | SS | 可并行开发，联调时由 P03 保存成功进入 P04 |
| B021 P05 状态探索 | B020 | FS | 点击开始探索后进入 10 题流程 |
| B022 评估评分 Service | B021 | SS | 按冻结题目契约并行实现评分 |
| B023 P06 状态报告 | B022 | FS | 只展示评分 Service 的结果，不在页面重复计算 |
| A030 P07 探索主页 | B023 | SS | 可使用冻结结果 Mock 并行实现，联调时承接 P06 |
| A031 P08 五感花园 | A030 | FS | 探索主页 CTA 进入五感花园 |
| C003 P05→P06 联调 | B021、B022、B023 | FF | 答题、提交、评分、报告必须整体完成 |
| C006 全链走查 | A010–A031、B020–B023 | FS | 从首页连续走到五感花园 |
| C007 双侧验收 | C003、C006 | FS | 两侧交叉 Review 并通过统一构建门槛 |

## 任务定义

### A010 P01 首页

负责人：开发者 A
主文件：`src/pages/home/index.vue`

交付：

- 使用 PRD 与 UI 图集完成自然疗愈主题首屏。
- 首页主 CTA 文案清楚，点击进入 P02。
- 使用统一自然色板、卡片、按钮和插画语言。
- 去掉工程骨架状态文案，不展示内部开发信息。

验收：用户进入后 10 秒内能理解项目主题并找到“开始体验”。

### A011 P02 Mock 开启体验

负责人：开发者 A
主文件：`src/pages/auth/index.vue`

交付：

- 使用现有 `userStore.startMockSession()` 建立演示身份。
- 按钮具备 normal、loading、disabled 和错误反馈。
- 登录成功进入 P03；重复点击不得创建多份用户状态。
- 页面文案不得暗示已经完成真实微信授权。

验收：关闭真实后端后仍可稳定进入自然档案。

### A012 P03 自然档案

负责人：开发者 A
主文件：`src/pages/profile/setup.vue`

交付：

- 使用冻结字段：`nickname`、`ageRange`、`gardenExperience`、`goals`。
- 完成必填校验、多选目标、保存 loading 与错误提示。
- 通过 userStore/Adapter 保存；重新进入时能够恢复。
- 保存成功后进入 P04，不在页面直接写 Storage 或 Mock。

验收：档案保存后重进页面数据不丢失，核心流程不中断。

### A030 P07 探索主页

负责人：开发者 A
主文件：`src/pages/explore/index.vue`

交付：

- 展示欢迎信息、最近状态概览、推荐体验和五感花园入口。
- 有评估结果时推荐多肉种植；无结果时显示友好默认状态。
- 从 P06 使用 Tab 导航进入，页面不依赖 URL 参数。
- 主 CTA 进入 P08。

验收：报告页可稳定进入探索主页，且一眼可找到五感花园入口。

### A031 P08 五感花园

负责人：开发者 A
主文件：`src/pages/garden/index.vue`

交付：

- 展示视觉、触觉、嗅觉、味觉、听觉五类课程卡。
- 多肉种植作为默认推荐并有明确视觉层级。
- 课程来自 experienceStore/Adapter，处理 loading、empty、error、normal。
- 卡片可携带冻结参数 `id` 进入现有 P09 骨架；本阶段不实现 P09 业务。

验收：五类卡片齐全、风格统一、点击不崩溃。

### B020 P04 评估介绍

负责人：开发者 B
主文件：`src/pages/assessment/intro.vue`

交付：

- 明确本次状态探索共 10 题、预计 1–2 分钟。
- 明确“仅用于产品体验反馈，不属于医学诊断或正式量表”。
- 点击开始时初始化评估草稿并进入 P05。
- 不增加正式量表名称、医疗结论或额外问卷。

验收：用户知道评估性质、题量和下一步操作。

### B021 P05 状态探索

负责人：开发者 B
主文件：`src/pages/assessment/questions.vue`

交付：

- 通过 assessmentStore 加载恰好 10 题，每次展示 1 题。
- 显示当前题号和进度，支持上一题、下一题。
- 未选择答案时禁止进入下一题；返回后答案保留。
- 最后一题只触发一次提交，提交中禁用按钮并处理失败重试。
- 页面不写死题目、选项、维度或评分逻辑。

验收：10 题可连续完成，回退不丢答案，重复点击不产生两份结果。

### B022 评估评分 Service

负责人：开发者 B
主文件：`src/services/assessment-service.js`

交付：

- 输出且只输出 `emotion`、`stress`、`nature` 三个维度。
- 反向题按冻结题目 `reverse` 字段处理。
- 每维分按 `(均值 - 1) / 4 × 100` 归一化并取整。
- `experienceOverviewScore = 0.4 × emotion + 0.3 × (100 - stress) + 0.3 × nature`，最终取整。
- 输出推荐课程 ID，当前演示默认可落到 `course-succulent`。
- 代码、UI、注释和数据中不得出现 `balanceIndex`。
- 增加可重复执行的评分自检，固定答案输入应得到固定输出。

验收：同一组答案始终得到同一结果，缺题或非法答案返回可处理错误而不是错误报告。

### B023 P06 状态报告

负责人：开发者 B
主文件：`src/pages/assessment/result.vue`

交付：

- 展示「状态体验概览分」与 emotion、stress、nature 三维结果。
- 展示文字反馈和多肉种植推荐，不生成医学结论。
- 固定展示“仅用于产品体验反馈，不属于医学诊断，不等同正式量表”。
- 报告写入 assessmentStore/Adapter，重新进入时可读取最近评估。
- 主 CTA 使用 Tab 导航进入 P07。
- 页面评分只消费 B022 的结果，不重复实现公式。

验收：完成 10 题后稳定生成一份报告，刷新或返回后最近结果仍可读取。

### C003 P05→P06 联调

负责人：开发者 B 主联调，开发者 A 负责视觉 Review。

验收路径：P04 → P05 完成 10 题 → P06。检查进度、答案恢复、提交保护、三维结果、概览分、免责声明和推荐课程。

### C006 全链走查

负责人：开发者 A 主联调，开发者 B 配合数据问题。

验收路径：P01 → P02 → P03 → P04 → P05 → P06 → P07 → P08，连续走通至少两遍；第二遍同时检查档案与最近评估恢复。

### C007 双侧验收

两侧交叉 Review：A Review 评估页面视觉与交互一致性，B Review A 侧页面的数据调用、状态恢复和异常处理。Review 发现的问题回到原负责人分支修复。

## 7. 五日执行与合并顺序

| 日次 | 开发者 A | 开发者 B | 当日合并门 |
|---|---|---|---|
| Day 1 | A010 | B020、B022 起步 | 首页可进 P02；评估介绍可进 P05 |
| Day 2 | A011 | B021 前 5 题流程 | Mock 登录可用；答题状态可保留 |
| Day 3 | A012 | B021 完整 10 题、B022 | 首页至 P05 可连续走通 |
| Day 4 | A030、A031 | B023、C003 | 10 题提交后生成稳定报告 |
| Day 5 | C006、视觉修正 | 状态恢复、异常修正 | 两遍全链走查和 C007 交叉验收 |

每日只合入已达到对应完成定义的提交。建议先合 B 的评估数据与页面提交，再让 A 更新 `main` 完成探索页联调；任何时候 `main` 都必须可构建。

## 8. 提交与交接格式

建议按任务拆分提交：

```text
feat(home): complete A010 home experience
feat(profile): complete A012 nature profile
feat(assessment): complete B021 question flow
feat(assessment): add B022 scoring service
feat(report): complete B023 assessment report
feat(garden): complete A031 five-senses garden
```

每次交接必须给出：

```text
完成任务 ID：
提交哈希：
修改文件：
自测路径：
自测命令：
已知问题：
需要对方配合：
```

禁止只回复“已完成”而不提供提交、路径和自测结果。

## 9. 阶段验收门槛

- [ ] `pnpm install --offline` 成功。
- [ ] `pnpm peers check` 成功。
- [ ] `pnpm check:mock` 成功。
- [ ] 评分 Service 自检成功。
- [ ] `pnpm build:mp-weixin` 成功。
- [ ] P01 至 P08 连续走通至少两遍。
- [ ] 第二遍档案与最近评估能够恢复。
- [ ] 10 题题量、三维度和评分字段正确。
- [ ] 业务源码和运行数据中不存在 `balanceIndex`。
- [ ] 报告页有非医学诊断、非正式量表说明。
- [ ] 五类课程卡齐全，多肉为默认推荐。
- [ ] 页面不直接导入 Mock，不散落 Storage 调用。
- [ ] 未新增真实登录、云开发、后台、社区或 P09 以后业务。
- [ ] 两侧均提供完整交接信息，`main` 工作区干净可运行。

以上全部通过，才宣布第四阶段完成并进入 P09–P11 核心体验后半程。

## 10. 给两侧的统一裁决

本阶段优先级只有一个：保证 P01 至 P08 的答辩前半程可运行。视觉细节、异常状态和数据恢复要做到足够稳定，但不得以此为由增加新功能。

A 不接管评估业务，B 不重做 A 的页面风格；公共契约如需变更，先在交接中提出，由项目负责人统一裁决后再修改。
