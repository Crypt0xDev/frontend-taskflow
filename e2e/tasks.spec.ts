import { expect, test, type Page } from "@playwright/test";

import { login } from "./helpers";
import { E2E_USERS } from "./users";

const row = (page: Page, title: string) => page.getByRole("row", { name: new RegExp(title) });

test("task lifecycle: create, edit, trash and restore", async ({ page }) => {
  const title = `Tarea E2E ${Date.now()}`;
  const edited = `${title} editada`;
  const main = page.locator("main").last();

  await login(page, E2E_USERS.demo);
  await page.goto("/tasks");

  // Crear
  await main.getByRole("button", { name: "Crear" }).click();
  const form = page.getByRole("dialog", { name: "Nueva tarea" });
  await form.getByLabel("Título").fill(title);
  await form.getByLabel("Descripción").fill("Creada por Playwright");
  await form.getByRole("button", { name: "Guardar" }).click();
  await expect(form).toBeHidden();
  await expect(row(page, title)).toBeVisible();

  // Editar
  await row(page, title).click();
  await main.getByRole("button", { name: "Editar" }).click();
  const editForm = page.getByRole("dialog");
  await editForm.getByLabel("Título").fill(edited);
  await editForm.getByRole("button", { name: "Guardar" }).click();
  await expect(row(page, edited)).toBeVisible();

  // Enviar a la papelera
  await expect(row(page, edited)).toHaveAttribute("data-state", "selected");
  await main.getByRole("button", { name: "Eliminar" }).click();
  await expect(page.getByText(`La tarea «${edited}» se moverá a la papelera.`)).toBeVisible();
  await page.getByRole("button", { name: "Enviar a papelera" }).click();
  await expect(row(page, edited)).toBeHidden();

  // Restaurar desde la papelera
  await main.getByRole("button", { name: "Papelera" }).click();
  const trash = page.getByRole("dialog", { name: "Papelera" });
  await expect(trash.getByText(edited)).toBeVisible();
  await trash.getByRole("button", { name: "Restaurar", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(row(page, edited)).toBeVisible();
});

test("task form does not submit without a title", async ({ page }) => {
  await login(page, E2E_USERS.demo);
  await page.goto("/tasks");

  await page.locator("main").last().getByRole("button", { name: "Crear" }).click();
  const form = page.getByRole("dialog", { name: "Nueva tarea" });
  await form.getByRole("button", { name: "Guardar" }).click();

  await expect(form).toBeVisible();
});
