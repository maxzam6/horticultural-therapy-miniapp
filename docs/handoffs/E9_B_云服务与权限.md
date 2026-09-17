# E9 B 侧 Handoff：云服务与权限

## 当前恢复点（2026-09-17）

- E9-B01 已完成：指定环境中的 `garden-api` 为 Active，云端下载代码与本地构建产物哈希一致，未部署 `community-server`。
- E9-B02 尚未完成，但人工配置已完成：`garden_state` 已创建；数据库、云存储均设为客户端不可读写；用户名密码登录已开启；负责人已创建管理员账号；seed 已生成并以 Insert 模式导入；`manifest` 与管理员记录可见。
- 不得再次运行导入，不得索取或记录管理员 UID、密码、OPENID。
- B02 下一步只验证：云函数实际调用、管理员身份识别、`admin.me`、课程读取与初始数据闭环。通过前不得开始 B03。

## 开工门槛

从最新 `origin/main` 更新 `feat/assessment-data`。只使用环境 `cloud1-d4gdq2m679f0ef9ac`，不得另建环境。

## 任务

### E9-B01

- 验证 `corepack pnpm build:mp-weixin:cloud`。
- 确认产物 `project.config.json` 有 `cloudfunctionRoot: "cloudfunctions/"`，开发者工具识别 `cloudfunctions/garden-api`。
- 部署 `garden-api` 及其云端依赖；不部署本地 `community-server`。

### E9-B02

- 创建空集合 `garden_state`。
- 数据库和云存储拒绝客户端直接读写，所有业务访问经过 `garden-api`。
- 配置 CloudBase 后台账号密码登录。负责人亲自创建密码；不得索取或记录。
- 获取认证 UID 后仅在本机环境变量 `GARDEN_ADMIN_UID` 使用。
- `cloud:seed` 只导入空集合，验证初始 UID 是超级管理员。

当前上述配置及首次导入已经完成。接手者不得重建集合或重复导入，只补齐以下证据：

1. 小程序或受控调用能实际调用 `garden-api`，无环境缺失/函数不存在错误。
2. 管理员由 CloudBase 当前登录身份识别，不能由请求参数伪造。
3. `admin.me` 返回管理员身份且不泄露密码、令牌或完整敏感身份信息。
4. 课程读取返回 seed 中的初始课程数据。
5. 非管理员调用管理接口被拒绝；客户端不能绕过云函数直接读写数据库/存储。

### E9-B03

- 验证 OPENID/管理员身份隔离、成员审批与 30 人上限。
- 验证禁发、停用、私密日记/图片越权拒绝。
- 验证记录重复发布幂等、点赞唯一、评论审核与撤回不复活。
- 验证普通成员不能伪造官方或管理员。
- 验证课程更新后旧 Session 使用旧版本，云函数错误不泄露堆栈。

## 边界

不得修改页面视觉、评估算法、P01→P13 业务口径或增加私聊/关注。公共文件先报主对话。不得提交 `.env.local`、密码、密钥、完整 OPENID、完整管理员 UID 或真实用户资料。

## 提交前

```powershell
corepack pnpm install --offline
corepack pnpm peers check
corepack pnpm check:mock
corepack pnpm check:assessment
corepack pnpm check:experience
corepack pnpm check:completeness
corepack pnpm check:community
corepack pnpm check:cloud-repository
corepack pnpm build:mp-weixin:cloud
git diff --check
```

推送 `feat/assessment-data`，报告任务 ID、哈希、文件、云资源实际状态、权限测试、未验证项、复现步骤和需要 A 配合事项；不要自行合入 `main`。
