# E9 A 侧 Handoff：云端页面与后台

## 开工门槛

等待主对话发布 E9-M01 的 `main` 基线哈希；从该基线更新 `feat/experience-ui`。不得从当前旧分支直接追加。

本机新建且不提交 `.env.local`：

```text
VITE_DATA_MODE=cloud
VITE_CLOUD_ENV=cloud1-d4gdq2m679f0ef9ac
VITE_WECHAT_APP_ID=wxd5240621858fb1b8
VITE_RESET_DEMO_ON_LAUNCH=false
```

## 任务

### E9-A01

- 构建云模式小程序和后台。
- 检查首次、待批准、启用、禁发、停用、弱网、上传失败、待审、驳回和撤回状态。
- 不允许本地 Mock 掩盖云端失败，不硬编码管理员账号或密码。

### E9-A02（等待 B02）

- 真实管理员登录。
- 验证课程草稿/发布/更新/下架、成员管理、帖子/评论审核、官方帖子/精选/评论、角色和审计。
- 后台发布到受控 HTTPS 地址，密码仅由负责人输入和保管。

### E9-A03（等待 B02）

- 真机检查社区双列布局、图片比例/失败兜底、日记、体验记录同步、点赞评论状态、官方标识、安全区、相机相册与刷新恢复。
- 完整复核原 P01→P13。

## 边界

不得修改云身份、数据库结构、权限规则、课程版本、点赞唯一性、发布幂等和评估算法。服务端问题只报告复现，不复制临时后端逻辑。公共文件先报主对话。

## 提交前

```powershell
corepack pnpm install --offline
corepack pnpm peers check
corepack pnpm check:mock
corepack pnpm check:assessment
corepack pnpm check:experience
corepack pnpm check:completeness
corepack pnpm check:community
corepack pnpm build:mp-weixin:cloud
corepack pnpm build:admin
git diff --check
```

推送 `feat/experience-ui`，报告任务 ID、哈希、文件、自动/真机结果、截图现象、未验证项和需要 B 配合事项；不要自行合入 `main`。
