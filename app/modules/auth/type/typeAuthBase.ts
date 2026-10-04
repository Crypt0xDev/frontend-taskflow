import type { User } from "@/lib/session";

export type Credentials = {
  email: string;
  password: string;
};

export type RegisterInput = Credentials & {
  user_name: string;
  password_confirmation: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};
