export type UserCreateInput = {
  email: string;
  user_name?: string | null;
  password: string;
  role_id: number;
};
