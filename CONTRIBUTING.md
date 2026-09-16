# 协作与分支规范

## 第八阶段适用说明

2026-09-14 起按 [v1.3 PRD](docs/product/园艺疗法小程序_PRD_v1.3_社区与后台增量修订.md)、[云端契约](docs/09_云端数据与权限契约.md) 和 [统一任务单](docs/11_第八阶段多人社区与后台任务单.md) 执行。

主对话统筹三个交付面：小程序、云服务、管理后台。A 主责页面及后台界面，B 主责云服务、身份与数据，双方交叉评审；具体以任务单为准。公共契约、路由和共享文件由每个任务确定单一编辑者，禁止双方各自发明临时字段。以下旧分工保留作历史归属参考。

## 长期分支

- `main`：唯一稳定分支，始终保持可运行。
- `feat/experience-ui`：开发者 A，负责页面、组件与视觉体验链。
- `feat/assessment-data`：开发者 B，负责 Mock、状态、评估与记录逻辑链。

## 分工

### 开发者 A

- 全局 UI Token 与公共组件
- P01、P02、P03
- P07、P08、P09
- P11 视觉实现
- P13
- 真机视觉适配

### 开发者 B

- Mock Adapter 与 Pinia Store
- P04、P05、P06
- 评分 Service
- P10、P12
- P14 静态占位
- 页面稳定后的微信云开发接入

## 工作方式

1. 从对应协作分支开始开发。
2. 一个任务对应一个明确变更集。
3. 提交前运行并完成自测。
4. 推送分支后，由另一位开发者按 PRD 路径走查。
5. 验收通过后合并到 `main`。
6. 合并后再次验证当前答辩主链。

如需修改公共路由、TabBar、UI Token 或 Mock 数据契约，先同步另一位开发者，不得各自复制临时字段。

## 提交格式

```text
feat(home): implement P01 hero and start CTA
feat(assessment): add ten-question mock flow
feat(records): connect imprint record to history list
fix(router): correct tab navigation after assessment
docs(plan): clarify week-one acceptance criteria
```

## 合并检查

- 符合 PRD v1.3 新增边界及 v1.2 未变更规则。
- 本阶段允许约定的管理后台、社区、上传及必要真实身份；不扩展私聊、关注或商业功能。
- 使用统一组件与数据契约。
- 没有明显控制台错误。
- 提供可复现的自测路径。
- `main` 仍可运行。
- 不提交密钥、真实用户数据和本地私有配置。
