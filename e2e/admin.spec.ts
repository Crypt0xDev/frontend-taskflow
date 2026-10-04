import { expect, test } from "@playwright/test";

import { login } from "./helpers";
import { E2E_USERS } from "./users";

test("regular user does not see the admin menu nor reach it by URL", async ({ page }) => {
  await login(page, E2E_USERS.demo);

  await expect(page.getByRole("link", { name: "Usuarios" })).toHaveCount(0);

  await page.goto("/admin/users");
  await expect(page).toHaveURL(/\/dashboard$/);
});

test("admin sees the users panel with registered accounts", async ({ page }) => {
  await login(page, E2E_USERS.admin);

  await page.getByRole("link", { name: "Usuarios" }).first().click();
  await expect(page).toHaveURL(/\/admin\/users$/);
  await expect(page.getByRole("row", { name: new RegExp(E2E_USERS.demo.username) })).toBeVisible();
});
