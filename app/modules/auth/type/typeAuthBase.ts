import type { User } from "@/lib/session";

export type Credentials = {
  email: string;
  password: string;
};

export type RegisterInput = Credentials & {
  password_confirmation: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};
