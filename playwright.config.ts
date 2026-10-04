import { defineConfig, devices } from "@playwright/test";

import { E2E_USERS } from "./e2e/users";

const BACKEND_DIR = process.env.E2E_BACKEND_DIR ?? "../backend-taskflow";
const API_PORT = 8001;
const WEB_PORT = 3100;

export default defineConfig({
  testDir: "./e2e",
  workers: 1,
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${WEB_PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "php artisan migrate:fresh --seed --force && php artisan serve --port=8001 --no-reload",
      cwd: BACKEND_DIR,
      url: `http://127.0.0.1:${API_PORT}/api/v1/me`,
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        APP_ENV: "local",
        DB_DATABASE: process.env.E2E_DB_DATABASE ?? "taskflow_e2e",
        FRONTEND_URL: `http://localhost:${WEB_PORT}`,
        CACHE_DRIVER: "array",
        SESSION_DRIVER: "array",
        MAIL_MAILER: "log",
        ADMIN_EMAIL: E2E_USERS.admin.email,
        ADMIN_USERNAME: E2E_USERS.admin.username,
        ADMIN_PASSWORD: E2E_USERS.admin.password,
        DEMO_EMAIL: E2E_USERS.demo.email,
        DEMO_USERNAME: E2E_USERS.demo.username,
        DEMO_PASSWORD: E2E_USERS.demo.password,
      },
    },
    {

      command:
        "npx next build && cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/ && node .next/standalone/server.js",
      url: `http://localhost:${WEB_PORT}`,
      reuseExistingServer: false,
      timeout: 300_000,
      env: {
        PORT: String(WEB_PORT),
        HOSTNAME: "localhost",
        NEXT_PUBLIC_API_URL: `http://127.0.0.1:${API_PORT}/api/v1`,
        NEXT_PUBLIC_TOKEN_KEY: "taskflow_token",
        NEXT_PUBLIC_SESSION_FLAG_COOKIE: "tf_has_session",
        NEXT_PUBLIC_REQUEST_TIMEOUT_MS: "15000",
        NEXT_PUBLIC_PAGE_SIZE: "8",
        NEXT_PUBLIC_SESSION_MAX_AGE_MINUTES: "60",
      },
    },
  ],
});
