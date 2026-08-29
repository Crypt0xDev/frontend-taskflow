export type Permission = {
  id: number;
  module: string;
  name: string;
  description: string | null;
};

export type Role = {
  id: number;
  name: string;
  description: string | null;
  permissions: Permission[];
  permissions_count?: number;
};
