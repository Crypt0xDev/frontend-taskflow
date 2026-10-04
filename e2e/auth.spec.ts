import { expect, test } from "@playwright/test";

import { login } from "./helpers";
import { E2E_USERS } from "./users";

test("guest visiting a private route is sent to login with the return path", async ({ page }) => {
  await page.goto("/tasks");

  await expect(page).toHaveURL(/\/login\?next=%2Ftasks$/);
});

test("wrong password shows the error and stays on login", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Correo").fill(E2E_USERS.demo.email);
  await page.getByLabel("Contraseña").fill("no-es-la-clave");
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page.getByText("Usuario y contraseña incorrectos.")).toBeVisible();
  await expect(page).toHaveURL(/\/login/);
});

test("user can log in, is kept out of login, and logs out", async ({ page }) => {
  await login(page, E2E_USERS.demo);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(E2E_USERS.demo.username);

  await page.goto("/login");
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.getByRole("button", { name: E2E_USERS.demo.username }).click();
  await page.getByRole("menuitem", { name: "Salir" }).click();
  await expect(page).toHaveURL(/\/login/);

  // El token ya no vale: las rutas privadas vuelven a pedir login.
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
});
