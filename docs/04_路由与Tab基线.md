# 路由与 Tab 基线

> 状态：T3-A03 冻结版本
>
> 产品依据：PRD v1.2 页面开发手册
> 适用范围：后续所有页面与联调任务

## 1. 页面路由

| ID | 页面 | 路由 | 类型 | 动态参数 |
|---|---|---|---|---|
| P01 | 首页 | `/pages/home/index` | Tab | 无 |
| P02 | 开启体验 | `/pages/auth/index` | 普通页 | 无 |
| P03 | 自然档案 | `/pages/profile/setup` | 普通页 | 无 |
| P04 | 评估介绍 | `/pages/assessment/intro` | 普通页 | 无 |
| P05 | 状态探索 | `/pages/assessment/questions` | 普通页 | 无 |
| P06 | 状态报告 | `/pages/assessment/result` | 普通页 | 后续可由 Store 持有 submission，不在 URL 扩展字段 |
| P07 | 探索主页 | `/pages/explore/index` | Tab | 无 |
| P08 | 五感花园 | `/pages/garden/index` | 普通页 | 无 |
| P09 | 体验详情 | `/pages/course/detail?id=` | 普通页 | `id`：courseId |
| P10 | 体验任务 | `/pages/experience/task?sessionId=` | 普通页 | `sessionId` |
| P11 | 自然印记 | `/pages/imprint/detail?recordId=` | 普通页 | `recordId` |
| P12 | 记录 | `/pages/records/index` | Tab | 无 |
| P13 | 我的 | `/pages/mine/index` | Tab | 无 |
| P14 | 社区占位 | `/pages/community/index` | Tab | 无 |

路由路径不得由页面自行写字符串，统一引用 `src/config/routes.js`。

## 2. Tab 顺序

固定使用原生 TabBar：

1. 首页
2. 探索
3. 记录
4. 社区
5. 我的

本阶段不开发 custom TabBar。允许暂时使用文字 Tab；统一图标在后续视觉打磨任务处理，不阻塞页面开发。

## 3. 导航规则

- 普通页面使用 `uni.navigateTo`。
- Tab 页面使用 `uni.switchTab`。
- 页面统一调用 `src/services/navigation.js` 的 `goTo(url)`，不得在页面重复判断页面类型。
- `switchTab` 不携带查询参数，Tab 页面需要的业务状态由 Store 提供。
- 动态参数使用 `encodeURIComponent` 写入、`decodeURIComponent` 读取。
- P09 → P10 只传 `sessionId`，不再以 `courseId` 替代 Session。
- P10 → P11 只传 `recordId`；P11、P12必须读取同一条 Record。

## 4. 当前核心导航链

```text
P01 首页
→ P02 开启体验
→ P03 自然档案
→ P04 评估介绍
→ P05 状态探索
→ P06 状态报告
→ P07 探索主页（switchTab）
→ P08 五感花园
→ P09 体验详情（id）
→ P10 体验任务（sessionId）
→ P11 自然印记（recordId）
→ P12 记录（switchTab）
→ P13 我的（用户点击原生 Tab）
```

社区不插入答辩核心导航链。

## 5. 安全区规则

- P01 使用自定义导航，通过 `AppPageShell custom-navigation` 增加状态栏安全区。
- P02–P14 默认使用原生导航栏，不重复增加顶部状态栏高度。
- 所有页面根容器复用 `.page-container`，统一处理左右边距与底部安全区。
- Tab 页面继续使用原生 TabBar，不自行计算 TabBar 高度。
- 表单页出现键盘遮挡时，在对应页面任务中处理滚动和输入框定位，不修改全局安全区基线。

## 6. 变更规则

以下变更必须先由项目负责人裁决：

- 增删页面路由。
- 调整五个 Tab 的顺序或名称。
- 将普通页改为 Tab 页。
- 修改 `id`、`sessionId`、`recordId` 参数名称。
- 引入 custom TabBar。
