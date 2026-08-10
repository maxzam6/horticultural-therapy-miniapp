# 公共组件 API

本目录组件只负责通用表现和基础交互，不包含评估、课程、记录或登录业务逻辑。

## AppPageShell

| Prop | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `eyebrow` | String | `园艺疗法` | 页面眉题 |
| `title` | String | 必填 | 页面标题 |
| `description` | String | 空 | 页面说明 |
| `status` | String | `页面骨架已就绪` | 当前骨架状态文案 |
| `buttonLabel` | String | 空 | 主按钮文案；为空时不展示 |
| `customNavigation` | Boolean | `false` | 是否为自定义导航页增加状态栏安全区 |

事件：`primary`。

## AppButton

| Prop | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `variant` | `primary \| secondary` | `primary` | 按钮样式 |
| `disabled` | Boolean | `false` | 禁用状态 |
| `loading` | Boolean | `false` | 加载状态，同时禁止重复点击 |

事件：`click`。按钮文案通过默认 Slot 传入。

## AppCard

| Prop | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `interactive` | Boolean | `false` | 是否启用点击事件和按压反馈 |
| `padding` | `normal \| compact \| none` | `normal` | 卡片内边距 |

事件：`click`。只有 `interactive=true` 时触发。

## AppSectionHeader

| Prop | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `title` | String | 必填 | 区块标题 |
| `description` | String | 空 | 区块说明 |
| `actionLabel` | String | 空 | 右侧操作文案；为空时不展示 |

事件：`action`。

## AppStateView

| Prop | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `state` | `loading \| empty \| error` | 必填 | 状态类型 |
| `title` | String | 状态默认文案 | 自定义标题 |
| `description` | String | 状态默认文案 | 自定义说明 |
| `actionLabel` | String | 空 | 重试按钮文案；为空时不展示 |

事件：`retry`。

## AppProgress

| Prop | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `value` | Number | `0` | 进度值，组件自动限制在 0–100 |
| `label` | String | 空 | 进度说明 |
| `showValue` | Boolean | `true` | 是否显示百分比 |

该组件只展示进度，不计算答题、任务或成长业务进度。

