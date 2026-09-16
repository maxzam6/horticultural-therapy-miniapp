// Requires local:server, local:mini, local:admin. Tests only loopback development data.
import { chromium, expect } from "@playwright/test";
import fs from "node:fs/promises";
const password = process.env.GARDEN_LOCAL_PASSWORD;
if (!password)
  throw new Error(
    "Set GARDEN_LOCAL_PASSWORD to the local server temporary password",
  );
await fs.mkdir("test-results", { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const errors = [];
const commentText = "新叶真好看！ " + Date.now(),
  officialReply = "项目组：谢谢你细心观察。 " + Date.now();
const diaryTitle = "阳台上的新叶 " + Date.now(),
  officialTitle = "本周自然精选 " + Date.now();
const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  }),
  contextB = await browser.newContext({
    viewport: { width: 390, height: 844 },
  }),
  adminContext = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
const a = await context.newPage(),
  b = await contextB.newPage(),
  admin = await adminContext.newPage();
for (const page of [a, b, admin])
  page.on("pageerror", (e) => errors.push(e.message));
const clickButton = (page, text) =>
  page.getByText(text, { exact: true }).click();
async function memberLogin(page, name) {
  await page.goto("http://127.0.0.1:5173/#/pages/community/index");
  await page.locator(".identity input").nth(0).fill(name);
  await page.locator(".identity input").nth(1).fill(password);
  await clickButton(page, "连接社区 / 刷新成员状态");
  await expect
    .poll(
      async () =>
        (await page.getByText("申请已提交，请等待项目组批准。").count()) ||
        !(await page.locator(".identity uni-button").count()),
    )
    .toBeTruthy();
}
let stage = "login";
try {
  await admin.goto("http://127.0.0.1:5174");
  await admin.getByLabel("账号", { exact: true }).fill("admin");
  await admin.getByLabel("密码", { exact: true }).fill(password);
  await clickButton(admin, "登录");
  await expect(admin.getByText("超级管理员", { exact: true })).toBeVisible();
  await memberLogin(a, "member-a");
  await memberLogin(b, "member-b");
  await clickButton(admin, "成员管理");
  let approvals = admin.getByRole("button", {
    name: "批准 / 恢复",
    exact: true,
  });
  await expect(approvals.first()).toBeVisible();
  for (let i = 0; i < (await approvals.count()); i++) {
    await approvals.nth(i).click();
    await expect(admin.getByRole("button", { name: "刷新列表" })).toBeEnabled();
  }
  await a.reload();
  await b.reload();
  await expect(a.getByText("登录已过期", { exact: true })).toHaveCount(0);
  stage = "original-core";
  await a.goto("http://127.0.0.1:5173/");
  await a
    .locator(".app-button")
    .filter({ hasText: "开始体验" })
    .first()
    .click();
  await a.waitForURL(/auth/);
  await a.locator(".app-button").click();
  await a.waitForURL(/profile/);
  await a.locator(".nickname-input input").fill("自然测试者");
  await a.getByText("19–22 岁", { exact: true }).click();
  await a.getByText("初次接触", { exact: true }).click();
  await a.getByText("放松心情", { exact: true }).click();
  await a.locator(".app-button").filter({ hasText: "保存档案" }).click();
  await a.waitForURL(/assessment\/intro/);
  await a.locator(".app-button").click();
  await a.waitForURL(/questions/);
  for (let i = 0; i < 10; i++) {
    await a.locator(".question-option").nth(2).click();
    await a
      .locator(".app-button")
      .filter({ hasText: i === 9 ? "提交并查看报告" : "下一题" })
      .click();
  }
  await a.waitForURL(/assessment\/result/);
  await a.locator(".app-button").filter({ hasText: "进入探索" }).click();
  await a.waitForURL(/explore/);
  await a.locator(".app-button").filter({ hasText: "进入五感花园" }).click();
  await a.waitForURL(/garden/);
  await a.getByText("多肉种植体验", { exact: true }).first().click();
  await a.waitForURL(/course\/detail/);
  await a.locator(".app-button").filter({ hasText: "开始体验" }).click();
  await a.waitForURL(/experience\/task/);
  for (let i = 0; i < 5; i++)
    await a
      .locator(".app-button")
      .filter({ hasText: i === 4 ? "完成步骤" : "下一步" })
      .click();
  await a.locator(".mood-option").filter({ hasText: "放松" }).click();
  await a
    .locator(".feedback-card__textarea textarea")
    .fill("全流程测试：感受到土壤的温度。");
  await a.locator(".app-button").filter({ hasText: "完成体验" }).click();
  await a.waitForURL(/imprint/);
  const recordURL = a.url();
  await a.reload();
  await expect(a.getByText("全流程测试：感受到土壤的温度。")).toBeVisible();
  await a.locator(".app-button").filter({ hasText: "查看我的记录" }).click();
  await a.waitForURL(/records/);
  stage = "journal";
  await a.locator(".app-button").filter({ hasText: "写自然日记" }).click();
  await a.waitForURL(/journal\/edit/);
  await a.locator(".journal-edit input").last().fill(diaryTitle);
  await a
    .locator(".journal-edit textarea")
    .fill("今天为多肉浇了一点水，看见一片新的叶子。");
  const chooser = a.waitForEvent("filechooser");
  await clickButton(a, "＋ 拍照 / 选择照片");
  await (await chooser).setFiles("src/static/illustrations/sensory-garden.jpg");
  await expect(a.getByText("移除", { exact: true })).toBeVisible();
  await clickButton(a, "保存自然日记");
  await a.waitForURL(/journal\/detail/, { timeout: 30000 });
  const journalURL = a.url();
  await expect(a.getByText("仅自己可见", { exact: false })).toBeVisible();
  await b.reload();
  await expect(b.getByText(diaryTitle, { exact: true })).toHaveCount(0);
  await clickButton(a, "同步上传社区");
  await a.getByText("确定", { exact: true }).click();
  await expect(a.getByText("审核中", { exact: false })).toBeVisible();
  stage = "review-publish";
  await clickButton(admin, "社区帖子");
  await admin
    .getByPlaceholder("例如：人工核验图文内容符合项目要求")
    .fill("已核验自然照片与体验文字");
  await admin
    .locator(".item")
    .filter({ hasText: diaryTitle })
    .getByRole("button", { name: "审核通过", exact: true })
    .click();
  await b.reload();
  await b.getByText(diaryTitle, { exact: true }).click();
  await b.waitForURL(/community\/detail/);
  await clickButton(b, "♡ 点赞 0");
  await expect(b.getByText("♥ 已点赞 1", { exact: true })).toBeVisible();
  await b.locator(".post-detail textarea").fill(commentText);
  await clickButton(b, "发送评论");
  await expect(
    b.locator(".comment").getByText(commentText, { exact: true }),
  ).toBeVisible();
  await clickButton(admin, "评论管理");
  await admin
    .getByPlaceholder("例如：人工核验图文内容符合项目要求")
    .fill("核验评论");
  await admin
    .locator(".item")
    .filter({ hasText: commentText })
    .getByRole("button", { name: "审核通过", exact: true })
    .click();
  stage = "official";
  await clickButton(admin, "社区帖子");
  await admin
    .getByPlaceholder("填写后，点击对应帖子的“官方评论”")
    .fill(officialReply);
  await admin
    .locator(".item")
    .filter({ hasText: diaryTitle })
    .getByRole("button", { name: "官方评论", exact: true })
    .click();
  await clickButton(admin, "评论管理");
  await admin
    .locator(".item")
    .filter({ hasText: officialReply })
    .getByRole("button", { name: "审核通过", exact: true })
    .click();
  await clickButton(admin, "社区帖子");
  await clickButton(admin, "＋ 官方发帖 / 每周精选");
  await admin.getByLabel("标题", { exact: true }).fill(officialTitle);
  await admin
    .getByLabel("正文", { exact: true })
    .fill("让我们一起看看本周的新叶。");
  await admin.getByRole("checkbox", { name: new RegExp(diaryTitle) }).check();
  await clickButton(admin, "保存并提交审核");
  await admin
    .locator(".item")
    .filter({ hasText: officialTitle })
    .getByRole("button", { name: "审核通过", exact: true })
    .click();
  await b.goto("http://127.0.0.1:5173/#/pages/community/index");
  await b.getByText(officialTitle, { exact: true }).click();
  await expect(b.getByText(`本周精选 · ${diaryTitle}`)).toBeVisible();
  await b.screenshot({
    path: "test-results/community-official.png",
    fullPage: true,
  });
  await admin.screenshot({
    path: "test-results/admin-community.png",
    fullPage: true,
  });
  stage = "withdrawal";
  await a.goto(journalURL);
  await clickButton(a, "取消同步");
  await a.getByText("确定", { exact: true }).click();
  await expect(a.getByText("仅自己可见", { exact: false })).toBeVisible();
  await b.reload();
  await expect(b.getByText(`本周精选 · ${diaryTitle}`)).toHaveCount(0);
  await a.goto(recordURL);
  await expect(a.getByText("全流程测试：感受到土壤的温度。")).toBeVisible();
  await a.goto("http://127.0.0.1:5173/#/pages/mine/index");
  await expect(
    a.getByText("自然测试者", { exact: false }).first(),
  ).toBeVisible();
  assertNoErrors();
  console.log(
    JSON.stringify(
      {
        passed: true,
        coverage:
          "P01→P13 + private photo journal + two member feed + likes/comments + admin approval + official post/selection/comment + withdrawal + reload",
        recordURL,
        journalURL,
        pageErrors: errors,
      },
      null,
      2,
    ),
  );
} catch (e) {
  console.error("FAILED STAGE:", stage);
  console.error("A:", (await a.locator("body").innerText()).slice(-4000));
  console.error(
    "ADMIN:",
    (await admin.locator("body").innerText()).slice(-2000),
  );
  await a.screenshot({ path: "test-results/e2e-failure.png", fullPage: true });
  throw e;
} finally {
  await browser.close();
}
function assertNoErrors() {
  if (errors.length) throw new Error(`Browser errors: ${errors.join("; ")}`);
}
