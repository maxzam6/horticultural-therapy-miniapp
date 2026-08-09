# 园艺疗法微信小程序 PRD 整合包（合订版）v1.2

> 由 README + 00–09 共 11 个章节按阅读顺序合并生成，`references/UI页面映射表.md` 以附录收录，便于一次性阅读与提交。单文件版本见同目录各编号文档。

## v1.2 修改摘要

本版在不改变产品方向、不扩充商业化功能的前提下，完成以下执行性修订：

1. 将 MVP 明确拆分为 **P0-A 核心体验闭环、P0-B 产品完整性模块、P0-C 未来功能占位**；记录与我的均为必须完成，社区是唯一占位模块。
2. 将综合展示字段由 v1.1 的 `balanceIndex` 统一为 `experienceOverviewScore`，UI 统一显示「状态体验概览分」，消除医学指标联想。
3. 明确微信云开发是 MVP 默认技术方案；Node.js + Express + MySQL 仅为未来扩展方案，不是 MVP 依赖。
4. 新增唯一的答辩核心演示路径，并要求其他功能、网络与后端接入不得阻塞该路径。
5. 新增全局视觉一致性规则、文档优先级规则与 MVP 默认开发模式，降低 Codex 开发歧义。
6. 修正「我的可以后做或不做」「记录/我的与社区同级」等残留表述，并补齐页面、验收、排期和决策记录的对应约束。

## v1.2 关键决策变化

| 决策项 | v1.1 | v1.2 |
|---|---|---|
| P0-B | 记录、我的、社区的展示增强 | 记录、我的的产品完整性基础版，必须完成 |
| 社区 | 与记录、我的同属 P0-B | 单独归为 P0-C，只保留 Tab/入口和未来开放文案 |
| 我的 | 基础可用，但存在“最后 B 级/有时间则做”歧义 | 明确必须实现 6 项基础内容，不得删除或降级为可选 |
| 综合展示值 | UI 去医学化，内部仍有旧字段语义 | UI 为「状态体验概览分」，字段统一为 `experienceOverviewScore` |
| 技术方案 | 云开发优先，仍保留双路线并列感 | 云开发为 MVP 默认且足够；Node/Express/MySQL 仅为扩展方案 |
| 开发方式 | Mock 先行原则分散在多处 | 明确“Mock 数据优先、页面先完成、后端后接入”为默认模式 |
| 演示流程 | 多处有相近但不完全一致的路径 | 固定唯一答辩路径，记录和我的纳入结尾验收 |

## 目录

1. README_阅读指南.md
2. 00_项目总纲与定位.md
3. 01_产品需求规格说明书.md
4. 02_UI设计规范.md
5. 03_页面开发手册.md
6. 04_技术架构与数据设计.md
7. 05_Mock数据与业务规则.md
8. 06_开发计划与任务拆分.md
9. 07_验收测试与答辩演示.md
10. 08_甲方素材清单与内容替换表.md
11. 09_决策记录与开放问题.md

## 附录

A. references/UI页面映射表.md

<div style="page-break-before: always;"></div>

---

# 【README_阅读指南.md】

# 园艺疗法微信小程序 PRD 整合包 v1.2

> 本包是「园艺疗法微信小程序」的整合版需求与开发资料，由原 `Codex开发包_v3.0` 整理、去重、补全而来。原开发包保持存档，本项目后续开发以本整合包为准。
>
> 整理日期：2026-08-09（v1.2 修订版）

## 一、一句话定位

**一个面向护理学院大创项目展示的园艺疗法微信小程序，通过「了解 → 评估 → 五感体验 → 记录 → 成长」的流程，展示园艺疗法的数字化体验闭环。**

当前交付是**高完成度展示型 MVP**（现场扫码体验 + 答辩演示），不是完整科研平台。科研级功能（正式量表、五周干预、社区、教练、后台）保留为远期路线，见 `01_产品需求规格说明书.md` 第 12 节。

## 二、文档地图

| 编号 | 文档 | 读者 | 什么时候读 |
|---|---|---|---|
| README | 阅读指南（本文件） | 所有人 | 第一次接触项目 |
| 00 | 项目总纲与定位 | 产品/项目负责人 | 立项、范围裁决、每次改动前 |
| 01 | 产品需求规格说明书 | 所有人 | 需求仲裁、页面验收、答辩准备 |
| 02 | UI 设计规范 | 前端开发者 | 写任何页面之前 |
| 03 | 页面开发手册 | 开发者 | 开发具体页面时 |
| 04 | 技术架构与数据设计 | 全栈开发者 | 架构、接口、数据库设计 |
| 05 | Mock 数据与业务规则 | 全栈开发者 | 写评分/推荐/成长逻辑时 |
| 06 | 开发计划与任务拆分 | 项目负责人/两位开发者 | 排期、分工、每日执行 |
| 07 | 验收测试与答辩演示 | 全员 | 验收、答辩前演练 |
| 08 | 甲方素材清单与内容替换表 | 项目负责人/甲方对接人 | 催素材、内容替换 |
| 09 | 决策记录与开放问题 | 项目负责人 | 每次裁决后记录 |
| 附录 | references/UI页面映射表 | 前端开发者 | 开发每个页面时对照视觉参考 |

## 三、推荐阅读顺序

**答辩/评审视角：**

`00 → 01 → 02 → 07 → 08`

**合订版说明：** 合订版由 README + 00–09 共 11 个章节合并生成，`references/UI页面映射表.md` 以附录形式收录。

**开发视角：**

`00 → 02 → 03 → 04 → 05 → 06 → 07`

**只开发某一个页面：**

- `00_项目总纲与定位.md`
- `02_UI设计规范.md`
- `03_页面开发手册.md` 中当前页面章节
- `04_技术架构与数据设计.md` 中相关接口章节

## 四、与原 v3.0 开发包的对应关系

| 原开发包文件 | 整合包文件 | 变化 |
|---|---|---|
| 00_项目总纲.md | 00_项目总纲与定位.md | 内容保留，交叉引用更新 |
| 01_产品PRD.md | 01_产品需求规格说明书.md | 新增术语表、需求覆盖矩阵、版本规划，业务规则去重合并 |
| 02_UI设计规范.md | 02_UI设计规范.md | 无实质变化 |
| 03_页面开发手册.md | 03_页面开发手册.md | 无实质变化 |
| 04_技术架构_数据库_API.md | 04_技术架构与数据设计.md | 新增发布/体验版准备清单 |
| 06_Mock数据与业务规则.md | 05_Mock数据与业务规则.md | 标注业务规则以 01 为唯一事实来源 |
| 05_Codex任务清单.md | 06_开发计划与任务拆分.md | 新增里程碑与风险清单 |
| 07_验收测试与演示脚本.md | 07_验收测试与答辩演示.md | 无实质变化 |
| 无 | 08_甲方素材清单与内容替换表.md | 新增 |
| 无 | 09_决策记录与开放问题.md | 新增 |

## 五、本次整合修正的关键点

1. **业务规则去重**：评估、推荐、成长等级等规则不再在 01/05 两份文档各写一份。01 是产品侧的唯一事实来源，05 是实现侧的数据与代码参考，二者已互相引用对齐。
2. **页面优先级统一**：P12 记录、P13 我的属于 P0-B 产品完整性模块，必须完成基础版本；P14 社区是唯一 P0-C 占位模块。
3. **需求可追溯**：01 第 12 节新增甲方需求 → 本版处理的覆盖矩阵，答辩时可清楚说明「为什么没做社区/教练」。
4. **补全工程配套**：新增甲方素材清单（08）与决策记录（09），避免"待确认事项"散落在聊天记录里。

## 六、v1.1 修订记录（2026-08-09）

依据评审意见修订，逐条对应：

| 修订项 | 处理 |
|---|---|
| 1. README 章节数表述 | 改为「README + 00–09 共 11 个章节」 |
| 2. 技术方案改轻 | 默认微信云开发（云数据库/云函数/云存储），Node.js + Express + MySQL 降为备选方案，见 04 |
| 3. MVP 分层 | P0 拆为 P0-A 核心闭环（首页→评估→报告→五感→完整体验→印记）与 P0-B 展示增强（记录/我的/社区），见 00 与 01 |
| 4. 指数命名 | 「自然平衡指数」改为展示名「本次体验状态概览」，答辩口径同步写入 07 |
| 5. 社区文案 | 「功能正在建设中」改为「自然分享空间」，见 01/03/07 |
| 6. Codex 执行顺序 | 新增强制执行顺序 Step 0–6，见 06 |
| 7. 数据库降级 | SQL 表结构标注为「生产结构参考」，MVP 默认 JSON 配置 + 云数据库简化集合，见 04 |
| 8. 答辩视觉分级 | 新增 S/A/B 级重点页面，见 00 与 06 |
| 9. 文字修正 | 合订版文件名改为「PRD合订版」；新增用户侧/开发侧命名对照，见 01 第 1.5 节 |
| 10. UI 映射表 | 新增 `references/UI页面映射表.md`，我的/社区参考图标注待补充 |

## 七、开发总原则

**视觉完成度 > 核心流程完整度 > 功能数量 > 系统复杂度。**

能 Mock 先 Mock，能静态先静态，能复用就不复制，能规则就不做算法。

## 文档优先级规则

- 产品定义：`01_产品需求规格说明书.md`
- 页面实现：`03_页面开发手册.md`
- 开发顺序：`06_开发计划与任务拆分.md`

三者冲突时，严格按 **产品边界 > 页面定义 > 开发计划** 裁决。不得以排期靠后为由删除产品边界内的 P0-A 或 P0-B 内容；无法判断时记录冲突并交由项目负责人裁决。

## MVP 默认开发模式

- Mock 数据优先。
- 页面与核心交互先完成。
- 后端与云数据在页面闭环稳定后接入。
- 默认 Mock 范围包括：用户、评估题、课程、记录。
- Mock 与真实数据使用同一数据契约和适配层，切换数据源不得要求重写页面。
- 开发不得因 appid、云环境、甲方素材或后端尚未就绪而等待；答辩核心路径必须始终可在 Mock 模式运行。


---

# 【00_项目总纲与定位.md】

# 00 项目总纲

> 本文件为 PRD 整合包 v1.2 版本。完整需求覆盖矩阵见 `01_产品需求规格说明书.md` 第 12 节。

## 0.1 文档目的

本文档用于统一产品、设计和开发判断。任何 Codex 会话在修改架构、增加功能或重新设计页面前，都应先阅读本文档。

---

## 1. 项目背景

### 1.1 甲方原始需求背景

甲方原始材料将本项目定义为“基于移动健康程序的数字化园艺疗法干预工具框架”，适用对象包括青少年、存在压力或焦虑情绪的大学生以及研究受试者。

原始方案核心模式包括：

- 微信小程序线上引导
- 线下园艺材料包实操
- 教练一对一支持
- 智能客服即时响应

原始一级模块包括：

1. 正念 + 园艺
2. 云社区
3. 辅导反馈

原始材料提出的研究指标包括 NR-6、PANAS、PSS-10、uMARS，以及参与度、依从性等行为数据。

原始用户流程包括注册、知情同意、前测、基本信息、偏好、材料包、五周任务、自然印记、社区、反馈、客服/教练、后测等。

### 1.2 当前真实交付场景

经沟通确认，当前交付更接近：

- 护理学院大创项目的配套展示小程序
- 主要用于现场扫码体验、答辩演示、项目成果展示
- 预计体验人数不足 10 人
- 暂不要求公开运营
- 暂按微信体验版/真机演示作为交付目标
- 技术团队只负责技术搭建，不负责专业内容生产
- 前端视觉和体验是主要侧重点

所以当前版本不是完整科研平台，而是高完成度展示型 MVP。

---

## 2. 当前产品定位

**核心产品目标：用一个完整、漂亮、可演示的小程序展示园艺疗法数字化体验流程。**

本项目不是公开产品，也不以商业化运营、规模化获客或长期社区运营为目标。

### 2.1 一句话定位

> 一个连接自然体验、情绪探索和成长记录的园艺疗法数字化体验空间。

### 2.2 用户感知定位

用户不应感觉自己在：

- 使用医院系统
- 做枯燥量表
- 上网课
- 使用科研后台

用户应感觉自己在：

- 进入一个自然疗愈空间
- 了解此刻的状态
- 选择一种与植物连接的方式
- 完成一次有引导的园艺体验
- 留下一份自然成长记录

### 2.3 产品关键词

自然、疗愈、温暖、探索、五感、成长、记录、轻科研感。

---

## 3. 产品成功标准

### 3.1 答辩展示成功

老师或体验者扫码后，应在 10 秒内理解产品主题，在 3–5 分钟内能够完成一条核心 Demo 路径：

`扫码进入 → 首页 → 开始体验 → 自然档案 → 状态探索 → 状态报告 → 五感花园 → 多肉种植体验 → 体验任务 → 自然印记 → 记录 → 我的`

### 3.2 功能成功

**P0-A 核心闭环（必须）**：

- 用户身份可建立
- 基础资料可保存
- 评估可完成并生成结果
- 五感体验可浏览
- 至少一个体验可完整走通
- 体验反馈可保存
- 自然印记可生成

**P0-B 产品完整性模块（必须完成基础版本）**：

- 记录页可承接新生成的自然印记
- 我的自然旅程可查看
- 历史体验记录可查看
- 历史自然印记可查看
- 我的页包含用户信息、成长身份、最近评估、我的记录入口、关于园艺疗法、隐私说明

**P0-C 未来功能占位（仅社区）**：

- 社区 Tab 或入口存在且可访问
- 只展示「自然分享空间，未来开放」
- 不提供发帖、评论、点赞、私信、关注功能

### 3.3 视觉成功

- 所有核心页面视觉语言一致
- 无明显后台模板感
- 无明显多种 AI 风格拼接感
- 首页、状态报告、探索、五感花园、体验详情、自然印记是重点视觉页

**答辩视觉分级（开发优先级参考）：**

| 级别 | 页面 |
|---|---|
| S 级（答辩核心展示） | 首页、状态报告、五感花园、自然印记 |
| A 级（支撑完整度） | 体验详情、记录、我的 |
| C 级（占位一致性） | 社区占位 |

---

## 4. MVP 范围

### 4.1 P0-A 核心闭环（硬性完成）

1. 首页
2. 登录/身份建立
3. 自然档案
4. 评估介绍
5. 10 题展示版状态评估
6. 自然状态报告
7. 探索主页
8. 五感花园
9. 五个示例体验
10. 体验详情
11. 任务步骤
12. 正念提示
13. 体验反馈
14. 图片上传（可先 Mock）
15. 自然印记

### 4.2 P0-B 产品完整性模块（必须完成基础版本）

**记录：**

- 我的自然旅程
- 历史体验记录
- 自然印记查看

**我的：**

- 用户信息
- 成长身份
- 最近评估
- 我的记录入口
- 关于园艺疗法
- 隐私说明

> P0-B 是答辩流程的收尾与底部导航完整性要求，不是“有时间则做”。可在 P0-A 主链全通后实现，但必须在 MVP 验收前完成。

### 4.3 P0-C 未来功能占位（仅社区）

- 保留社区 Tab 或入口。
- 页面只呈现「自然分享空间，未来开放」及自然氛围视觉。
- 不实现发帖、评论、点赞、私信、关注，也不放置不可用的假按钮。

### 4.4 P1

- 植物生长轻动画
- 完整图片上传
- 正念 3 分钟倒计时
- 分享卡片
- 更丰富页面过渡
- 简单数据导出
- 真实微信 code 登录联调
- 知情同意说明页（建议，文案由甲方提供）
- 正念音频/倒计时入口（建议）

### 4.5 当前不做

- 社区发帖/评论/点赞/收藏/关注
- 教练一对一与实时聊天
- AI 客服
- 风险关键词自动识别
- 植物图片识别
- 个性化推荐模型
- 五周真实干预周期调度
- 受试者分组
- 材料包物流
- 完整科研看板
- 完整 PANAS / PSS-10 / NR-6 / uMARS 链路

---

## 5. 与甲方原始文档的关系

下表为一级对应关系，详细到每一项甲方需求的覆盖矩阵见 `01_产品需求规格说明书.md` 第 12 节。

|甲方原始方向|当前版本处理|
|---|---|
|正念 + 园艺|保留，是核心体验|
|五感课程库|保留，首版固定 5 个代表体验|
|图文/视频教学|保留页面和数据结构，素材由甲方提供|
|自然印记|保留并强化为展示亮点|
|云社区|只保留导航入口/未开放状态|
|辅导反馈|当前不做|
|智能客服|当前不做|
|教练私聊|当前不做|
|完整科研量表|Demo 使用自定义轻量状态评估，不冒充正式量表|
|五周干预周期|当前不做真实调度|
|后台研究数据|只保留必要数据模型和扩展空间|
|材料包管理|当前不做|

---

## 6. 技术团队责任边界

> 技术方案默认微信云开发（云数据库/云函数/云存储），Node.js + Express + MySQL 为备选，详见 `04_技术架构与数据设计.md`。

### 技术团队负责

- 小程序前端
- UI 落地
- 交互
- 登录
- API
- 数据库
- 数据保存
- 基础媒体上传
- 演示环境
- Demo 稳定性

### 甲方负责

- 园艺疗法专业内容
- 最终课程文案
- 图片、视频、音频
- 正念音频
- 正式量表内容及规范
- 专业安全提示
- 研究设计与相关合规

### Mock 原则

甲方素材未提供时不等待，统一使用 Mock：

- 5 个课程
- 10 道展示型状态问题
- 示例自然印记
- 示例图片占位

---

## 7. 核心产品流程

首次用户：

`首页 → 开始体验 → 微信身份建立 → 自然档案 → 评估介绍 → 评估答题 → 状态报告 → 探索`

园艺体验：

`探索 → 五感花园 → 选择体验 → 体验详情 → 开始体验 → 步骤引导 → 填写感受 → 完成 → 自然印记`

回访：

`记录 → 历史印记` 或 `探索 → 继续体验`

社区：

显示「自然分享空间，未来开放」，不提供社交交互。

## 答辩核心演示路径

以下为 MVP 唯一演示流程：

```text
扫码进入
↓
首页
↓
开始体验
↓
自然档案
↓
状态探索
↓
状态报告
↓
五感花园
↓
多肉种植体验
↓
体验任务
↓
自然印记
↓
记录
↓
我的
```

约束：

- 其他功能、素材缺失、云开发配置和真实后端接入均不得阻塞该流程。
- 答辩前至少在真机 Mock 模式完整走通 3 次。
- 社区仅用于证明 Tab 结构完整，不插入上述核心演示路径。
- 任一非核心页面发生异常时，仍应能回到首页或探索继续上述流程。

---

## 8. 底部导航

1. 首页 Home
2. 探索 Explore
3. 记录 Growth
4. 社区 Community
5. 我的 Profile

---

## 9. 非目标

Codex 不得主动把项目升级为：

- 商业心理健康平台
- 在线医疗产品
- 社交社区
- LMS 课程平台
- 游戏
- AI 陪伴产品

---

## 10. Codex 决策规则

遇到不明确需求时，依次判断：

1. 是否影响 3–5 分钟核心演示？
2. 是否明显提升视觉和理解效率？
3. 是否破坏现有信息架构？
4. 是否引入额外后端/合规/实时系统？
5. 是否可以 Mock 或静态实现？

默认：能 Mock 先 Mock，能静态先静态，能复用就不复制，能规则就不做算法。

如果要修改数据库主结构、技术栈、导航或 MVP 边界，应先暂停，由项目负责人确认。

### 10.1 文档优先级

- 产品定义看 `01_产品需求规格说明书.md`。
- 页面实现看 `03_页面开发手册.md`。
- 开发顺序看 `06_开发计划与任务拆分.md`。
- 出现冲突时以 **产品边界 > 页面定义 > 开发计划** 为准。


---

# 【01_产品需求规格说明书.md】

# 01 产品需求规格说明书

> 本文件为整合包 v1.2 主文档，是产品需求的唯一事实来源。业务规则（评分/推荐/成长）在此定稿，`05_Mock数据与业务规则.md` 提供实现用数据与代码参考。

## 1. 产品概述

### 1.1 产品名称

**园艺疗法小程序**

### 1.2 产品形态

微信小程序，展示型 MVP。

### 1.3 产品愿景

通过轻量、温暖、清晰的数字化体验，让第一次接触园艺疗法的人快速理解：

- 园艺疗法是什么
- 自己当前可以从什么方向开始
- 一次园艺体验如何进行
- 体验完成后如何形成个人记录

### 1.4 术语表

| 术语 | 含义 |
|---|---|
| 园艺疗法 | 利用园艺活动促进身心放松与自我觉察的辅助性体验（本项目为展示用语，不作医学断言） |
| 五感花园 | 按视觉/触觉/嗅觉/味觉/听觉组织的体验入口，对应甲方「五感课程库」 |
| 自然档案 | 首次进入时建立的基础资料与偏好：昵称、年龄段、园艺经验、体验目标 |
| 状态探索 | 10 题轻量展示型评估的交互命名，用于了解"此刻的自己" |
| 自然状态报告 | 评估后的反馈页，呈现情绪、压力、自然连接三个维度与推荐体验 |
| 体验（课程） | 一次五感园艺活动，如多肉种植、植物拓印 |
| 自然印记 | 完成一次体验后生成的总结页与记录，含心情、感受、成长数据 |
| 成长记录 | 记录 Tab 中按时间轴组织的历史自然印记 |
| 正念练习 | 嵌入体验前后的轻量呼吸/注意力引导（P0 为文案提示，P1 为音频/倒计时） |
| 成长身份 | 按完成次数计算的等级，如初识自然、自然探索者 |
| Mock | 甲方素材未到位时使用的演示占位数据，与真实数据可切换 |

### 1.5 用户侧命名与开发侧命名对照

为避免文档混用，统一以下对照（用户看到的文案 ≠ 开发内部命名）：

| 用户侧（UI 文案） | 开发侧（路由/代码/字段） | 说明 |
|---|---|---|
| 状态探索 | assessment | 评估模块的用户侧名称；P04/P05 统一叫"状态探索"，不叫"考试/问卷" |
| 状态报告 | assessment/result | 报告页 |
| 体验 / 课程 | course | 一次五感园艺活动 |
| 自然印记 | imprint / experience-record | 完成体验后的总结记录 |
| 成长记录 | records | 记录 Tab |
| 状态体验概览分 | experienceOverviewScore | 轻量自定义体验反馈值，见第 7 节；不得简称为医学“指数” |
| 正念练习 | mindfulness | 轻量呼吸/注意力引导 |

---

## 2. 用户角色

### 2.1 主要体验者

包括：

- 大创评审老师
- 学院老师
- 项目成员
- 少量测试/体验人员

特点：

- 不一定了解园艺疗法
- 使用时间短
- 很可能只体验一次
- 对页面第一印象敏感
- 不愿意做长问卷
- 更关心流程是否完整、项目是否“做出来了”

### 2.2 项目展示者

项目团队成员在答辩时需要：

- 引导老师扫码
- 指定演示路径
- 快速展示评估结果
- 展示五感课程
- 展示自然印记成果

因此页面必须支持“可控 Demo”，不能依赖长时间等待或复杂条件。

---

## 3. 用户旅程

### 初识

用户问题：这是什么？

产品回答：

- 园艺疗法
- 连接自然、关注当下
- 可以开始体验

成功标准：10 秒内理解。

### 建立身份

用户问题：为什么要登录？

产品回答：

- 用于保存这次体验和自然印记
- 不使用传统账号密码

### 了解自己

用户问题：我现在是什么状态？

产品回答：

- 轻量评估呈现情绪、压力、自然连接三个维度
- 给出非医疗化体验建议

### 开始探索

用户问题：接下来做什么？

产品回答：

- 五感花园
- 推荐一个体验
- 其他体验可自由查看

### 完成体验

用户问题：怎么做？

产品回答：

- 材料
- 步骤
- 正念提示
- 进度

### 留下记录

用户问题：完成之后得到什么？

产品回答：

- 自然印记
- 感受记录
- 成长轨迹

---

## 4. 信息架构

```text
园艺疗法小程序
├─ 首页
│  ├─ Hero / 产品定位
│  ├─ 什么是园艺疗法
│  ├─ 三个价值点
│  └─ 开始体验
├─ 探索
│  ├─ 当前推荐
│  ├─ 五感花园
│  ├─ 正念练习入口
│  └─ 体验进度
├─ 记录
│  ├─ 成长概览
│  ├─ 时间轴
│  └─ 历史自然印记
├─ 社区
│  └─ 未开放提示
└─ 我的
   ├─ 用户资料
   ├─ 成长身份
   ├─ 最近评估
   ├─ 我的记录
   ├─ 关于园艺疗法
   └─ 隐私说明
```

---

## 5. 页面清单

| ID | 页面 | 优先级 | MVP 分级 | Tab | 主要目的 |
|---|---|---:|---:|---:|---|
|P01|首页|P0|P0-A|是|介绍项目、开始体验|
|P02|开启体验/登录授权|P0|P0-A|否|建立身份|
|P03|自然档案|P0|P0-A|否|采集基础偏好|
|P04|评估介绍|P0|P0-A|否|解释评估|
|P05|状态探索/答题|P0|P0-A|否|完成 10 题|
|P06|自然状态报告|P0|P0-A|否|提供反馈|
|P07|探索主页|P0|P0-A|是|核心体验入口|
|P08|五感花园|P0|P0-A|否|浏览五种活动|
|P09|自然体验详情|P0|P0-A|否|了解材料、步骤|
|P10|体验任务|P0|P0-A|否|执行步骤、反馈|
|P11|自然印记|P0|P0-A|否|完成仪式和总结|
|P12|记录|P0|P0-B|是|查看成长历史|
|P13|我的|P0|P0-B|是|个人资料与辅助入口|
|P14|社区占位|P0|P0-C|是|自然分享空间（未来功能预告）|

> 分层说明：P0-A 是答辩主路径从首页到自然印记的硬性闭环；P0-B 是记录与我的基础版，负责承接印记并补全产品结构，同样必须完成；P0-C 只有社区占位。五个 Tab 在骨架阶段（T001）全部建立。该裁决记录于 `09_决策记录与开放问题.md` D20。

---

## 6. 页面功能摘要

### P01 首页

必须：

- 首屏品牌文案
- 自然主视觉
- 开始体验
- 园艺疗法简短介绍
- 3 个价值卡片
- 快捷入口
- 底部 Tab

建议主标题：园艺疗法  
建议副标题：连接自然，疗愈身心

### P02 开启体验

必须：

- “开启你的园艺疗法旅程”
- 登录/授权按钮
- 体验档案用途说明
- 登录失败反馈
- dev Mock 登录

不要求手机号验证码。

### P03 自然档案

字段：

- 昵称
- 年龄段
- 园艺经验
- 体验目标

园艺经验：

- 初次接触
- 偶尔尝试
- 经常参与

体验目标：

- 放松心情
- 亲近自然
- 学习植物
- 培养兴趣

### P04 评估介绍

包含：

- 了解此刻的自己
- 约 1–2 分钟
- 共 10 题
- 结果仅用于体验反馈
- 开始评估
- 稍后再说

### P05 状态探索

必须：

- 当前进度
- 当前题号
- 单选题
- 上一题/下一题
- 最后一题提交
- 防重复提交

视觉不做考试风。

### P06 自然状态报告

包含：

- 状态体验概览分（展示用体验反馈）
- 情绪状态
- 压力感受
- 自然连接
- 解释
- 推荐体验
- 开始自然体验

禁止使用诊断、心理疾病、临床风险等词。

命名约束：本页核心值在 UI 上统一显示为「状态体验概览分」，开发字段统一为 `experienceOverviewScore`，不出现"自然平衡指数/心理健康评分/临床评分/风险分"等表述。

### P07 探索主页

包含：

- 推荐体验
- 五感入口
- 正念练习入口
- 已完成进度

推荐只用规则，不用机器学习。

### P08 五感花园

固定：

- 视觉：植物拓印
- 触觉：多肉种植
- 嗅觉：香草香囊
- 味觉：花草茶制作
- 听觉：自然声音 + 正念

布局：卡片结构 + 花园氛围。

### P09 自然体验详情

必须：

- Hero
- 感官类型
- 预计时间
- 体验介绍
- 材料准备
- 分步骤预览
- 安全/注意事项
- 正念提示
- 开始体验

内容由甲方替换，结构不可只支持多肉。

### P10 体验任务

必须：

- 当前步骤
- 总进度
- 图/视频占位
- 当前说明
- 上一步/下一步
- 正念提示
- 最终反馈
- 心情选择
- 感受输入
- 图片上传可选
- 完成体验

采用轻体验 + 少量动效，不做互动小游戏。

### P11 自然印记

上半部分成长日记，下半部分轻数据摘要。

包含：

- 完成祝贺
- 体验名称
- 感官
- 完成日期
- 心情关键词
- 用户感受
- 累计体验次数
- 已探索感官数
- 成长阶段
- 查看记录
- 继续探索

### P12 记录

P0-B 基础版必须包含：

- 我的自然旅程
- 累计体验数
- 已探索感官
- 累计时间
- 历史体验记录（时间轴或列表）
- 自然印记查看
- 空状态

### P13 我的

P0-B 基础版必须包含：

- 用户信息（头像/昵称）
- 成长身份
- 最近评估
- 我的记录入口
- 关于园艺疗法
- 隐私说明

以上 6 项均为 MVP 必做，不得因缺少专属 UI 参考图或开发时间紧张而删除整个页面。

### P14 社区

当前只做 P0-C「自然分享空间」占位页，展示未来方向，不提供任何社交功能按钮。

页面文案建议：

- 标题：自然分享空间
- 正文：自然分享空间，未来开放。

明确不实现：发帖、评论、点赞、私信、关注。

---

## 7. 评估产品规则

当前 10 题是展示型状态探索，不能在 UI、代码、注释或答辩话术中等同于 PANAS、PSS-10、NR-6 等正式量表。

三个维度：

- emotion：情绪感受
- stress：压力感受
- nature：自然连接

输出：

- 情绪：良好 / 一般 / 需要休息
- 压力：较低 / 中等 / 较高
- 自然连接：正在建立 / 中等 / 较高

这些是体验反馈，不是医学结论。

**评分规则（展示用，实现以 `05_Mock数据与业务规则.md` 为准）：**

- 每题 1–5 分，E4 为反向题：`adjusted = 6 - value`
- 维度分归一化：`normalized = (mean - 1) / 4 * 100`，范围 0–100
- 综合展示值（内部字段 `experienceOverviewScore`，UI 展示名「状态体验概览分」）：`0.40 × emotion + 0.30 × (100 - stress) + 0.30 × nature`，四舍五入取整
- 该值仅用于产品体验反馈，不属于医学诊断，不等同于 PANAS、PSS-10、NR-6 等正式量表
- UI、代码、接口与注释中不得命名为"自然平衡指数/心理健康评分/临床评分/风险分"

答辩口径：若被问及评分依据，回答「当前版本用于展示数字化反馈流程，该分值是轻量自定义的体验反馈，不属于医学诊断，也不等同于 PANAS、PSS-10、NR-6 等正式量表；正式研究阶段才会按研究方案接入规范量表」。该话术已同步至 `07_验收测试与答辩演示.md`。

**推荐规则（不做算法）：**

1. stress ≥ 70 → 触觉 / 多肉种植
2. emotion < 40 → 嗅觉 / 香草香囊
3. nature < 40 → 视觉 / 植物拓印
4. 其他 → 触觉 / 多肉种植（多肉为默认推荐，因当前视觉与流程最完整）

---

## 8. 五感课程规则

|sense|显示名称|代表体验|
|---|---|---|
|visual|视觉|植物拓印|
|touch|触觉|多肉种植|
|smell|嗅觉|香草香囊|
|taste|味觉|花草茶制作|
|hearing|听觉|自然声音 + 正念|

课程字段支持：

- title
- subtitle
- sense
- cover
- duration
- description
- materials[]
- safetyTips[]
- mindfulnessPrompt
- steps[]
- media
- benefits[]
- status

---

## 9. 成长规则

只做轻反馈，不做复杂积分。

建议：

- 0 次：等待启程
- 1 次：初识自然
- 2–3 次：自然探索者
- 4–5 次：五感漫游者
- 6 次以上：自然同行者

成长数据由完成次数实时聚合（见 `04_技术架构与数据设计.md` 6.12 与 `05_Mock数据与业务规则.md` 第 7 节）。

---

## 10. 内容边界

专业内容由甲方提供。

开发期可使用示例内容，但必须容易替换。

尤其以下不由开发人员自行下专业结论：

- 评估解释
- 正念引导
- 安全提示
- 植物材料禁忌
- 花草茶可食用信息

---

## 11. 产品验收

MVP 完成定义：

**P0-A 硬性完成：**

1. 首页到自然印记全流程无阻塞
2. 五感花园展示 5 个项目
3. 至少多肉种植全流程真实可点击
4. 其他 4 个项目至少可进入详情
5. 评估能产生稳定结果
6. 体验反馈可保存、自然印记可生成
7. 页面统一自然疗愈风
8. 真机演示不依赖手工改数据
9. Mock/真实数据切换位置明确

**P0-B 产品完整性模块（必须完成基础版）：**

- 记录页显示我的自然旅程、历史体验记录并可查看自然印记
- 我的页显示用户信息、成长身份、最近评估、我的记录入口、关于园艺疗法、隐私说明
- 自然印记可直接进入记录，记录可进入对应印记详情

**P0-C 未来功能占位：**

- 社区页为「自然分享空间，未来开放」占位，点击不报错
- 不出现发帖、评论、点赞、私信、关注入口或假按钮

---

## 12. 甲方需求覆盖矩阵

> 甲方原始文档定义了完整科研框架（三模块 + 量表 + 后台）。本矩阵说明每一项在"当前展示版"的处理方式，答辩时可直接引用。处理状态：`实现` / `简化` / `替换` / `占位` / `远期`。

| 甲方原始需求 | 本版处理 | 落地位置 | 状态 |
|---|---|---|---|
| 模块一 正念+园艺（核心干预链） | 保留为产品主线：了解 → 评估 → 五感体验 → 印记 → 成长 | 全流程 | 实现 |
| 五感课程库 | 固定 5 个示例体验（视觉/触觉/嗅觉/味觉/听觉），数据结构支持扩充 | P07/P08/P09、courses 表 | 实现（内容待甲方替换） |
| 图文与视频教学 | 图文步骤完整；视频字段预留，有素材才显示播放器 | P09/P10、course_steps | 实现（视频素材待提供） |
| 正念练习（前/中/后） | 体验中正念提示文案；P1 增加 3 分钟正念倒计时/音频 | P10、mindfulnessPrompt | 简化 |
| 入组评估（PANAS/PSS-10/NR-6） | 展示版用 10 题轻量状态评估，明确不等于正式量表 | P04/P05/P06 | 替换（远期接正式量表） |
| 基本信息与园艺偏好 | 自然档案：昵称、年龄段、园艺经验、体验目标 | P03 | 实现（字段简化） |
| 知情同意/监护说明 | 未做；P1 建议增加轻量说明页 | — | 远期 |
| 材料包 | 不做物流与申领；体验详情展示材料清单 | P09、course_materials | 简化 |
| 五周干预周期与任务打卡 | 不做真实周期调度；完成一次体验即生成记录 | — | 远期 |
| 自然印记/成长记录 | 保留并强化为展示亮点 | P11/P12 | 实现 |
| 同步社区选项 | 未做（社区未开放） | — | 远期 |
| 模块二 云社区 | 仅保留 Tab 占位页「自然分享空间」，展示未来方向，不做社交功能 | P14 | 占位 |
| 情绪/操作反馈 | 体验完成后的心情选择 + 感受输入 + 可选图片 | P10 | 实现（简化） |
| 智能客服关键词自动回复 | 不做 | — | 远期 |
| 教练一对一/辅导预约 | 不做 | — | 远期 |
| 风险识别与转介 | 不做；产品不使用诊断措辞，内容边界见第 10 节 | — | 远期（安全边界已记录） |
| 后台管理与数据看板 | 不做后台 UI；数据模型预留扩展空间 | 04 | 远期 |
| 量表管理与研究数据导出 | 不做；隐私优先，不采集研究级数据 | — | 远期 |

## 13. 非功能性需求

### 13.1 性能与稳定性

- 首页可在无后端/无网络下正常运行（Mock 兜底）
- 页面加载无明显闪烁；核心路径 3–5 分钟内可走通
- 所有异步页面具备 loading / empty / error 三态

### 13.2 适配与兼容

- 适配 320px/375px 常见宽度与 iPhone 底部安全区
- 真机验证至少一台小屏 + 一台普通屏

### 13.3 隐私与安全

- 不收集精确位置、手机号、疾病诊断等敏感信息
- 不展示/存储任何密钥（appSecret、JWT secret、数据库密码）
- 上传仅 0–1 张图片，限制类型与大小

### 13.4 内容可替换性

- 课程、评估题、报告文案、正念/安全提示均通过数据配置承载，不在页面模板写死
- 替换路径：课程 → mock/DB seed；评估题 → assessment seed；图片 → 静态资源映射；文案 → 内容配置

## 14. 版本规划

| 版本 | 定位 | 内容 |
|---|---|---|
| v1.2 展示版（本期） | 大创答辩 + 现场扫码体验，预计体验人数 < 10 | 本 PRD 全部 P0-A、P0-B、P0-C；P1 仅在不影响核心流程时实现 |
| v2.0 科研增强版（远期） | 对接甲方完整研究流程 | 正式量表（PANAS/PSS-10/NR-6/uMARS）、知情同意、五周干预调度、云社区、教练/客服、后台看板与数据导出 |

当前数据模型与内容结构已为 v2.0 预留扩展（assessment_type、session 状态机、课程多表结构等），v1.2 不提前实现远期功能。


---

# 【02_UI设计规范.md】

# 02 UI 设计规范

## 1. 设计目标

整个小程序必须像同一个产品。

核心视觉目标：

> 自然、温暖、克制、安静、有植物手账感，同时保留现代移动端产品感。

不要做成：

- 医疗蓝白
- 科技大屏
- 后台管理
- 教育课程平台
- 儿童卡通
- 过度拟物游戏

---

## 2. 视觉关键词

英文：Botanical / Natural wellness / Soft green / Warm cream / Botanical journal / Sunlight / Handmade / Calm

中文：自然疗愈、阳光、植物、手账、柔和、留白、温暖、轻盈。

---

## 3. 色彩系统

开发 Token 起点：

```css
--color-primary: #6F8F5F;
--color-primary-deep: #506A45;
--color-primary-light: #A9BE9D;

--color-bg: #F7F4EA;
--color-bg-soft: #EEF3E7;
--color-surface: #FFFDF8;

--color-accent-warm: #D5A75D;
--color-accent-soft: #E8D9B9;

--color-text: #2F3B2E;
--color-text-secondary: #657064;
--color-text-muted: #8A9387;

--color-border: #E2E6DA;
--color-success: #6F9A68;
--color-warning: #C99B52;
--color-danger: #B66B63;
```

规则：

- 80% 页面区域用米白、浅绿、白色
- 深绿用于标题、主按钮、选中态
- 暖黄色只做点缀
- 不用荧光绿
- 红色只用于真实错误/危险

---

## 4. 字体层级

|用途|字号|字重|
|---|---:|---|
|Hero 标题|48–56rpx|600|
|页面标题|40–44rpx|600|
|Section 标题|32–36rpx|600|
|卡片标题|30–32rpx|500/600|
|正文|28rpx|400|
|辅助文字|24–26rpx|400|
|标签|22–24rpx|500|

规则：

- 一屏最多一个最大标题
- 正文不要小于 26rpx
- 长段介绍要有舒适行距
- 不用满屏粗体

---

## 5. 间距系统

使用统一节奏：

- 8rpx：极小
- 16rpx：图标与文字
- 24rpx：控件内部
- 32rpx：卡片间
- 40–48rpx：Section
- 64rpx：大区块

页面左右边距：`32rpx`

---

## 6. 圆角与阴影

圆角：

- Tag：16rpx
- 普通按钮：24–28rpx
- 卡片：28–32rpx
- Hero/大卡：32–40rpx

阴影示例：

```css
box-shadow: 0 8rpx 24rpx rgba(74, 92, 68, 0.08);
```

禁止：

- 黑色重阴影
- 发光
- 大量玻璃拟态
- 每个元素都有阴影

---

## 7. 按钮规范

### Primary Button

- 高度约 88rpx
- 大圆角
- 主绿色
- 白字
- 点击态 scale 0.98 或轻微透明

文案优先：

- 开始体验
- 开始评估
- 下一题
- 完成体验
- 查看我的记录

避免模糊文案：

- 确定
- OK
- 提交

### Secondary Button

- 浅绿底
- 深绿字
- 不抢主按钮视觉

---

## 8. 卡片规范

卡片尽量包含：

- 标签
- 标题
- 一句话描述
- 图片/插画
- 一个明确操作

核心组件：

1. `NatureCard`
2. `SenseCard`
3. `CourseCard`
4. `AssessmentDimensionCard`
5. `GrowthCard`
6. `ImprintCard`

---

## 9. 图片与插画

适合：

- 多肉植物
- 叶片
- 土壤
- 花草
- 手作过程
- 日光植物角
- 自然材料

避免：

- 医院
- 白大褂
- 大脑神经图
- 心电图
- 赛博科技
- 过度悲伤人物

开发占位统一放：

`static/images/mock/`

不要把网络图片 URL 分散写在页面模板里。

---

## 10. 图标规范

建议统一线性 SVG 或同一 Icon 库。

语义建议：

- 首页：home/leaf-home
- 探索：leaf/compass
- 记录：journal/sprout
- 社区：users
- 我的：user
- 视觉：eye
- 触觉：hand
- 嗅觉：flower/herb
- 味觉：tea
- 听觉：headphones

不要混用 emoji、3D 图标、实心 iconfont、线性 SVG。

---

## 11. 页面背景

默认背景：

`#F7F4EA`

顶部 Hero 可用：

- 浅绿色渐变
- 植物图片 + 白色遮罩
- 植物插画

不要每个页面换一套背景风格。

---

## 12. 动效

P1 轻动效：

### 页面进入

opacity + translateY，200–300ms。

### 卡片点击

scale 0.98，100–150ms。

### 进度

300ms 平滑变化。

### 完成体验

小芽/叶片生长，800–1200ms 内结束。

不要：

- 长动画
- 阻塞交互
- 游戏粒子特效

---

## 13. 底部导航

固定五项：

- 首页
- 探索
- 记录
- 社区
- 我的

选中：深绿。

未选中：灰绿色。

必须处理底部安全区。

---

## 14. 表单

自然档案：

- 选择卡片优于下拉
- 体验目标使用 Chip
- 年龄用年龄段，不强制精确生日

评估：

- 一题一屏/一卡
- 大触控区
- 不做表格式 Radio

体验反馈：

- 情绪 Chip
- 短文本
- 图片可选

---

## 15. 状态设计

异步页面至少考虑：

- loading
- empty
- error
- normal

### 记录空状态

标题：

> 还没有自然记录

说明：

> 开始第一次园艺体验，让这一页慢慢长起来。

按钮：

> 去探索

### 接口错误

不要显示技术错误码。

显示：

> 暂时没有加载成功，再试一次吧。

---

## 全局视觉一致性规则

所有页面必须：

- 使用第 3 节同一色板及设计 Token，不另建页面私有主色。
- 复用叶片、花草、多肉、土壤、阳光等同一组植物自然元素。
- 使用统一卡片体系，优先复用 `NatureCard`、`SenseCard`、`CourseCard`、`AssessmentDimensionCard`、`GrowthCard`、`ImprintCard`。
- 使用统一插画风格；新增素材应与现有 UI 图集在色温、线条、质感和留白上保持一致。
- 统一按钮、圆角、阴影、间距、图标及页面背景，不因页面来源或生成批次改变。

禁止：

- 每个页面重新设计一套风格。
- 使用医疗蓝白风。
- 使用后台管理风。
- 使用科技大屏风。
- 将不同 AI 生成风格、写实照片、3D 图标和扁平插画无规则拼接。

实现规则：先落地全局 Token 与公共组件，再开发业务页。页面参考图与本规范冲突时，以本节的全局一致性为准；参考图只决定构图和内容层级，不得覆盖产品色板与组件体系。

## 17. 一致性检查

每个新页面完成后检查：

- [ ] 背景色一致
- [ ] 左右边距一致
- [ ] 标题字号一致
- [ ] 主按钮一致
- [ ] 卡片圆角一致
- [ ] 阴影一致
- [ ] 图标体系一致
- [ ] 没有突然出现蓝色主色
- [ ] 没有后台表格感
- [ ] 没有不必要医学措辞
- [ ] 底部安全区正常
- [ ] 长文本不溢出

---

## 18. 视觉参考映射

`references/`：

- `01_home.png`：首页
- `02_login.png`：开启体验
- `03_profile_assessment_intro.png`：自然档案 + 评估介绍
- `05_assessment_report.png`：评估答题 + 报告
- `07_explore.png`：探索主页
- `08_five_senses.png`：五感花园
- `09_experience_detail.png`：体验详情
- `10_task.png`：体验任务
- `11_imprint_a.png` / `11_imprint_b.png`：自然印记
- `00_client_reference.png`：甲方旧项目参考

这些图表达视觉和布局，不代表最终专业文案。

完整页面级映射与"我的/社区"参考图状态见 `references/UI页面映射表.md`。


---

# 【03_页面开发手册.md】

# 03 页面开发手册

> 本文件是 Codex 开发页面时的主要输入。每个页面包含：目标、路由、结构、数据、交互、状态、组件、验收和可直接复制的 Prompt。
>
> 每个页面的视觉参考统一查阅 `references/UI页面映射表.md`。

---

# P01 首页 Home

## 路由

`/pages/home/index`

Tab：是。

## 页面目标

第一次进入时在 10 秒内告诉用户：

1. 这是园艺疗法项目
2. 产品强调自然、身心、体验
3. 可以点击“开始体验”

## 进入条件

任何用户可进入，不要求登录。

## 页面结构

1. Hero
2. 什么是园艺疗法
3. 三个价值卡片
4. 快捷入口
5. TabBar

### Hero

主标题：园艺疗法  
副标题：连接自然，疗愈身心  
主按钮：开始体验

点击逻辑：

- 已登录且已有档案：探索
- 已登录但档案未完成：自然档案
- 未登录：开启体验

### 三个价值卡片

- 自然连接
- 情绪放松
- 成长记录

## 数据

P0 静态为主。

## 组件

- `HeroSection`
- `ValueCard`
- `PrimaryButton`

## 状态

无核心异步状态。

## 验收

- 375px 宽无横向滚动
- 第一屏看得到标题和 CTA
- CTA 路由正确
- 风格符合 UI 规范

## Codex Prompt

```text
实现 P01 首页。
先阅读 00_项目总纲与定位.md、02_UI设计规范.md。
技术：uni-app + Vue3。
路由：/pages/home/index。
首页允许未登录访问。
包含自然 Hero、“园艺疗法 / 连接自然，疗愈身心”、开始体验、简短介绍、自然连接/情绪放松/成长记录三个价值卡片、五项底部导航。
不要做资讯门户或后台首页。
开始体验根据 session/profile 状态路由到登录、自然档案或探索。
```

---

# P02 开启体验 / 登录授权

## 路由

`/pages/auth/index`

## 页面目标

把“登录”包装为“开启自然旅程”。

## 页面结构

1. 顶部返回
2. 植物成长主视觉
3. 标题与说明
4. 微信身份按钮
5. 隐私说明
6. dev Mock 登录

标题：

> 开启你的园艺疗法旅程

说明：

> 保存你的状态探索、体验过程与自然印记。

## 技术行为

前端调用：

`uni.login({ provider: 'weixin' })`

code 发送到：

`POST /api/auth/wechat-login`

注意：

- appSecret 永远不放前端
- 不依赖自动获得微信昵称/头像
- 昵称/头像可在自然档案中补充
- 开发环境提供固定 mockUser

## 错误状态

> 暂时没能开启体验，请再试一次。

## 验收

- Mock 模式不依赖微信配置
- 真实登录与 Mock 隔离
- 登录后 token/session 保存
- profileCompleted 路由正确

## Codex Prompt

```text
实现 P02 开启体验页面。
它不是传统登录页，应呈现自然旅程 onboarding。
用 uni.login 获取微信 code；前端只把 code 发给 /api/auth/wechat-login，不出现 appSecret。
开发环境支持 mock 登录。
登录成功后 profileCompleted=false 跳自然档案，否则跳探索。
```

---

# P03 自然档案

## 路由

`/pages/profile/setup`

## 页面目标

以轻量、非注册表方式采集体验档案。

## 字段

### 昵称

- 1–20 字
- P0 可预填“自然体验者”

### 年龄段

建议：

- 12–15
- 16–18
- 19–22
- 23+

### 园艺经验

- beginner：初次接触
- occasional：偶尔尝试
- frequent：经常参与

### 体验目标

多选：

- relax：放松心情
- nature：亲近自然
- learn：了解植物
- hobby：培养兴趣

至少 1 个。

## 页面结构

1. 欢迎语
2. 头像/昵称
3. 年龄段
4. 园艺经验
5. 体验目标
6. 开始状态评估

## 接口

`PUT /api/users/me/profile`

## 验收

- 必填未完成 CTA disabled
- 提交防重复
- 保存后 profileCompleted=true
- 进入 P04

## Codex Prompt

```text
实现 P03 自然档案。
使用选择卡片和 chips，不要密集表单。
字段 nickname、ageRange、gardenExperience、goals[]。
保存到 PUT /api/users/me/profile。
成功进入 /pages/assessment/intro。
```

---

# P04 评估介绍

## 路由

`/pages/assessment/intro`

## 页面目标

说明为什么评估、多久、结果是什么。

## 内容

标题：了解此刻的自己

辅助：

> 用几个轻量问题，看看此刻的情绪、压力和自然连接状态。

信息：

- 约 1–2 分钟
- 共 10 题
- 结果仅作本次体验反馈

按钮：

- 开始评估
- 稍后再说

稍后再说进入探索，推荐使用默认值。

## 验收

- 不出现心理诊断措辞
- 不声称为正式医学量表

## Codex Prompt

```text
实现 P04 评估介绍。
自然疗愈风。
强调 10 题、1–2 分钟、体验反馈。
开始评估进入 questions；稍后再说进入 explore。
```

---

# P05 状态探索 / 答题

## 路由

`/pages/assessment/questions`

## 页面目标

无压力完成 10 题。

## 数据输入

`GET /api/assessments/demo/questions`

开发阶段可用 Mock。

## 状态

- currentIndex
- answers
- submitting

## 交互

- 一次显示一题
- 选择后不自动跳
- 下一题
- 第 2 题后可上一题
- 最后一题“完成评估”
- 进度 = 当前题 / 总题数

## 题目结构

```js
{
  id: 'E1',
  dimension: 'emotion',
  text: '最近一段时间，我能感受到一些轻松或愉快的时刻。',
  reverse: false,
  options: [
    { label: '完全不符合', value: 1 },
    { label: '比较不符合', value: 2 },
    { label: '一般', value: 3 },
    { label: '比较符合', value: 4 },
    { label: '非常符合', value: 5 }
  ]
}
```

## 提交

`POST /api/assessments/demo/submissions`

后端返回结果 ID。

## 验收

- 未选不能下一题
- 回退不丢答案
- 重复点击不重复提交
- 接口失败保留答案

## Codex Prompt

```text
实现 P05 10 题状态探索。
一题一卡，不做考试列表。
显示 progress、题号、5 个大点击选项。
答案保存在页面 state；最后统一 POST。
提交成功进入 /pages/assessment/result?id=...
评分逻辑不要散落在页面。
```

---

# P06 自然状态报告

## 路由

`/pages/assessment/result`

## 页面目标

把评估结果转成“专业感 + 易懂 + 自然体验建议”。

## 页面结构

1. 标题
2. 状态体验概览分（UI 展示名；内部字段 `experienceOverviewScore`）
3. 三维度卡片
4. 解释文案
5. 推荐体验
6. 开始自然体验

## 数据

`GET /api/assessments/submissions/:id`

示例：

```js
{
  experienceOverviewScore: 78,
  emotion: { score: 76, label: '良好' },
  stress: { score: 55, label: '中等' },
  nature: { score: 72, label: '较高' },
  recommendedCourseId: 2
}
```

## 表达

允许：

> 当前压力感受处于中等水平，可以尝试一段自然体验让自己慢下来。

禁止：

> 你患有焦虑。

## CTA

首版建议“开始自然体验”进入探索页，并在推荐卡突出推荐课程。

## 验收

- 三维度清楚
- 状态体验概览分明确是体验反馈，UI 不出现"自然平衡指数"，并有非医学诊断说明
- 推荐可点击
- 无诊断

## Codex Prompt

```text
实现 P06 自然状态报告。
采用植物成长感，不做传统 Dashboard。
显示综合展示值（内部字段 `experienceOverviewScore`，UI 展示名「状态体验概览分」）、emotion、stress、nature、推荐体验。
明确写出该分值仅用于产品体验反馈，不属于医学诊断，不等同于 PANAS/PSS-10/NR-6 等正式量表。
所有数据从 API 获取。
文案必须非诊断性。
```

---

# P07 探索主页

## 路由

`/pages/explore/index`

Tab：是。

## 页面目标

核心体验大厅。

## 页面结构

1. 顶部欢迎
2. 为你推荐
3. 五感探索
4. 正念练习
5. 我的自然旅程进度

## 推荐

有最新评估：用 recommendedCourseId。

无评估：默认多肉种植。

## 五感入口

视觉 / 触觉 / 嗅觉 / 味觉 / 听觉。

## 正念入口

P0 可做静态卡或简单弹层。

## 进度

`GET /api/users/me/growth-summary`

## Codex Prompt

```text
实现 P07 探索主页。
重点是进入花园内部的感觉。
包含推荐体验、五感入口、轻正念入口、成长进度。
不要做课程商城列表。
```

---

# P08 五感花园

## 路由

`/pages/garden/index`

## 页面目标

以“花园探索”而不是“课程分类”展示五感。

## 结构

1. 顶部花园介绍
2. 推荐体验
3. 五感卡片区
4. 自然引导语

## 卡片显示

- 感官
- 图标
- 代表活动
- 一句话
- 图片
- 时长

## 数据

`GET /api/courses`

P0 返回 5 条。

## 验收

- 五个体验全出现
- 点击进入 P09
- 窄屏不挤压
- 不做复杂环形交互

## Codex Prompt

```text
实现 P08 五感花园。
结构采用卡片式，视觉氛围像花园；不要复杂中心环形交互。
固定展示五种体验。
课程数据通过 API/mock 读取，不在模板写死大量文案。
```

---

# P09 自然体验详情

## 路由

`/pages/course/detail?id=`

## 页面目标

让用户知道为什么做、准备什么、怎么做、多久。

## 结构

1. Hero
2. 感官 + 时长
3. 关于这次体验
4. 材料准备
5. 步骤预览
6. 正念提示
7. 安全/注意事项
8. 开始体验

## 数据

`GET /api/courses/:id`

## 视频

有 videoUrl 才显示播放器。

无视频时不展示空播放器。

## CTA

`POST /api/experience-sessions`

创建 session，进入 P10。

## Codex Prompt

```text
实现 P09 自然体验详情。
自然手册风 + 清晰步骤教学。
从 /api/courses/:id 读取课程。
材料、步骤、正念、注意事项按数据渲染。
开始体验创建 session 后进入任务页。
```

---

# P10 体验任务

## 路由

`/pages/experience/task?sessionId=`

## 页面目标

完整走完一次园艺体验。

## 状态

- currentStep
- session
- recordDraft
- uploading
- submitting

## A. 步骤阶段

- 顶部进度
- 当前步骤图片
- 标题
- 说明
- 正念提示
- 上一步 / 下一步

## B. 最终反馈

- 心情选择
- 感受 textarea
- 图片上传
- 完成体验

## 心情

- calm：平静
- relaxed：放松
- focused：专注
- happy：愉悦
- satisfied：满足

P0 单选主心情。

## 图片

0–1 张，可选。

`POST /api/uploads/image`

## 完成

`POST /api/experience-sessions/:id/complete`

成功进入 P11。

## 动效

每完成一步：

- 进度条前进
- 叶片状态轻微变化

不做种植小游戏。

## Codex Prompt

```text
实现 P10 体验任务。
前半是步骤向导，后半是体验反馈。
支持 currentStep、上一步、下一步、进度。
最终提交 emotion、reflection、可选 image。
成功后进入自然印记。
不要增加游戏模拟种植。
```

---

# P11 自然印记

## 路由

`/pages/imprint/detail?recordId=`

## 页面目标

形成完成仪式感。

## 结构

1. 轻完成动画
2. 恭喜
3. 自然印记卡
4. 我的感受
5. 数据摘要
6. 成长身份
7. 查看记录
8. 继续探索

## 数据

`GET /api/experience-records/:id`

包含：

- courseTitle
- senseLabel
- completedAt
- emotionLabel
- reflection
- imageUrl
- duration
- completedCount
- exploredSenseCount

## 分享

P1。

P0 不展示无功能按钮。

## Codex Prompt

```text
实现 P11 自然印记。
上半成长日记/手账风，下半轻数据摘要。
进入时读取 recordId。
有轻植物成长动画但不阻塞。
提供“查看我的记录”和“继续探索”。
```

---

# P12 我的自然记录

## 路由

`/pages/records/index`

Tab：是。

## 页面目标

把所有自然印记组织成成长旅程。

## 结构

1. 「我的自然旅程」标题
2. Growth Summary（累计体验数、已探索感官、累计时间）
3. 历史体验记录（时间轴，按完成时间倒序）
4. RecordCard 列表
5. 点击 RecordCard 查看对应自然印记

## 接口

`GET /api/users/me/growth-summary`

`GET /api/experience-records?mine=true`

## 空状态

> 还没有自然记录  
> 开始第一次园艺体验，让这一页慢慢长起来。

CTA：去探索。

## Codex Prompt

```text
实现 P12 记录页。
自然成长时间轴，不做数据报表。
顶部累计体验数、已探索感官、累计时间。
下方按 completedAt 倒序展示自然印记。
历史记录必须可进入自然印记详情。
必须有漂亮空状态。
```

---

# P13 我的

## 路由

`/pages/mine/index`

Tab：是。

## 页面目标

个人信息和低频入口。

## 结构

1. 用户 Header
2. 成长身份
3. 最近评估
4. 我的记录
5. 关于园艺疗法
6. 隐私说明
7. dev 环境清空 Mock（仅开发）

## 禁止

不要加充值、会员、订单、地址、消息中心。

## 视觉参考

- `references/UI页面映射表.md`：目前暂无"我的"专属参考图，按 UI 规范与 P13 结构实现；若补充参考图，见映射表更新说明。

## Codex Prompt

```text
实现 P13 我的。
必须显示用户信息、成长身份、最近评估、我的记录入口、关于园艺疗法、隐私说明。
不要套商城/社区个人中心模板。
```

---

# P14 社区占位

## 路由

`/pages/community/index`

Tab：是。

## 推荐实现

P0 用真实占位页，比 custom TabBar 拦截更简单稳定。

页面：

- 植物与分享插画
- 自然分享空间（标题）
- 自然分享空间，未来开放。
- 回到探索

后期如有余力，再做 custom tabbar 弹窗。

## Codex Prompt

```text
实现 P14 社区占位。
这是未来功能预告，不实现社交。
标题「自然分享空间」，正文「自然分享空间，未来开放」。
不实现发帖、评论、点赞、私信、关注，不放假按钮。
不提供任何假按钮，保持自然社区感，并提供回到探索。
```

---

# 全局路由约束

未登录可访问：

- 首页
- 社区占位
- 关于

需要身份：

- 自然档案
- 评估
- 记录
- 我的个人数据
- 体验记录

建议统一 `navigateWithAuth()` helper，不要每页复制登录判断。

---

# 全局验收

每页至少验证：

- 320px/375px
- iPhone 底部安全区
- 空数据
- 接口失败
- 快速重复点击
- 返回按钮
- Tab 状态
- 中文长文本


---

# 【04_技术架构与数据设计.md】

# 04 技术架构、数据库与 API

> v1.2 技术裁决：MVP 只以**微信云开发**（云数据库 / 云函数 / 云存储）作为默认真实数据方案，适合本项目“体验人数 < 10、展示为主、两人开发”的实际场景。Node.js + Express + MySQL 仅是未来扩展方案，不是 MVP 必需项，不得为此阻塞页面、Mock 闭环或答辩交付。

### MVP 技术选择结论

| 项目 | MVP 结论 |
|---|---|
| 页面数据 | 先使用本地 Mock，保持完整演示路径可离线运行 |
| 真实用户与记录 | 页面稳定后接微信云开发 |
| 数据库 | 云数据库简化集合，不先建 MySQL |
| 业务逻辑 | 轻量 service + 必要云函数，不建设独立服务层集群 |
| 图片 | 演示期可 Mock；需要真上传时使用云存储 |
| Node/Express/MySQL | 只在未来科研化、复杂查询、独立后台或跨端接入明确发生时评估迁移 |

## 1. 技术栈

### 前端

- uni-app
- Vue 3
- Composition API
- Pinia
- JavaScript（首版推荐，降低团队学习成本）
- SCSS

如果脚手架默认 TypeScript，不必强制改回 JavaScript；但项目必须统一，不要中途混乱迁移。

### 后端（默认方案：微信云开发）

- 微信云开发 CloudBase（免部署、免域名、免 HTTPS 配置）
- 云数据库：文档型集合，MVP 以 JSON 配置为主（见第 6 节）
- 云函数：Node.js，承载登录、评估评分、体验记录等逻辑
- 云存储：图片上传
- 登录：云开发自带 openid 能力，无需自建 JWT

### 扩展方案（非 MVP：Node.js + Express + MySQL）

- Node.js
- Express
- MySQL
- JWT 或等价轻量 session token
- 图片上传：multer + 对象存储 SDK，或 Demo 阶段 Mock
- 适用场景：甲方后续科研化、需要复杂关系查询与独立后台时迁移

### 部署

展示环境优先。

默认方案：开通微信云开发环境后即可发布体验版，无需域名/备案。

备选方案：真实微信请求需要 HTTPS、合法 request 域名和微信小程序配置。

无论哪种方案，前端必须通过 Mock 模式完成全部主流程，再切换真实数据。

```text
默认架构（v1.2）：
小程序前端（uni-app + Vue3 + Pinia）
        │
        ▼
微信云开发（云函数 / 云数据库 / 云存储）
        │
        ▼
体验版发布（无需域名与备案）

备选架构（科研化时）：
小程序前端
   │
   ▼
Node.js + Express（HTTPS + 合法域名）
   │
   ▼
MySQL
```

---

## 2. 架构原则

1. 前端与内容数据解耦
2. 页面不写死大型课程对象
3. API response 有统一 envelope
4. 评分逻辑放后端/service，不散落页面
5. 上传逻辑封装
6. 登录逻辑封装
7. Mock 与 Real API 可切换
8. 不建设微服务
9. 不为少于 10 人的 Demo 做高并发优化
10. 不为未来可能需求提前堆复杂抽象
11. MVP 内容以 JSON 配置为主，关系库结构仅作生产参考，避免过早建库成本
12. 页面先于后端完成；任何云环境问题都由 Mock Adapter 兜底
13. MVP 不同时维护云开发与 Express 两套真实后端实现

---

## 3. 推荐目录

```text
project/
├─ src/
│  ├─ pages/
│  │  ├─ home/
│  │  ├─ auth/
│  │  ├─ profile/
│  │  ├─ assessment/
│  │  ├─ explore/
│  │  ├─ garden/
│  │  ├─ course/
│  │  ├─ experience/
│  │  ├─ imprint/
│  │  ├─ records/
│  │  ├─ community/
│  │  └─ mine/
│  ├─ components/
│  │  ├─ base/
│  │  ├─ course/
│  │  ├─ assessment/
│  │  └─ growth/
│  ├─ stores/
│  │  ├─ user.js
│  │  ├─ assessment.js
│  │  └─ experience.js
│  ├─ api/
│  │  ├─ request.js
│  │  ├─ auth.js
│  │  ├─ users.js
│  │  ├─ assessments.js
│  │  ├─ courses.js
│  │  ├─ experiences.js
│  │  └─ uploads.js
│  ├─ mock/
│  ├─ styles/
│  │  ├─ tokens.scss
│  │  └─ global.scss
│  ├─ utils/
│  └─ static/
└─ server/
   ├─ src/
   │  ├─ routes/
   │  ├─ controllers/
   │  ├─ services/
   │  ├─ repositories/
   │  ├─ middleware/
   │  ├─ config/
   │  └─ db/
   └─ app.js
```

---

## 4. 前端状态管理

### userStore

```js
{
  token,
  user,
  profileCompleted,
  latestAssessmentId,
  isLoggedIn
}
```

actions：

- loginWithWechat
- mockLogin
- fetchMe
- updateProfile
- logout

### assessmentStore

只保存当前流程：

- questions
- answers
- currentIndex

提交成功后可清空答题 state。

### experienceStore

- activeSession
- currentStep
- draftFeedback

课程列表无需全塞 Pinia，普通页面 state 即可。

---

## 5. 环境变量

建议：

```text
.env.development
.env.production
```

至少：

- VITE_API_BASE_URL
- VITE_USE_MOCK
- VITE_APP_ENV
- VITE_CLOUD_ENV（云开发环境 ID，默认方案使用）

禁止把以下放前端：

- 微信 appSecret
- 数据库密码
- JWT secret
- 云开发环境密钥（仅服务端/云函数持有）

---

# 6. 数据库设计

> **MVP 实现原则（v1.1）**：当前项目人数 < 10、以展示为主，**不要求先建完整关系库**。默认用云数据库的简化集合 + JSON 内容配置（课程、评估题、文案均可直接使用 `05_Mock数据与业务规则.md` 的 JSON）。下面的 SQL 表结构是**生产结构参考**，仅在采用 Node/MySQL 备选方案或甲方科研化时落地。

## 6.1 users

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  openid VARCHAR(128) UNIQUE NULL,
  nickname VARCHAR(64) NOT NULL DEFAULT '自然体验者',
  avatar_url VARCHAR(500) NULL,
  age_range VARCHAR(32) NULL,
  garden_experience VARCHAR(32) NULL,
  goals JSON NULL,
  profile_completed TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

说明：

- P0 不强制手机号
- Mock 用户 openid 可为空
- goals 用 JSON 简化

## 6.2 assessment_questions

```sql
CREATE TABLE assessment_questions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(32) UNIQUE NOT NULL,
  assessment_type VARCHAR(32) NOT NULL DEFAULT 'demo',
  dimension VARCHAR(32) NOT NULL,
  question_text VARCHAR(500) NOT NULL,
  reverse_scored TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL,
  enabled TINYINT(1) NOT NULL DEFAULT 1
);
```

## 6.3 assessment_options

```sql
CREATE TABLE assessment_options (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  question_id BIGINT NOT NULL,
  option_label VARCHAR(100) NOT NULL,
  option_value INT NOT NULL,
  sort_order INT NOT NULL,
  FOREIGN KEY (question_id) REFERENCES assessment_questions(id)
);
```

## 6.4 assessment_submissions

```sql
CREATE TABLE assessment_submissions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  assessment_type VARCHAR(32) NOT NULL DEFAULT 'demo',
  emotion_score INT NOT NULL,
  stress_score INT NOT NULL,
  nature_score INT NOT NULL,
  experience_overview_score INT NOT NULL,
  recommended_course_id BIGINT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 6.5 assessment_answers

```sql
CREATE TABLE assessment_answers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  submission_id BIGINT NOT NULL,
  question_id BIGINT NOT NULL,
  answer_value INT NOT NULL,
  FOREIGN KEY (submission_id) REFERENCES assessment_submissions(id),
  FOREIGN KEY (question_id) REFERENCES assessment_questions(id)
);
```

## 6.6 courses

```sql
CREATE TABLE courses (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(64) UNIQUE NOT NULL,
  title VARCHAR(100) NOT NULL,
  subtitle VARCHAR(200) NULL,
  sense VARCHAR(32) NOT NULL,
  cover_url VARCHAR(500) NULL,
  duration_minutes INT NULL,
  description TEXT NULL,
  mindfulness_prompt TEXT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'published',
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 6.7 course_materials

```sql
CREATE TABLE course_materials (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  course_id BIGINT NOT NULL,
  name VARCHAR(100) NOT NULL,
  note VARCHAR(255) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

## 6.8 course_steps

```sql
CREATE TABLE course_steps (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  course_id BIGINT NOT NULL,
  step_no INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  image_url VARCHAR(500) NULL,
  video_url VARCHAR(500) NULL,
  mindfulness_tip VARCHAR(500) NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

## 6.9 course_safety_tips

```sql
CREATE TABLE course_safety_tips (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  course_id BIGINT NOT NULL,
  content VARCHAR(500) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

## 6.10 experience_sessions

```sql
CREATE TABLE experience_sessions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  course_id BIGINT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'in_progress',
  started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

## 6.11 experience_records

```sql
CREATE TABLE experience_records (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  session_id BIGINT UNIQUE NOT NULL,
  user_id BIGINT NOT NULL,
  course_id BIGINT NOT NULL,
  emotion VARCHAR(32) NOT NULL,
  reflection VARCHAR(1000) NULL,
  image_url VARCHAR(500) NULL,
  duration_minutes INT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES experience_sessions(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

## 6.12 Growth 数据

P0 不单独建 growth 表。

实时聚合：

- completedCount = experience_records count
- exploredSenseCount = distinct course.sense
- totalMinutes = sum(duration_minutes)

成长等级由 service 根据 completedCount 计算。

---

# 6.13 云开发简化集合映射（MVP 默认）

采用云开发时，不建上述 12 张关系表，改用以下集合/配置：

| 数据 | 云开发落地方式 | 说明 |
|---|---|---|
| users | `users` 集合 | openid、昵称、年龄段、园艺经验、goals、profileCompleted |
| 评估题 | `assessment_demo` 集合或前端 JSON | 直接使用 `05_Mock数据与业务规则.md` 第 2 节的 10 题结构 |
| 评估提交 | `assessments` 集合 | 存三维度分与综合展示值 |
| 课程 | `courses` 集合（每课一文档） | 直接使用 `05` 第 5 节的课程 JSON（materials/steps/safetyTips 内嵌） |
| 体验会话/记录 | `sessions`、`records` 集合 | 状态、心情、感受、图片 fileID |
| 图片 | 云存储 | 上传返回 fileID，前端用临时链接展示 |
| 成长数据 | 实时聚合 | 不单独建表 |

> 约定：集合字段名尽量沿用第 6 节的表字段（snake_case），保证未来迁移 Node/MySQL 时数据可映射。

---

# 7. 数据关系

```text
User
 ├─ AssessmentSubmission
 │   └─ AssessmentAnswer
 └─ ExperienceSession
     └─ ExperienceRecord
         └─ Course
             ├─ CourseMaterial
             ├─ CourseStep
             └─ CourseSafetyTip
```

---

# 8. API 统一规范

Base：

`/api`

成功：

```json
{
  "code": 0,
  "message": "ok",
  "data": {}
}
```

失败：

```json
{
  "code": 40001,
  "message": "参数错误",
  "data": null
}
```

HTTP status 仍使用正确的 2xx/4xx/5xx。

---

# 9. Auth API

> 本章 API 名称是前端 Adapter 的**逻辑契约**。微信云开发默认方案可通过 `wx.cloud.callFunction` 实现，不要求真的暴露 HTTP `/api` 路由。

## POST /api/auth/wechat-login

**MVP 默认（微信云开发）：**

1. 调用登录云函数。
2. 云函数通过运行上下文获取 openid，不在前端保存 appSecret。
3. 按 openid upsert 用户。
4. 返回用户对象；不自建 JWT。

**以下 code2Session + token 流程仅适用于未来 Express 扩展方案：**

Request：

```json
{
  "code": "wx-login-code"
}
```

后端：

1. server-side 使用 appid/appSecret 调微信 code2Session
2. 获取 openid
3. upsert user
4. 返回 token

Response：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "token": "jwt",
    "user": {
      "id": 1,
      "nickname": "自然体验者",
      "profileCompleted": false
    }
  }
}
```

开发环境：

`POST /api/auth/mock-login`

只在非生产开放。

---

# 10. User API

## GET /api/users/me

返回当前用户。

## PUT /api/users/me/profile

Request：

```json
{
  "nickname": "小叶",
  "ageRange": "19-22",
  "gardenExperience": "beginner",
  "goals": ["relax", "nature"]
}
```

---

# 11. Assessment API

## GET /api/assessments/demo/questions

返回问题数组。

前端只需要 label/value，不承担评分算法。

## POST /api/assessments/demo/submissions

Request：

```json
{
  "answers": [
    { "questionCode": "E1", "value": 4 },
    { "questionCode": "E2", "value": 3 }
  ]
}
```

后端：

- 校验 10 题完整
- 计算三维度
- 计算 experienceOverviewScore
- 选择推荐课程
- 保存 submission + answers

Response：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "submissionId": 12,
    "experienceOverviewScore": 78,
    "emotion": { "score": 76, "label": "良好" },
    "stress": { "score": 55, "label": "中等" },
    "nature": { "score": 72, "label": "较高" },
    "recommendedCourseId": 2
  }
}
```

## GET /api/assessments/submissions/:id

报告页、历史查看。

## GET /api/users/me/assessments/latest

我的页面读取最近评估。

---

# 12. Course API

## GET /api/courses

Query 可选：

- sense
- status

P0 可直接返回 5 条。

## GET /api/courses/:id

示例：

```json
{
  "id": 2,
  "title": "多肉种植",
  "sense": "touch",
  "durationMinutes": 15,
  "description": "...",
  "materials": [],
  "steps": [],
  "safetyTips": [],
  "mindfulnessPrompt": "..."
}
```

---

# 13. Experience API

## POST /api/experience-sessions

Request：

```json
{
  "courseId": 2
}
```

Response：

`sessionId`

## GET /api/experience-sessions/:id

读取 session + course。

## POST /api/experience-sessions/:id/complete

Request：

```json
{
  "emotion": "calm",
  "reflection": "今天感觉很平静。",
  "imageUrl": null
}
```

后端：

- 校验 session 属于当前用户
- 已完成时返回已有 record，保证幂等
- 更新 completed_at
- 创建 experience_record

Response：

```json
{
  "recordId": 21
}
```

---

# 14. Record API

## GET /api/experience-records?mine=true

按 created_at DESC。

## GET /api/experience-records/:id

自然印记详情。

## GET /api/users/me/growth-summary

Response：

```json
{
  "completedCount": 3,
  "exploredSenseCount": 2,
  "totalMinutes": 45,
  "level": "自然探索者"
}
```

---

# 15. Upload API

## POST /api/uploads/image

- multipart/form-data
- 0–1 张
- 前端可压缩
- 后端校验 MIME
- 返回 URL

P0 可以先 Mock 返回本地占位。

默认方案：云函数接收图片后写入云存储，返回 fileID/临时链接；备选方案：multer + 对象存储。

---

# 16. 安全与隐私

即使 Demo，也遵循：

- appSecret 不放前端
- 不存用户密码
- 不收集精确地址
- 不强制手机号
- 不收集具体疾病诊断
- JWT secret 放 server env
- 上传限制类型和大小
- 记录接口校验 userId

---

# 17. Mock / Real API 切换

推荐 `src/api/request.js` 根据 `VITE_USE_MOCK` 决定 adapter。

页面组件不得直接判断 Mock 环境。

默认方案下，"Real API"即云函数 HTTP 触发/调用，前端走同一 `request.js` 层；API 契约与备选 Express 方案一致（见第 8–14 节）。

---

# 18. 后台管理

P0 不做独立后台 UI。

内容录入方式：

1. seed SQL / JSON
2. 数据库直接维护
3. 若甲方后续要求，再增加简单 Admin

理由：少于 10 人且展示为主，后台 UI 的投入产出低。

MVP 默认用方式 1：把 `05_Mock数据与业务规则.md` 的 JSON 作为 seed，导入云数据库集合即可。

---

# 19. 日志

P0：

- server error log
- basic API access log

不搭复杂监控。

---

# 20. 技术验收

- 首页可无后端运行
- Mock 全链路可运行
- Real API 关键接口可联调
- 重复提交体验不会重复生成记录
- secret 不泄露
- 主要 API 有错误处理
- 数据可用 seed/JSON 初始化（云数据库集合或 SQL 均可）

# 21. 发布与体验版准备清单

展示环境优先，发布准备按以下清单推进：

**默认方案（微信云开发）：**

1. **小程序账号**：确认 appid（正式号或测试号），在微信公众平台创建项目。
2. **开通云开发**：创建云开发环境，记录环境 ID 到 `VITE_CLOUD_ENV`。
3. **部署云函数**：上传登录、评估、体验、上传等云函数；导入 `courses`/`assessments` 等集合 seed。
4. **体验版**：通过微信开发者工具上传代码，生成体验版二维码并添加体验成员。
5. **隐私保护指引**：在小程序后台填写《用户隐私保护指引》（涉及头像昵称、相册/相机用途）。
6. **Mock 兜底**：答辩演示机保持 `VITE_USE_MOCK=true`，确保无网络也能完整走通。
7. **真机权限**：若用户拒绝相册/相机权限，页面给出可理解的中文说明，不阻塞主流程。
8. **演示数据**：答辩前按 `07_验收测试与答辩演示.md` 第 6 节准备默认数据。

**备选方案（Node/MySQL）额外清单：**

- 配置合法 request/uploadFile 域名并部署 HTTPS（需域名与备案）
- 初始化 MySQL 表结构与 seed（见第 6 节 SQL）
- 未就绪前保持 Mock 模式


---

# 【05_Mock数据与业务规则.md】

# 05 Mock 数据与业务规则

> 本文件用于在甲方内容尚未给齐时继续开发。以下均为演示占位数据，不代表正式园艺/护理/心理专业内容。
>
> 整合包说明：本文件为实现侧参考（Mock 数据 + 评分/推荐/成长的代码规则）；产品规则以 `01_产品需求规格说明书.md` 第 7–9 节为唯一事实来源。两处若有不一致，以 01 为准并同步更新。
>
> v1.1 说明：本文件中的 JSON（课程、评估题、记录）即 MVP 的默认数据载体，可直接作为云数据库 seed 或前端 mock；无需先建关系表。

---

# 1. Mock 用户

```js
export const mockUser = {
  id: 1,
  nickname: '小叶',
  avatarUrl: '',
  ageRange: '19-22',
  gardenExperience: 'beginner',
  goals: ['relax', 'nature'],
  profileCompleted: true
}
```

---

# 2. 展示型评估

## 2.1 原则

这是产品演示用状态探索，不是正式 PANAS/PSS-10/NR-6。

三维度：

- emotion
- stress
- nature

共 10 题。

## 2.2 Mock 题目

```js
export const demoQuestions = [
  {
    code: 'E1',
    dimension: 'emotion',
    text: '最近一段时间，我能感受到一些轻松或愉快的时刻。',
    reverse: false
  },
  {
    code: 'E2',
    dimension: 'emotion',
    text: '最近一段时间，我愿意投入自己感兴趣的事情。',
    reverse: false
  },
  {
    code: 'E3',
    dimension: 'emotion',
    text: '最近一段时间，我能够找到让自己慢下来的时刻。',
    reverse: false
  },
  {
    code: 'E4',
    dimension: 'emotion',
    text: '最近一段时间，我常常觉得情绪被消耗。',
    reverse: true
  },
  {
    code: 'S1',
    dimension: 'stress',
    text: '最近一段时间，我觉得需要同时处理的事情很多。',
    reverse: false
  },
  {
    code: 'S2',
    dimension: 'stress',
    text: '最近一段时间，我很难让自己真正放松下来。',
    reverse: false
  },
  {
    code: 'S3',
    dimension: 'stress',
    text: '最近一段时间，我容易因为小事感到紧绷。',
    reverse: false
  },
  {
    code: 'N1',
    dimension: 'nature',
    text: '接触植物或自然环境时，我会注意到一些细微变化。',
    reverse: false
  },
  {
    code: 'N2',
    dimension: 'nature',
    text: '我愿意花一些时间观察植物、天空、风或其他自然事物。',
    reverse: false
  },
  {
    code: 'N3',
    dimension: 'nature',
    text: '待在自然环境中时，我通常更容易感到平静。',
    reverse: false
  }
]
```

统一选项：

```js
[
  { label: '完全不符合', value: 1 },
  { label: '比较不符合', value: 2 },
  { label: '一般', value: 3 },
  { label: '比较符合', value: 4 },
  { label: '非常符合', value: 5 }
]
```

---

# 3. Demo 评分

## 3.1 反向

E4：

`adjusted = 6 - value`

Stress 数值越高表示主观压力越高。

## 3.2 归一化

```text
normalized = (mean - 1) / 4 * 100
```

范围 0–100。

## 3.3 综合展示值（UI 展示名：状态体验概览分）

本值在 UI 上的展示名为**「状态体验概览分」**，内部字段统一为 `experienceOverviewScore`。旧字段 `balanceIndex` 停止新增使用；若已有 Mock 或缓存数据，可仅在 Adapter 层做一次兼容转换。

该值仅用于产品体验反馈，不属于医学诊断，不等同于 PANAS、PSS-10、NR-6 等正式量表。

仅作产品展示：

```text
experienceOverviewScore =
0.40 * emotion
+ 0.30 * (100 - stress)
+ 0.30 * nature
```

四舍五入整数。

UI 允许：

- 状态体验概览分
- 情绪感受 / 压力感受 / 自然连接

禁止：

- 心理健康评分
- 临床评分
- 风险分
- 自然平衡指数

## 3.4 Level

Emotion：

- 0–39：需要休息
- 40–69：一般
- 70–100：良好

Stress：

- 0–39：较低
- 40–69：中等
- 70–100：较高

Nature：

- 0–39：正在建立
- 40–69：中等
- 70–100：较高

这些阈值只服务 Demo UI，不代表临床阈值。

---

# 4. 推荐规则

不做算法。

1. stress >= 70 → 触觉 / 多肉种植
2. emotion < 40 → 嗅觉 / 香草香囊
3. nature < 40 → 视觉 / 植物拓印
4. 其他 → 触觉 / 多肉种植

多肉作为默认，因为当前视觉和流程最完整。

---

# 5. 五个 Mock 体验

## 5.1 视觉：植物拓印

```js
{
  slug: 'plant-rubbing',
  title: '植物拓印',
  sense: 'visual',
  durationMinutes: 15,
  subtitle: '把叶片的纹理留在纸上',
  description: '观察叶片的形态、颜色与纹理，通过简单拓印留下自然细节。',
  materials: ['叶片', '白纸', '颜料或蜡笔', '垫板'],
  mindfulnessPrompt: '先观察叶脉的走向，不急着开始，看看这片叶子有哪些以前没有注意到的细节。',
  safetyTips: ['请选择无明显刺激性的植物材料。'],
  steps: [
    ['选择叶片', '观察叶片形态与纹理。'],
    ['摆放叶片', '将叶片平整摆放。'],
    ['进行拓印', '缓慢完成拓印，观察纹理出现。'],
    ['完成作品', '看看最吸引你的自然细节。']
  ]
}
```

## 5.2 触觉：多肉种植

```js
{
  slug: 'succulent-planting',
  title: '多肉种植',
  sense: 'touch',
  durationMinutes: 15,
  subtitle: '在泥土与植物之间感受专注',
  description: '通过接触土壤、花盆与植物，在种植过程中关注触觉与当下。',
  materials: ['多肉植物', '小花盆', '营养土', '小铲'],
  mindfulnessPrompt: '放慢动作，感受土壤的触感与温度，把注意力放在手中的植物。',
  safetyTips: ['如对土壤或植物材料敏感，请遵循甲方提供的安全说明。'],
  steps: [
    ['准备植物', '观察多肉的形态与状态。'],
    ['填入土壤', '轻轻加入营养土，感受触感。'],
    ['种植多肉', '将植物放入花盆并固定。'],
    ['轻轻浇水', '按材料说明加入适量水。'],
    ['完成作品', '停下来看看自己的作品。']
  ]
}
```

## 5.3 嗅觉：香草香囊

```js
{
  slug: 'herbal-sachet',
  title: '香草香囊',
  sense: 'smell',
  durationMinutes: 12,
  subtitle: '从植物气味中寻找安静时刻',
  description: '通过识别与组合植物香气，完成一个简单香囊。',
  materials: ['香草材料', '布袋', '小勺'],
  mindfulnessPrompt: '闻到气味时先不判断喜欢或不喜欢，只注意它带来的第一感觉。',
  safetyTips: ['材料种类和过敏提示必须由甲方最终确认。'],
  steps: [
    ['认识材料', '分别观察和感受不同香草。'],
    ['选择气味', '选择自己更舒适的组合。'],
    ['装入香囊', '缓慢装入材料。'],
    ['完成体验', '再次感受组合后的气味。']
  ]
}
```

## 5.4 味觉：花草茶制作

```js
{
  slug: 'herbal-tea',
  title: '花草茶制作',
  sense: 'taste',
  durationMinutes: 10,
  subtitle: '用一杯温热的植物饮品慢下来',
  description: '观察材料、冲泡并留意香气、温度和味道的变化。',
  materials: ['花草茶材料', '杯具', '温水'],
  mindfulnessPrompt: '先观察颜色和香气，再慢慢品尝，不急着给味道下结论。',
  safetyTips: ['可食用材料、冲泡方式、过敏和禁忌必须由甲方专业人员确认。'],
  steps: [
    ['观察材料', '看看材料的颜色和形态。'],
    ['准备冲泡', '按照甲方提供方式准备。'],
    ['等待变化', '观察颜色与气味变化。'],
    ['慢慢品尝', '关注温度与味觉感受。']
  ]
}
```

## 5.5 听觉：自然声音 + 正念

```js
{
  slug: 'nature-sound',
  title: '自然声音',
  sense: 'hearing',
  durationMinutes: 8,
  subtitle: '把注意力交给风声、鸟鸣与呼吸',
  description: '通过一段自然声音和轻呼吸练习，体验听觉带来的专注。',
  materials: ['耳机（可选）', '安静空间'],
  mindfulnessPrompt: '听见一个声音后，不需要追着它走，只注意它出现、停留和离开。',
  safetyTips: ['保持舒适音量。'],
  steps: [
    ['准备环境', '选择相对安静的位置。'],
    ['开始聆听', '播放自然声音。'],
    ['关注呼吸', '把部分注意力放回呼吸。'],
    ['结束记录', '写下一种最明显的感受。']
  ]
}
```

---

# 6. Mock 自然印记

```js
export const mockRecord = {
  id: 21,
  courseId: 2,
  courseTitle: '多肉种植',
  sense: 'touch',
  senseLabel: '触觉体验',
  emotion: 'calm',
  emotionLabel: '平静',
  reflection: '今天感觉很平静，专注在植物和泥土上时，脑子里安静了很多。',
  imageUrl: '',
  durationMinutes: 15,
  completedAt: '2026-08-09T10:30:00+08:00',
  growthSummary: {
    completedCount: 1,
    exploredSenseCount: 1,
    totalMinutes: 15,
    level: '初识自然'
  }
}
```

---

# 7. 成长 Level

```js
function getGrowthLevel(completedCount) {
  if (completedCount <= 0) return '等待启程'
  if (completedCount === 1) return '初识自然'
  if (completedCount <= 3) return '自然探索者'
  if (completedCount <= 5) return '五感漫游者'
  return '自然同行者'
}
```

---

# 8. 状态报告文案模板

## 情绪

good：

> 你当前的情绪体验较为稳定，可以继续保持让自己放松和投入的节奏。

medium：

> 你最近的情绪状态有一些起伏，可以给自己留一点慢下来的空间。

rest：

> 你可能需要更多休息和放松时间。可以从简单、低负担的自然体验开始。

## 压力

low：

> 当前压力感受较轻，可以按照自己的节奏探索。

medium：

> 适度压力很常见，可以尝试通过自然活动让注意力从忙碌中暂时抽离。

high：

> 你最近感受到的压力比较明显。建议本次先选择节奏简单、步骤清晰的体验，让自己慢下来。

## 自然连接

low：

> 可以从观察一片叶子、触摸土壤这样的简单体验开始。

medium：

> 你已经能感受到一些自然细节，可以继续探索不同感官。

high：

> 你对自然环境有较好的感知，可以尝试更细致地记录自己的体验。

这些都是体验文案，不是医疗建议。

---

# 9. 替换甲方内容规则

不要在 Vue 页面直接改大型业务文案。

替换路径：

- 课程 → DB seed / mock course config
- 评估题 → assessment seed
- 图片 → asset mapping
- 正念提示 → course content
- 安全提示 → course safety tips

目标：后期替换内容不需要重构页面。


---

# 【06_开发计划与任务拆分.md】

# 06 开发计划与任务拆分

## 使用规则

不要一次要求 Codex 自动完成全部项目。

推荐：

- 一个任务 = 一个明确变更集
- 完成后运行
- 验收
- commit
- 再进入下一任务

两人按产品模块拆，不固定“一个前端、一个后端”。

---

# Codex 执行顺序（强制）

不要直接从"实现 P01"开始写页面。按以下顺序推进，避免页面写完后发现组件/数据未就绪：

```text
Step 0  项目初始化（T001）
Step 1  设计系统：UI Token + 全局样式（T002 前半）
Step 2  公共组件：按钮/卡片/空状态/进度条等（T002 后半）
Step 3  Mock 数据：用户/评估题/课程/记录（T003）
Step 4  核心流程页面（P0-A：P01–P11）
Step 5  产品完整性页面（P0-B：P12 记录、P13 我的）
Step 6  社区占位（P0-C：P14）+ 核心页面视觉优化
Step 7  数据接入：云函数替换 Mock（Phase 5–6，页面不得等待）
```

阶段对应：Step 0–3 = Phase 0；Step 4 = Phase 1–4 的 P0-A；Step 5 = Phase 4 的 P0-B；Step 6 = P0-C 与 Phase 7；Step 7 = Phase 5–6。

---

# Phase 0 项目骨架

## T001 初始化 uni-app Vue3

优先级：P0  
预计：0.5 天

输入：

- 00 项目总纲
- 02 UI 规范
- 04 技术架构

输出：

- 可运行项目
- pages.json
- Pinia
- styles token

验收：

- 微信开发者工具运行
- Home/Explore/Records/Community/Mine 五 Tab 可跳

Prompt：

```text
阅读 00_项目总纲与定位.md、02_UI设计规范.md、04_技术架构与数据设计.md。
初始化 uni-app + Vue3 项目。配置 Pinia、SCSS tokens、五个 Tab 页面和基础目录。
不要实现业务，只建立稳定清晰的骨架。
完成后列出新增文件、运行方式和下一步建议。
```

---

## T002 UI Token + 基础组件

优先级：P0  
预计：0.5–1 天

创建：

- PrimaryButton
- BaseCard
- SectionHeader
- EmptyState
- LoadingState
- EmotionChip
- ProgressBar

验收：

- 组件有 demo usage
- 不依赖页面硬编码颜色

---

## T003 Mock API 基础设施

优先级：P0  
预计：0.5 天

目标：

无后端时所有页面都可开发。

创建：

- mock user
- mock questions
- mock courses
- mock records
- mock service adapter

---

# Phase 1 首页与身份

## T010 P01 首页

预计：1 天

验收：

- 首屏完成度
- CTA 路由
- 视觉统一

## T011 P02 开启体验

预计：0.5–1 天

先 Mock login，后接真实 login。

## T012 P03 自然档案

预计：1 天

验收：

- 表单校验
- 多选状态
- 保存后进入评估

---

# Phase 2 评估闭环

## T020 评估 Mock 数据

预计：0.5 天

10 题单独配置。

## T021 P04 评估介绍

预计：0.5 天

## T022 P05 答题

预计：1–1.5 天

重点：

- state
- back
- progress
- validation

## T023 Demo 评分 service

预计：0.5 天

验证：

- 全 1
- 全 3
- 全 5
- 混合值

输出始终 0–100。

## T024 P06 状态报告

预计：1–1.5 天

重点视觉页，两人共同 Review。

---

# Phase 3 探索与五感

## T030 P07 探索主页

预计：1–1.5 天

## T031 P08 五感花园

预计：1–1.5 天

重点视觉页。

## T032 5 个课程 Mock

预计：0.5 天

## T033 P09 体验详情

预计：1–1.5 天

先把多肉完整做通，再让其他 4 个共用数据模板。

---

# Phase 4 体验闭环

## T040 Experience Session state

预计：0.5 天

## T041 P10 体验任务

预计：1.5–2 天

重点：

- 步骤切换
- 反馈
- 图片上传 Mock
- 防重复提交

## T042 P11 自然印记

预计：1–1.5 天

重点视觉页，两人共同 Review。

## T043 P12 记录

预计：1 天

属于 P0-B 必做基础版，排在 P0-A 全通之后，但不得移出 MVP。至少实现我的自然旅程、历史体验记录和自然印记查看。

## T044 P13 我的

预计：0.5–1 天

属于 P0-B 必做基础版。至少实现用户信息、成长身份、最近评估、我的记录入口、关于园艺疗法、隐私说明。

## T045 P14 社区占位

预计：0.25 天

属于 P0-C；文案为「自然分享空间，未来开放」，见 `03_页面开发手册.md` P14。不实现任何社交交互。

---

# Phase 5 数据接入（默认云开发 / 备选后端）

说明：

前端 Mock 链路稳定后再切真实数据，减少联调阻塞。

## T050 云开发环境初始化（默认）

预计：0.5 天

- 开通云开发环境，配置 `VITE_CLOUD_ENV`
- 创建云函数骨架（login / assessment / experience / upload）
- 集合权限与 seed 导入

备选：Express 初始化（env / routes / error middleware / mysql connection）。

## T051 数据 seed / 集合初始化

预计：0.5–1 天

默认：把 `05_Mock数据与业务规则.md` 的 JSON 导入云数据库集合。

备选：MySQL migration + seed（按 04 第 6 节生产结构参考）。

## T052 用户 API

预计：0.5–1 天

## T053 评估 API + scoring service

预计：1 天

## T054 课程 API

预计：0.5 天

## T055 体验与记录 API

预计：1 天

## T056 上传 API

预计：0.5–1 天

如时间不足可 P1。

## T057 微信真实登录

预计：0.5–1 天 + 配置时间

依赖：

- appid
- 云开发环境（或 server env）
- 微信配置

---

# Phase 6 联调

## T060 API Adapter 切换

预计：0.5 天

从 Mock 切 Real API，页面不改业务代码。

## T061 全链路联调

预计：1 天

路径：

Home → Login → Profile → Assessment → Report → Explore → Course → Task → Imprint → Records

---

# Phase 7 展示优化

## T070 首页微调
## T071 状态报告微调
## T072 五感花园微调
## T073 自然印记动画
## T074 空状态/错误状态

合计：2–3 天。

视觉优化按答辩分级（`00_项目总纲与定位.md` 3.3）执行：

- 优先 S 级：首页、状态报告、五感花园、自然印记
- 其次 A 级：体验详情、记录、我的
- 最后 C 级：社区占位（只需与全局风格一致）

---

# Phase 8 Demo Freeze

## T080 冻结功能

答辩前 3–5 天禁止新增 P2。

只允许：

- Bug
- 文案
- UI 小修
- 数据

## T081 Demo 重置

开发环境建议提供“重置 Demo”。

用于恢复默认用户、记录、推荐。

不要在正式 UI 明显展示。

---

# 两人协作

## 开发者 A：体验链 A

- Home
- Auth
- Profile
- Explore
- Garden
- UI components

## 开发者 B：逻辑链 B

- Assessment
- Course data
- Experience
- Records
- Server/API

不是硬边界。

重点视觉页 P06/P08/P11 两人共同 Review。

---

# Git

使用：

- main
- feat/home
- feat/assessment
- feat/garden
- feat/experience

短分支，不长期分叉。

---

# Codex 标准任务 Prompt

```text
你正在继续"园艺疗法微信小程序"项目。

先阅读：
- 00_项目总纲与定位.md
- 02_UI设计规范.md
- 03_页面开发手册.md 中【当前页面】
- 04_技术架构与数据设计.md 中相关接口

当前任务：
[任务名称]

目标：
[一句话]

要求：
1. 不扩展需求
2. 优先复用现有组件
3. 保持 uni-app + Vue3
4. 保持视觉 Token
5. 处理 loading / empty / error
6. 不破坏其他页面
7. 完成后检查编译错误

交付：
- 修改文件列表
- 核心实现说明
- 手动验收步骤
- 未解决问题
```

---

# Codex Review Prompt

```text
请作为资深代码 Reviewer 检查刚完成的功能。
不要重写整个项目。

重点检查：
1. 是否违反 MVP 边界
2. 是否重复组件
3. 是否页面写死数据
4. 是否泄露 secret
5. 是否有重复提交
6. 是否移动端溢出
7. 是否错误使用医学诊断措辞
8. 是否 Mock 与 Real API 耦合
9. 是否有不必要复杂度

先输出问题，再给最小修复方案。
```

---

# 推荐排期

第 1 周：

- Phase 0
- Phase 1
- Phase 2

目标：首页 → 状态报告。

第 2 周：

- Phase 3
- Phase 4

目标：五感 → 自然印记。

第 3 周：

- 数据接入（云开发优先）
- 联调
- UI polish

第 4 周：

风险缓冲：

- 真机
- 微信配置
- 甲方内容替换
- Bug
- 演示准备

只做可演示 Demo 可争取 2–3 周；对外交付建议保留第 4 周。

---

# 里程碑与验收门

| 里程碑 | 内容 | 验收门 |
|---|---|---|
| M1（第 1 周末） | 项目骨架 + 身份链路 + 评估闭环 | 首页 → 状态报告全流程可走通，五 Tab 正常 |
| M2（第 2 周末） | 五感花园 + 体验闭环 + 印记 + 记录 | 多肉种植完整走通，5 个课程可进入详情 |
| M3（第 3 周末） | 数据接入（云开发/云函数，备选后端）+ 联调 + UI polish | Mock 与真实数据可切换，主要接口联调通过 |
| M4（第 4 周 / 答辩前） | 冻结、打磨、演示准备 | 真机完整走 3 遍，演示脚本可用 |

# 风险清单

| 风险 | 影响 | 应对 |
|---|---|---|
| 甲方素材未按时到位 | 课程/音频/文案无法替换 | Mock 先行，替换路径固定（见 08），素材到位即换 |
| 微信配置（appid/域名/审核）延迟 | 无法真机体验版 | 尽早申请 appid；体验版优先于正式发布；Mock 模式兜底 |
| 云开发/后端配置延迟 | 联调/演示受挫 | 全程保持 Mock 可运行；按 04 第 21 节清单推进，云开发优先 |
| 两人进度不一致 | 联调阻塞 | 按模块分工（A/B 链），每日同步，交叉验收，短分支合入 |
| 真机适配问题 | 演示翻车 | 至少双机验收，按 07 真机检查清单逐项过 |
| 需求蔓延 | 范围失控 | 一切新增需求先过 00 决策规则与 09 决策记录，冻结期只修 Bug |

# 每日/每周协作约定

- 每完成一个任务：运行 → 自测 → 提交 → 通知对方交叉验收
- 每周一次 10 分钟同步：进度、阻塞、待裁决事项（记录到 09）
- 分支策略：`main` + 短分支（feat/home、feat/assessment、feat/garden、feat/experience），不长期分叉


---

# 【07_验收测试与答辩演示.md】

# 07 验收测试与演示脚本

> 需求与验收的对应关系以 `01_产品需求规格说明书.md` 第 11 节为准，本节提供可执行的验收清单。

## 1. 测试策略

本项目规模小、用户少、Demo 为主，不设传统独立 QA 岗位。

采用：

**开发者自测 + 交叉验收 + 真机演示路径演练。**

每个模块完成后由另一名开发者至少走一次主路径。

---

# 2. P0 功能验收

## 首页

- [ ] 未登录可访问
- [ ] 开始体验可点击
- [ ] 页面加载无明显闪烁
- [ ] 首屏标题不被状态栏遮挡
- [ ] TabBar 正常

## 登录

- [ ] Mock 登录可用
- [ ] 真实登录失败有友好提示
- [ ] 不出现 appSecret
- [ ] 重复进入不会重复创建用户

## 自然档案

- [ ] 必填校验
- [ ] 多选目标可切换
- [ ] 保存后重新进入显示数据
- [ ] 页面无后台表单感

## 评估

- [ ] 共 10 题
- [ ] 未选择不能下一题
- [ ] 可以回上一题
- [ ] 回退答案保留
- [ ] 提交只一次
- [ ] 报告分数 0–100
- [ ] 报告无诊断措辞

## 五感

- [ ] 五类齐全
- [ ] 五个活动都可点击
- [ ] 多肉详情最完整
- [ ] 无素材时不显示坏图

## 体验任务

- [ ] 步骤可切换
- [ ] 进度正确
- [ ] 感受可输入
- [ ] 心情可选择
- [ ] 上传失败不丢文字
- [ ] 完成进入自然印记
- [ ] 重复点击不创建两条

## 自然印记

- [ ] 来自刚完成记录
- [ ] 成长数据正确
- [ ] 查看记录可跳
- [ ] 继续探索可跳

## 记录

- [ ] 新记录排第一
- [ ] 空状态正常
- [ ] 历史记录可进详情
- [ ] 显示我的自然旅程
- [ ] 自然印记完成后可由 P11 进入本页

## 我的

- [ ] 显示用户信息
- [ ] 显示成长身份
- [ ] 显示最近评估
- [ ] 我的记录入口可跳转 P12
- [ ] 关于园艺疗法可查看
- [ ] 隐私说明可查看

## 社区

- [ ] 点击不报错
- [ ] 标题为「自然分享空间」，文案为「自然分享空间，未来开放」
- [ ] 不出现假功能按钮
- [ ] 不出现发帖、评论、点赞、私信、关注入口

---

# 3. 真机视觉检查

至少：

- 一台较小屏幕
- 一台普通屏幕

检查：

- [ ] 状态栏/刘海
- [ ] 底部 Home Indicator
- [ ] 文字换行
- [ ] 图片裁切
- [ ] 输入键盘遮挡
- [ ] textarea
- [ ] 页面滚动
- [ ] TabBar
- [ ] 返回行为

---

# 4. 网络异常

Real API 模式测试：

- [ ] 无网络
- [ ] 500
- [ ] 超时
- [ ] 图片上传失败

原则：

用户只看到可理解中文提示。

---

# 5. 答辩核心演示路径（唯一流程）

```text
扫码进入
↓
首页
↓
开始体验
↓
自然档案
↓
状态探索
↓
状态报告
↓
五感花园
↓
多肉种植体验
↓
体验任务
↓
自然印记
↓
记录
↓
我的
```

其他功能不能阻塞该流程。演示使用固定 Mock 数据也必须保证刚完成的自然印记能出现在记录中，且能从记录进入我的。

## 5.1 3–5 分钟讲解脚本

### 0:00–0:30 首页

讲：

> 这是我们的园艺疗法数字化体验小程序。我们希望用户不是进入一个医疗系统，而是进入一个自然体验空间。

点击开始体验。

### 0:30–1:00 自然档案

快速选择：

- 年龄段
- 初次接触
- 放松心情 + 亲近自然

讲：

> 用户会建立一份简单的自然体验档案。

### 1:00–1:45 状态探索

现场快速点击。

如需要，可做 dev-only 快速填写模式。

讲：

> 正式研究可以接入规范量表；当前展示版用轻量问题演示“评估—反馈”的数字化流程。

### 1:45–2:15 状态报告

重点停留。

讲：

> 报告把情绪、压力和自然连接三个维度转成用户容易理解的反馈，并推荐自然体验。它不是医学诊断。

若老师问"这个指数依据是什么"：

> 当前版本用于展示数字化反馈流程，状态体验概览分是轻量自定义的产品体验反馈，不属于医学诊断，也不等同于 PANAS、PSS-10、NR-6 等正式量表。

### 2:15–3:00 五感花园

展示视觉、触觉、嗅觉、味觉、听觉。

点击多肉种植。

讲：

> 甲方原方案强调五感园艺，我们把研究框架转化成用户可直接理解的五感花园。

### 3:00–4:00 多肉体验

快速展示：

- 材料
- 步骤
- 正念提示

进入任务，选平静，写一句感受，完成。

### 4:00–4:30 自然印记

重点停留。

讲：

> 完成后不是简单打卡，而是生成自然印记，把体验、情绪和成长轨迹沉淀下来。

### 4:30–5:00 记录/我的

记录页展示时间轴。

进入我的，展示用户信息、成长身份、最近评估及记录入口，完成产品闭环。社区占位可在问答环节补充展示，不占用唯一核心流程时间。

---

# 6. Demo 数据准备

答辩前：

- 按答辩视觉分级优先打磨 S 级页面：首页、状态报告、五感花园、自然印记（见 00 3.3）
- 默认头像正常
- 五个课程有封面
- 多肉步骤图片正常
- 评估能稳定得到好看的中等结果
- 自然印记至少有一条历史示例
- 隐藏所有“待甲方确认”调试字样

---

# 7. 答辩前冻结

T-5 天：

停止增加新功能。

T-3 天：

只修：

- 页面错位
- 路由
- 崩溃
- 内容错误

T-1 天：

- 真机完整走 3 遍
- 备用手机验证
- 保留 Mock 模式作为服务器故障兜底
- 不升级依赖

---

# 8. Done Definition

任务只有满足以下才算 Done：

- 可以运行
- 无明显 console error
- 符合 PRD
- 符合 UI Token
- 关键状态完成
- 另一名开发者走过一次
- commit 信息清晰


---

# 【08_甲方素材清单与内容替换表.md】

# 08 甲方素材清单与内容替换表

> 本文档用于：1）向甲方/内容负责人明确需要提供的素材；2）开发期素材未到位时，按统一替换路径使用 Mock。素材状态以实际交付为准，收到即替换，无需改页面结构。

## 1. 替换总原则

- 不要在 Vue 页面直接修改大型业务文案
- 课程 → mock course config / DB seed
- 评估题 → assessment seed
- 报告与成长文案 → 内容配置
- 图片/音频/视频 → 静态资源映射
- 安全提示、花草茶可食用信息、过敏禁忌 → 必须甲方专业人员确认后才能替换

## 2. 素材清单

优先级：P0 = 影响核心演示，答辩前必须到位；P1 = 提升完成度，尽量到位；P2 = 远期。

| 编号 | 素材类别 | 用途/页面 | 当前状态 | 替换位置 | 优先级 | 备注 |
|---|---|---|---|---|---|---|
| M01 | 5 个课程的基础文案（标题/副标题/介绍） | P08/P09 五感花园、体验详情 | Mock 示例可用 | 课程配置/seed | P0 | 植物拓印、多肉种植、香草香囊、花草茶、自然声音 |
| M02 | 每个课程的材料清单 | P09 体验详情 | Mock 示例 | course_materials | P0 | 含数量/规格说明 |
| M03 | 每个课程的步骤（标题+说明） | P10 体验任务 | Mock 示例 | course_steps | P0 | 步骤数建议 4–6 步 |
| M04 | 每个课程的安全提示/注意事项 | P09 体验详情 | Mock 占位，需专业确认 | course_safety_tips | P0 | 含植物过敏、材料禁忌 |
| M05 | 每个课程的正念提示文案 | P09/P10 | Mock 示例 | course.mindfulness_prompt / course_steps.mindfulness_tip | P0 | |
| M06 | 课程封面图（5 张） | P08/P09 卡片、Hero | 无（需提供或使用占位插画） | static/images/mock 或对象存储 | P0 | 建议自然插画/实拍，统一风格 |
| M07 | 步骤图（每课程 4–6 张，可缺省） | P10 体验任务 | 无 | course_steps.image_url | P1 | 缺省时显示插画占位 |
| M08 | 短视频（每课程 0–1 个） | P09 体验详情 | 无（有 videoUrl 才显示播放器） | course_steps.video_url / course.video | P1 | |
| M09 | 正念音频（3–5 分钟自然正念） | P10 正念环节（P1） | 无 | 静态音频资源 | P1 | 至少 1 段通用音频 |
| M10 | 评估 10 题文案与维度 | P05 状态探索 | Mock 可用 | assessment seed | P0 | 如需保留当前展示型题目可不动 |
| M11 | 状态报告解释文案（3 维度 × 3 档） | P06 状态报告 | Mock 模板 | 内容配置 | P0 | 见 `05_Mock数据与业务规则.md` 第 8 节 |
| M12 | 成长等级文案（6 档） | P11/P12/P13 | Mock 可用 | 内容配置 | P0 | 等待启程 → 自然同行者 |
| M13 | 首页品牌文案与三个价值点 | P01 首页 | 已有草案 | 页面内容 | P0 | 主标题/副标题已定：园艺疗法 / 连接自然，疗愈身心 |
| M14 | 关于园艺疗法、隐私说明文案 | P13 我的 | 需撰写 | 页面内容 | P1 | 需避免医疗断言 |
| M15 | 品牌元素（名称、Logo、图标集） | 全局 | 部分 Mock | static 资源 | P1 | 图标建议统一线性风格 |
| M16 | 知情同意/监护说明文本 | 新增说明页（P1 建议） | 无 | 页面内容 | P1 | 若做该页则必须甲方提供文本 |
| M17 | 正式量表（PANAS/PSS-10/NR-6/uMARS） | v2.0 科研版 | 无 | assessment seed | P2 | 本期不做 |
| M18 | 社区内容与运营规则 | P14 社区（远期） | 占位文案已定：自然分享空间 | 远期 | P2 | 本期只做占位页，正式社区远期 |
| M19 | 花草茶可食用性/冲泡方式确认 | P09 花草茶体验 | Mock 占位，需专业确认 | course 配置 | P0 | 涉及安全，禁止开发人员自行定稿 |
| M20 | 植物材料过敏与禁忌总清单 | P09 安全提示 | Mock 占位，需专业确认 | course_safety_tips | P0 | 涉及安全，同上 |

## 3. 素材交付格式建议

- 课程类：建议按 `05_Mock数据与业务规则.md` 第 5 节的结构提供（每个课程一个 JSON/表格即可），由开发人员落库或替换 mock 配置
- 图片/音频/视频：统一命名（如 `course-2-step-1.png`），放到约定的静态资源目录，避免散落
- 文案类：提供 Word/表格即可，标注页面位置

## 4. 甲方对接节奏建议

- 立项后第一周：先要 M01–M06（课程文案 + 封面），保证第二周五感页面可用真实内容
- 答辩前 1 周：催 M09（正念音频）与安全类确认（M04/M19/M20）
- 每次收到素材：在本文档更新状态，并在 `09_决策记录与开放问题.md` 记录

## 5. 内容免责边界

- 开发团队不自行撰写专业结论（评估解释、正念引导、安全提示、禁忌、可食用性）
- 所有 Mock 文案仅作演示占位，正式交付前必须由甲方确认


---

# 【09_决策记录与开放问题.md】

# 09 决策记录与开放问题

> 本项目所有重要裁决统一记录于此，避免"当时说好了"找不到出处。每条记录：编号、日期、决策、理由、影响。未裁决事项列入「开放问题」，由项目负责人（用户）裁决后回填。

## 1. 已确认决策

| 编号 | 日期 | 决策 | 理由 | 影响 |
|---|---|---|---|---|
| D01 | 2026-08-09 | 当前交付定位为"高完成度展示型 MVP"，不是完整科研平台 | 实际场景是护理学院大创项目展示：扫码体验、答辩演示、体验人数 < 10 | 范围收敛到 14 个页面与 5 个示例体验；远期功能进版本规划 |
| D02 | 2026-08-09 | 10 题状态评估为展示型评估，不得宣称为 PANAS/PSS-10/NR-6，不输出医学诊断 | 避免专业合规风险 | UI、代码、答辩话术均使用"轻量状态探索/体验反馈"表述 |
| D03 | 2026-08-09 | 五感课程固定 5 个代表体验 | 与甲方五感框架一致，且视觉/流程可控制 | 视觉、触觉、嗅觉、味觉、听觉各 1 个 |
| D04 | 2026-08-09 | 无评估/无推荐时默认推荐多肉种植 | 多肉种植当前视觉与流程最完整 | 推荐规则见 01 第 7 节 |
| D05 | 2026-08-09 | 成长只做轻等级，不做积分/排行 | 避免竞争压力与复杂度 | 6 档等级，数据实时聚合 |
| D06 | 2026-08-09 | 甲方素材未到位时统一使用 Mock，替换路径固定 | 不阻塞开发 | 见 08 素材清单 |
| D07 | 2026-08-09 | 社区、教练私聊、智能客服、AI、推荐算法本期不做 | 属于非目标，复杂度高 | 社区仅占位页；远期 v2.0 |
| D08 | 2026-08-09 | 技术栈：uni-app + Vue3 + Pinia + SCSS；后端 Node.js + Express + MySQL | 原 PRD 既定，团队学习成本低 | 见 04；是否考虑微信云开发列为开放问题 Q2 |
| D09 | 2026-08-09 | P13 我的、P14 社区占位页面可用性列为 P0（五 Tab 必须全通） | 修正 01 与 00 的优先级不一致；Tab 缺失会破坏导航完整性 | "我的"丰富内容、社区功能仍为 P1 |
| D10 | 2026-08-09 | 不做后台管理 UI，内容通过 seed/数据库维护 | 人数少、展示为主，后台投入产出低 | 见 04 第 18 节 |
| D11 | 2026-08-09 | 体验反馈字段：心情单选 + 感受文本 + 可选 0–1 张图片 | 保持轻量，不做复杂表单 | 见 P10 |
| D12 | 2026-08-09 | 技术方案默认微信云开发（云数据库/云函数/云存储），Node.js + Express + MySQL 降为备选（科研化时迁移） | 体验人数 < 10、展示为主、两人开发；免部署/域名/备案；API 契约与备选方案一致 | 替代 D08 的后端部分；见 04 |
| D13 | 2026-08-09 | MVP 分为 P0-A 核心闭环（P01–P11）与 P0-B 展示增强（P12–P14），P0-A 硬性完成 | 两人 2–3 周极限交付时优先保证答辩主路径 | 历史决策，MVP 分级由 D20 替代 |
| D14 | 2026-08-09 | 「自然平衡指数」改名为 UI 展示名「本次体验状态概览」，内部字段沿用旧名 | 避免被问"指数依据"时无解释空间 | 历史决策，命名由 D21 替代 |
| D15 | 2026-08-09 | 社区占位页文案改为「自然分享空间」，不写"功能正在建设中"，无任何假按钮 | 避免半成品观感 | 见 01/03/07 |
| D16 | 2026-08-09 | 新增 Codex 强制执行顺序 Step 0–6（初始化→设计系统→组件→Mock→页面→视觉→数据接入） | 防止页面先于组件/数据导致返工 | 见 06 |
| D17 | 2026-08-09 | 数据库实现降级：MVP 用 JSON 配置 + 云数据库简化集合，SQL 表结构标注为生产参考 | 10 人展示项目不建完整关系库 | 见 04 第 6 节 |
| D18 | 2026-08-09 | 答辩视觉分级：S 级（首页/状态报告/五感花园/自然印记）、A 级（体验详情/成长记录）、B 级（我的/社区） | 明确打磨优先级 | 历史决策，页面等级由 D22 调整 |
| D19 | 2026-08-09 | 命名统一：用户侧"状态探索/本次体验状态概览"，开发侧 assessment/旧综合字段；禁止混用"考试/问卷/自然平衡指数" | 减少 Codex 理解偏差 | 历史决策，命名由 D21 替代 |
| D20 | 2026-08-09 | MVP 重新分为 P0-A 核心闭环、P0-B 记录+我的基础版、P0-C 社区占位；三层均须交付 | 自然印记需要记录承接，五 Tab 需要我的补全；社区仅表达未来方向 | P12/P13 不得标为可选；P14 不得实现社交功能 |
| D21 | 2026-08-09 | 综合展示值 UI 统一为「状态体验概览分」，代码/API 字段统一为 `experienceOverviewScore` | 旧字段带有“平衡指数”语义，容易被理解为医学指标 | 旧数据仅允许在 Adapter 层兼容；新代码不得继续产生旧字段 |
| D22 | 2026-08-09 | 我的从 B 级提升为 A 级产品完整性页面；社区单列 C 级占位 | “我的”进入唯一演示路径，不能留下半成品观感 | Phase 7 需打磨记录与我的，社区只保证一致性 |
| D23 | 2026-08-09 | MVP 默认开发模式为 Mock 优先、页面先完成、云开发后接入 | appid、云环境和甲方素材均可能延迟 | 用户/评估题/课程/记录均先提供 Mock，核心路径不等待后端 |
| D24 | 2026-08-09 | 答辩只使用“扫码→首页→开始体验→自然档案→状态探索→状态报告→五感花园→多肉→任务→印记→记录→我的”一条固定路径 | 降低现场操作与讲解风险 | 其他页面或接口异常不得阻塞该路径 |

## 2. 开放问题（待项目负责人裁决）

| 编号 | 问题 | 建议方案 | 状态 |
|---|---|---|---|
| Q1 | 是否有确定的答辩/演示日期？ | 若有，按日期倒排 06 里程碑；若无，沿用相对周次计划 | 待裁决 |
| Q2 | 后端是否保持 Node.js + Express + MySQL，还是改用微信云开发（免部署、免域名、适合小团队）？ | 已裁决：默认微信云开发，Node/MySQL 为备选（见 D12） | 已裁决 |
| Q3 | 是否在 P1 增加"知情同意说明页"与"正念音频入口"两个低成本展示亮点？ | 建议加：与甲方流程呼应，答辩加分；文本由甲方提供 | 待裁决 |
| Q4 | 是否需要"正式量表展示入口"（仅展示 PANAS/PSS-10 说明，不做真答题）？ | 不建议本期做，避免被误认为正式测评 | 待裁决 |
| Q5 | 甲方素材交付时间如何？ | 以 08 清单 P0 项为第一批催收 | 待裁决 |
| Q6 | 社区占位页是否保留"同步社区"的任何 UI 提示？ | 已裁决：不显示任何假按钮，文案用"自然分享空间"（见 D15） | 已裁决 |
| Q7 | courses 表的 benefits / media 字段如何落地（本期是否使用）？ | 已裁决：本期不入关系库，作为课程 JSON 可选字段（见 D17） | 已裁决 |

## 3. 裁决记录区

> 项目负责人裁决后，在此追加记录（编号、日期、结论、影响文档），并同步更新相关文档。

## 4. v1.1 修订记录

2026-08-09 依据评审意见完成 v1.1 修订，对应关系：

1. README 章节数表述修正（README + 00–09 共 11 个章节）
2. 技术方案改轻：微信云开发默认（D12）
3. MVP 分层 P0-A / P0-B（D13）
4. 指数命名调整（D14）
5. 社区文案调整（D15）
6. Codex 执行顺序（D16）
7. 数据库降级为生产参考（D17）
8. 答辩视觉分级（D18）
9. 文件名与命名统一（D19、PRD合订版）
10. 新增 references/UI页面映射表.md

## v1.2 Review结果

### 5.1 当前 PRD 仍存在的问题

1. **专业内容仍是占位内容。** 五个体验的流程结构已可开发，但多肉以外的步骤文案、安全提示、花草茶可食用边界、正念文案仍需甲方确认；开发只能做可替换内容，不应自行给出疗效结论。
2. **P13/P14 缺少专属 UI 参考图。** 这不再构成“不做我的”的理由；开发应依照统一 Token、卡片体系和已有页面气质完成基础版，后续参考图只用于微调。
3. **答辩日期、appid 与云环境尚未在文档中落定。** 开发计划目前只能使用相对周次，体验版配置必须尽早验证。
4. **评分公式是展示性产品规则，不是经研究验证的量表。** 即使改名后仍需在报告页和答辩话术中保留非诊断说明，不能用视觉包装暗示科学效度。
5. **“关于园艺疗法”和隐私说明缺少最终甲方文案。** 页面和路由必须先做，内容可使用明确标注的审阅版 Mock，交付前替换。

### 5.2 开发风险

1. **最大风险是 UI 图集逐页照搬造成风格拼接。** 必须先完成 Token 与公共卡片组件，再将参考图映射到统一体系；不得每页单独生成样式。
2. **第二风险是为双后端投入时间。** 本期只实现 Mock Adapter + 微信云开发；若同时建设 Express/MySQL，会挤占记录、我的和真机打磨时间。
3. **第三风险是自然印记与记录数据断链。** P10 完成时必须生成唯一记录 ID，P11、P12 使用同一对象；否则答辩时“刚完成却找不到记录”。
4. **第四风险是登录或网络阻塞首次体验。** 登录失败必须能提示并回退到演示用 Mock 身份；核心路径不能因云函数冷启动或配置错误中断。
5. **第五风险是微信小程序 Tab 路由限制与返回栈处理。** 五个 Tab 应在项目骨架期建立并真机验证，非 Tab 页通过明确 CTA 回到探索、记录或我的。
6. **第六风险是旧字段兼容。** 若开发包已有 `balanceIndex` 数据，只在数据适配层映射到 `experienceOverviewScore`，不得让两种字段继续扩散到页面和接口。

### 5.3 可以暂时不做的功能

- 社区的发帖、评论、点赞、私信、关注及内容流。
- 教练一对一、实时聊天、AI 客服、风险关键词识别。
- 正式 PANAS/PSS-10/NR-6/uMARS 量表链路及研究级报告。
- 五周干预调度、受试者分组、材料包物流、后台管理与科研数据看板。
- P1 的植物生长动画、完整图片上传、3 分钟倒计时、分享卡片、复杂过渡、数据导出、知情同意独立页和正念音频。
- Node.js + Express + MySQL 扩展后端。

> “可以暂时不做”不包含 P12 记录、P13 我的或 P14 社区占位本身。

### 5.4 必须保护的核心体验

1. 用户扫码后 10 秒内理解这是园艺疗法数字化体验，而不是医疗系统。
2. 状态探索必须稳定完成 10 题，输出 emotion、stress、nature 与非医学化的状态体验概览分。
3. 状态报告必须自然地引导到五感花园，不出现诊断、风险评级或正式量表暗示。
4. 五感花园必须展示五类体验，多肉种植必须从详情、任务、反馈完整走到自然印记。
5. 新自然印记必须被记录页承接，并可从我的再次进入记录。
6. 全流程必须在 Mock 模式、真机和无真实后端条件下可稳定演示。
7. 首页、状态报告、五感花园、自然印记的视觉完成度不得被非核心功能挤占。

### 5.5 推荐开发顺序

1. 建立 uni-app/Vue3 项目骨架、五 Tab、路由与 Mock/Real Adapter。
2. 固化全局色板、字体、间距、卡片、按钮、空状态和插画使用规则。
3. 准备用户、10 道评估题、5 个课程、示例记录 Mock，先验证数据契约。
4. 完成首页 → 开启体验 → 自然档案。
5. 完成状态探索 → 评分 service → 状态报告，统一 `experienceOverviewScore`。
6. 完成探索主页 → 五感花园 → 多肉详情。
7. 完成体验任务 → 自然印记，并确保只生成一条可追踪记录。
8. 完成 P12 记录与 P13 我的基础版，走通印记 → 记录 → 我的。
9. 完成 P14 社区占位，不增加任何社交交互。
10. 接入微信云开发的登录、评估、体验记录与必要云存储；Mock 继续作为答辩兜底。
11. 按 S/A/C 视觉级别打磨并进行双机、断网、重复提交、路由返回测试。
12. 功能冻结，按唯一答辩路径连续演练至少 3 次。


---

# 【附录 references/UI页面映射表.md】

# references/UI 页面映射表

> 本表把页面与视觉参考图一一对应，供前端开发者开发页面时对照。参考图表达**视觉气质与布局方向**，不是逐像素设计稿，也不代表最终专业文案。

## 1. 页面 → 参考图映射

| 页面 | 参考图 | 状态 | 说明 |
|---|---|---|---|
| P01 首页 | `01_home.png` | 已有 | 首页 Hero/价值卡布局参考 |
| P02 开启体验 | `02_login.png` | 已有 | 登录/开启旅程视觉参考 |
| P03 自然档案 + P04 评估介绍 | `03_profile_assessment_intro.png` | 已有 | 档案表单 + 评估介绍组合参考 |
| P05 状态探索 + P06 状态报告 | `05_assessment_report.png` | 已有 | 答题与报告页参考 |
| P07 探索主页 | `07_explore.png` | 已有 | 探索大厅布局参考 |
| P08 五感花园 | `08_five_senses.png` | 已有 | 五感卡片区参考 |
| P09 自然体验详情 | `09_experience_detail.png` | 已有 | 详情页结构参考 |
| P10 体验任务 | `10_task.png` | 已有 | 步骤引导 + 反馈参考 |
| P11 自然印记 | `11_imprint_a.png` / `11_imprint_b.png` | 已有 | 印记页两种版式参考 |
| P12 成长记录 | 无专属图 | 待补充 | 可按 07_explore/11_imprint_b 的气场 + UI 规范实现 |
| P13 我的 | 无专属图 | 待补充 | 按 01 P13 结构与 UI 规范实现，不用商城个人中心模板 |
| P14 社区占位（自然分享空间） | 无专属图 | 待补充 | 可参考 `00_client_reference.png` 的社区/分享氛围 |
| 社区未来页（远期） | `00_client_reference.png` | 参考 | 甲方旧项目参考，仅作氛围参考 |

## 2. 图例说明

- 原参考图编号中不存在 04/06（如 `04_garden.png`、`06_profile.png`），若后续补充新图，请按页面编号命名（如 `12_records.png`、`13_mine.png`、`14_community.png`）放入本目录。
- `00_client_reference.png` 是甲方旧项目参考（宽图），用于理解整体产品气质与社区/分享氛围，不逐像素复刻。

## 3. 补充规则

1. 甲方或团队成员提供新参考图后，放入本目录并在此表新增一行；
2. 同步更新 `02_UI设计规范.md` 第 17 节的映射说明；
3. 若参考图与 PRD 文字冲突，以 PRD 结构为准、参考图仅作视觉参考。

## 4. 待补充清单（当前缺口）

- P12 成长记录参考图
- P13 我的参考图
- P14 社区占位页参考图

> 缺口不影响开发：以上页面按 `01_产品需求规格说明书.md` 页面定义 + `02_UI设计规范.md` 实现即可；若用户有此前讨论的界面图，放进本目录后更新本表。


