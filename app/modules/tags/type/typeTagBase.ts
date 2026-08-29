export type Tag = {
  id: number;
  name: string;
  description: string | null;
  color: string | null;
  tasks_count?: number;
  created_at: string;
};
