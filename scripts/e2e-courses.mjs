import { chromium, expect } from "@playwright/test";
const password = process.env.GARDEN_LOCAL_PASSWORD;
if (!password) throw new Error("Set local server password");
const browser = await chromium.launch({ channel: "msedge", headless: true }),
  ctx = await browser.newContext(),
  miniCtx = await browser.newContext({ viewport: { width: 390, height: 844 } }),
  admin = await ctx.newPage(),
  mini = await miniCtx.newPage(),
  errors = [];
for (const p of [admin, mini]) p.on("pageerror", (e) => errors.push(e.message));
const title = `版本回归课程 ${Date.now()}`;
try {
  await admin.goto("http://127.0.0.1:5174");
  await admin.getByLabel("账号", { exact: true }).fill("admin");
  await admin.getByLabel("密码", { exact: true }).fill(password);
  await admin.getByRole("button", { name: "登录", exact: true }).click();
  await admin.getByRole("button", { name: "课程资源", exact: true }).click();
  await admin.getByRole("button", { name: "＋ 新建课程", exact: true }).click();
  await admin.getByLabel("课程名称", { exact: true }).fill(title);
  await admin
    .getByLabel("课程介绍", { exact: true })
    .fill("这是一门用于验证课程版本的测试课程。");
  await admin.getByLabel("材料（每行一项）").fill("小花盆\n土壤");
  await admin.getByLabel("安全事项（每行一项）").fill("操作后洗手");
  await admin.getByRole("button", { name: "＋ 添加步骤", exact: true }).click();
  await admin.locator(".step input:not([type=file])").fill("观察一片叶子");
  await admin.locator(".step textarea").fill("旧版步骤：观察叶片的纹理。");
  await admin
    .locator(".step input[type=file]")
    .setInputFiles("src/static/illustrations/sensory-garden.jpg");
  await expect(admin.locator(".step .thumb")).toBeVisible();
  await admin.getByRole("button", { name: "保存草稿", exact: true }).click();
  await expect(
    admin.getByText("草稿已保存，发布后小程序才会更新"),
  ).toBeVisible();
  await admin
    .getByRole("button", { name: "发布已保存版本", exact: true })
    .click();
  await expect(
    admin
      .locator(".item")
      .filter({ hasText: title })
      .getByText(/已发布/),
  ).toBeVisible();
  await mini.goto("http://127.0.0.1:5173/#/pages/community/index");
  await mini.locator(".identity input").nth(0).fill("member-a");
  await mini.locator(".identity input").nth(1).fill(password);
  await mini.getByText("连接社区 / 刷新成员状态", { exact: true }).click();
  await expect.poll(() => mini.locator(".identity uni-button").count()).toBe(0);
  await mini.goto("http://127.0.0.1:5173/#/pages/garden/index");
  await mini.getByText(title, { exact: true }).click();
  await mini.waitForURL(/course\/detail/);
  await mini.locator(".app-button").filter({ hasText: "开始体验" }).click();
  await mini.waitForURL(/experience\/task/);
  await expect(
    mini.getByText("旧版步骤：观察叶片的纹理。", { exact: true }),
  ).toBeVisible();
  const sessionURL = mini.url();
  await admin
    .locator(".item")
    .filter({ hasText: title })
    .getByRole("button", { name: "编辑 / 预览", exact: true })
    .click();
  await admin.getByLabel("课程名称", { exact: true }).fill(title + "新版");
  await admin.locator(".step textarea").fill("新版步骤：观察新的内容。");
  await admin.getByRole("button", { name: "保存草稿", exact: true }).click();
  await expect(
    admin.getByText("草稿已保存，发布后小程序才会更新"),
  ).toBeVisible();
  await admin
    .getByRole("button", { name: "发布已保存版本", exact: true })
    .click();
  await expect(admin.getByText("课程操作完成", { exact: true })).toBeVisible();
  await mini.reload();
  await expect(
    mini.getByText("旧版步骤：观察叶片的纹理。", { exact: true }),
  ).toBeVisible();
  await expect(mini.locator(".step-card__image-wrap img")).toHaveJSProperty(
    "complete",
    true,
  );
  await mini.locator(".app-button").filter({ hasText: "完成步骤" }).click();
  await mini.locator(".mood-option").filter({ hasText: "平静" }).click();
  await mini.locator(".app-button").filter({ hasText: "完成体验" }).click();
  await mini.waitForURL(/imprint/);
  await expect(mini.getByText(title, { exact: true })).toBeVisible();
  const recordURL = mini.url();
  await mini.getByText("同步上传社区", { exact: true }).click();
  await mini.getByText("确定", { exact: true }).click();
  await expect(mini.getByText("已提交，等待审核")).toBeVisible();
  await admin.getByRole("button", { name: "社区帖子", exact: true }).click();
  await expect(
    admin
      .locator(".item")
      .filter({ hasText: title })
      .getByText("待审核 · 成员", { exact: true }),
  ).toBeVisible();
  await admin.getByRole("button", { name: "课程资源", exact: true }).click();
  await admin
    .locator(".item")
    .filter({ hasText: title + "新版" })
    .getByRole("button", { name: "下架", exact: true })
    .click();
  await expect(admin.getByText("课程操作完成", { exact: true })).toBeVisible();
  await mini.goto(sessionURL);
  await expect(mini.getByText("查看自然印记", { exact: true })).toBeVisible();
  await mini.locator(".app-button").filter({ hasText: "查看自然印记" }).click();
  await expect(mini).toHaveURL(recordURL);
  if (errors.length) throw new Error(errors.join("\n"));
  console.log(
    JSON.stringify(
      {
        passed: true,
        coverage:
          "admin course create → step image → draft → publish → mini task → republish → old snapshot + image restore → completed record → community sync → offline course does not break completed session",
        pageErrors: errors,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
