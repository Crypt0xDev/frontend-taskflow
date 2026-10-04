export const E2E_USERS = {
  admin: { email: "admin@e2e.test", username: "admin_e2e", password: "e2e-admin-password" },
  demo: { email: "demo@e2e.test", username: "demo_e2e", password: "e2e-demo-password" },
};

export type E2EUser = (typeof E2E_USERS)[keyof typeof E2E_USERS];
