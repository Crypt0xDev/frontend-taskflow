export type Comment = {
  id: number;
  body: string;
  author: { id: number; username: string } | null;
  created_at: string;
};
