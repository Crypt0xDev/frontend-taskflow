import { expect, type Page } from "@playwright/test";

import type { E2EUser } from "./users";

export async function login(page: Page, user: E2EUser) {
  await page.goto("/login");
  await page.getByLabel("Correo").fill(user.email);
  await page.getByLabel("Contraseña").fill(user.password);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}
