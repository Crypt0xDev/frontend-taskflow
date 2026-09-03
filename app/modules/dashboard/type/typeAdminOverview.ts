import type { Comment } from "@/app/modules/comments/type/typeCommentBase";
import type { User } from "@/lib/session";

export type UsersOverview = {
  totals: { users: number; admins: number; users_normal: number };
  recentUsers: User[];
};

export type CommentsOverview = {
  total: number;
  recentComments: Comment[];
};
