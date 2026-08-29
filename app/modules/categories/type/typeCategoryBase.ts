export type Category = {
  id: number;
  name: string;
  description: string | null;
  color: string | null;
  tasks_count?: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
