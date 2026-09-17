import { expect, test } from "@playwright/test";

/** Exercise the complete deterministic todo journey through the browser. */
test("supports deterministic creation, completion, deletion, and empty state", async ({ page }) => {
  const browserProblems: string[] = [];
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) browserProblems.push(`${message.type()}: ${message.text()}`);
  });
  page.on("pageerror", (error) => browserProblems.push(`pageerror: ${error.message}`));

  await page.goto("/index.html");
  await expect(page.getByRole("heading", { name: "Todo App" })).toBeVisible();
  await expect(page.getByTestId("empty-state")).toHaveText("No tasks yet.");
  await expect(page.getByTestId("empty-state")).toBeVisible();
  await expect(page.getByTestId("todo-list")).toBeEmpty();

  const input = page.getByTestId("todo-input");
  await input.fill("  Buy milk  ");
  await page.getByTestId("add-button").click();
  await expect(page.getByTestId("todo-item-1")).toBeVisible();
  await expect(page.getByTestId("todo-title-1")).toHaveText("Buy milk");
  await expect(input).toHaveValue("");
  await expect(page.getByTestId("empty-state")).toBeHidden();

  await input.fill("Walk dog");
  await input.press("Enter");
  await expect(page.getByTestId("todo-item-2")).toBeVisible();
  await expect(page.getByTestId("todo-title-2")).toHaveText("Walk dog");
  await expect(page.getByTestId("todo-list").locator("li")).toHaveCount(2);
  await expect(page.getByTestId("todo-list").locator("li")).toEvaluateAll((items) => items.map((item) => item.dataset.testid), ["todo-item-1", "todo-item-2"]);

  await input.fill("   ");
  await page.getByTestId("add-button").click();
  await input.press("Enter");
  await expect(page.getByTestId("todo-list").locator("li")).toHaveCount(2);

  const firstTitle = page.getByTestId("todo-title-1");
  const secondTitle = page.getByTestId("todo-title-2");
  await page.getByTestId("todo-checkbox-1").check();
  await expect(firstTitle).toHaveCSS("text-decoration-line", "line-through");
  await expect(secondTitle).toHaveCSS("text-decoration-line", "none");
  await page.getByTestId("todo-checkbox-1").uncheck();
  await expect(firstTitle).toHaveCSS("text-decoration-line", "none");

  await page.getByTestId("todo-delete-1").click();
  await expect(page.getByTestId("todo-item-1")).toHaveCount(0);
  await expect(page.getByTestId("todo-item-2")).toBeVisible();
  await page.getByTestId("todo-delete-2").click();
  await expect(page.getByTestId("todo-list")).toBeEmpty();
  await expect(page.getByTestId("empty-state")).toBeVisible();
  await page.screenshot({ path: "test-results/todo-workflow.png", fullPage: true });
  await expect(browserProblems).toEqual([]);
});
